use nanoid::nanoid;
use rocket::form::Form;
use rocket::fs::TempFile;
use rocket::http::MediaType;
use rocket::serde::json::Json;
use rocket::{put, FromForm};
use rocket_db_pools::Connection;
use sea_orm::{ActiveModelTrait, Set};
use tokio::fs;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

use super::index::SanitizedUser;

pub fn get_upload_filepath(filename: &str) -> String {
    format!(
        "{}/../frontend/public/uploads/{}",
        env!("CARGO_MANIFEST_DIR"),
        filename,
    )
}

#[derive(FromForm)]
pub struct Upload<'r> {
    pub file: TempFile<'r>,
}

#[put("/pfp", data = "<form>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    mut form: Form<Upload<'_>>,
) -> RocketResult<Json<SanitizedUser>> {
    let allowed = vec![
        MediaType::PNG,
        MediaType::JPEG,
        MediaType::GIF,
        MediaType::WEBP,
    ];

    let file = &mut form.file;

    let content_type = match file.content_type() {
        Some(content_type) => content_type,
        None => bail_msg!("Could not determine filetype."),
    };

    let extension = if allowed.contains(content_type.media_type()) {
        content_type.extension()
    } else {
        bail_msg!("Incorrect filetype.");
    };

    let extension = match extension {
        Some(ext) => ext,
        None => bail_msg!("Unable to determine signature."),
    };

    let id = nanoid!();
    let filename = format!("{}.{}", id, extension);
    let path = get_upload_filepath(&filename);
    let old_pfp = &user.profile_picture.to_owned();

    file.persist_to(path).await?;

    let mut active: users::ActiveModel = user.into();
    active.profile_picture = Set(Some(filename));
    let user = active.update(&*db).await?;

    // remove previous pfp, ignore any errors
    if let Some(path) = old_pfp {
        fs::remove_file(get_upload_filepath(path)).await.ok();
    }

    Ok(Json(user.into()))
}
