use rocket::{
    http::{Cookie, CookieJar, Status},
    post,
    response::status,
    serde::json::Json,
};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct LoginForm<'r> {
    pub email: &'r str,
    pub password: &'r str,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct AuthResponse {
    pub success: bool,
}

#[post("/login", data = "<values>")]
pub async fn post(
    db: Connection<Db>,
    cookies: &CookieJar<'_>,
    values: Json<LoginForm<'_>>,
) -> RocketResult<status::Custom<Json<AuthResponse>>> {
    let found = users::Entity::find()
        .filter(users::Column::Email.contains(values.email))
        .one(&*db)
        .await?;

    let Some(user) = found else {
        bail_msg!("User not found.");
    };

    if user.verify_password(values.password) {
        cookies.add_private(Cookie::new(users::Model::COOKIE_ID, user.id.to_string()));
        Ok(status::Custom(
            Status::Ok,
            Json(AuthResponse { success: true }),
        ))
    } else {
        Ok(status::Custom(
            Status::Unauthorized,
            Json(AuthResponse { success: false }),
        ))
    }
}
