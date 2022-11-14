use rocket::{
    http::{Cookie, CookieJar, Status},
    post,
    response::status,
    serde::json::Json,
};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use serde::Serialize;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

use super::register::Credentials;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct AuthResponse {
    pub success: bool,
}

#[post("/login", data = "<credentials>")]
pub async fn post(
    db: Connection<Db>,
    cookies: &CookieJar<'_>,
    credentials: Json<Credentials<'_>>,
) -> RocketResult<status::Custom<Json<AuthResponse>>> {
    let found = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await?;

    let user = match found {
        Some(user) => user,
        None => {
            bail_msg!("User not found.");
        }
    };

    if user.verify_password(credentials.password) {
        cookies.add_private(Cookie::new(users::Model::COOKIE_ID, user.id.to_string()));
        return Ok(status::Custom(
            Status::Ok,
            Json(AuthResponse { success: true }),
        ));
    } else {
        return Ok(status::Custom(
            Status::Unauthorized,
            Json(AuthResponse { success: false }),
        ));
    }
}
