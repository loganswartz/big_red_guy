use rocket::post;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use sea_orm::ActiveValue;
use serde::Deserialize;

use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;
use crate::{bail_msg, utils};

use super::me::index::Me;

#[derive(Deserialize, Debug)]
pub struct Credentials<'r> {
    pub email: &'r str,
    pub password: &'r str,
}

#[post("/register", data = "<credentials>")]
pub async fn post(
    db: Connection<Db>,
    credentials: Json<Credentials<'_>>,
) -> RocketResult<Json<Me>> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await?;

    if let Some(_) = result {
        bail_msg!("That email is already in use.");
    }

    let hash = utils::make_password_hash(credentials.password)?;

    let new = users::ActiveModel {
        name: ActiveValue::Set(credentials.email.to_string()),
        email: ActiveValue::Set(credentials.email.to_string()),
        password: ActiveValue::Set(hash),
        ..Default::default()
    };

    let new = new.insert(&*db).await?;

    Ok(Json(Me {
        name: new.name,
        email: new.email,
    }))
}
