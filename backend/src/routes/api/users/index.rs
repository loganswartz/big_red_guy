use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;

use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

#[get("/users")]
pub async fn get(_user: users::Model, db: Connection<Db>) -> RocketResult<Json<Vec<users::Model>>> {
    let users = users::Entity::find().all(&*db).await?;

    Ok(Json(users))
}
