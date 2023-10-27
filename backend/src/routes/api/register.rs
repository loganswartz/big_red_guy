use rocket::post;
use rocket::response::Responder;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use sea_orm::ActiveValue;
use serde::{Deserialize, Serialize};

use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;
use crate::utils;

use super::me::index::SanitizedUser;

#[derive(Deserialize, Debug)]
pub struct RegistrationForm<'r> {
    pub name: &'r str,
    pub email: &'r str,
    pub password: &'r str,
}

#[derive(Debug, Serialize)]
pub struct ErrorMessage<'a> {
    pub message: &'a str,
}

#[derive(Debug, Responder)]
pub enum RegistrationOutcome<'a> {
    #[response(status = 200, content_type = "json")]
    Account(Json<SanitizedUser>),
    #[response(status = 422, content_type = "json")]
    Error(Json<ErrorMessage<'a>>),
}

#[post("/register", data = "<values>")]
pub async fn post(
    db: Connection<Db>,
    values: Json<RegistrationForm<'_>>,
) -> RocketResult<RegistrationOutcome> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(values.email))
        .one(&*db)
        .await?;

    if result.is_some() {
        return Ok(RegistrationOutcome::Error(Json(ErrorMessage {
            message: "That email is already in use.",
        })));
    }

    if values.password.len() < 12 {
        return Ok(RegistrationOutcome::Error(Json(ErrorMessage {
            message: "Password must be at least 12 characters long.",
        })));
    }

    let hash = match utils::make_salted_hash(values.password) {
        Ok(hash) => hash,
        Err(_) => {
            return Ok(RegistrationOutcome::Error(Json(ErrorMessage {
                message: "Something went wrong.",
            })))
        }
    };

    let new = users::ActiveModel {
        name: ActiveValue::Set(values.name.to_string()),
        email: ActiveValue::Set(values.email.to_string()),
        password: ActiveValue::Set(hash),
        ..Default::default()
    };

    let new = new.insert(&*db).await?;

    Ok(RegistrationOutcome::Account(Json(new.into())))
}
