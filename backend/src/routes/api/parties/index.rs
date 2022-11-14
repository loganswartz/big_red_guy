use rocket::{form::Form, get, post, serde::json::Json, FromForm};
use rocket_db_pools::Connection;
use sea_orm::{ActiveModelTrait, ActiveValue, ModelTrait};

use crate::db::pool::Db;
use crate::entities::{parties, users};
use crate::rocket_anyhow::Result as RocketResult;

#[derive(FromForm, Debug)]
pub struct AddParty<'r> {
    pub name: &'r str,
}

#[get("/parties")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
) -> RocketResult<Json<Vec<parties::Model>>> {
    let parties = user.find_related(parties::Entity).all(&*db).await?;

    Ok(Json(parties))
}

#[post("/parties", data = "<form>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddParty<'_>>,
) -> RocketResult<Json<parties::Model>> {
    let new = parties::ActiveModel {
        name: ActiveValue::Set(form.name.to_owned()),
        owner_id: ActiveValue::Set(user.id),
        ..Default::default()
    };

    let model = new.insert(&*db).await?;

    Ok(Json(model))
}
