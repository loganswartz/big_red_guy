use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::ModelTrait;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::{users, wishlists};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;

#[get("/parties/<id>/lists")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<wishlists::Model>>>> {
    let party = find_participating_party(id, &*db, &user).await?;

    let party = match party {
        Some(party) => party,
        None => bail_msg!("Party not found."),
    };

    let lists = party.find_related(wishlists::Entity).all(&*db).await?;

    Ok(Some(Json(lists)))
}
