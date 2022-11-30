use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;

use crate::db::pool::Db;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

#[get("/users/<id>")]
pub async fn get(
    _user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<users::Model>>> {
    let found = users::Entity::find_by_id(id).one(&*db).await?.map(Json);

    Ok(found)
}
