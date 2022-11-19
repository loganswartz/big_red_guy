use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::ModelTrait;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::parties::PartyToWishlistItems;
use crate::entities::{users, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;

#[get("/parties/<party_id>/wishlists/items")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
) -> RocketResult<Option<Json<Vec<wishlist_items::Model>>>> {
    let party = find_participating_party(party_id, &*db, &user).await?;

    let items = match party {
        Some(found) => found.find_linked(PartyToWishlistItems).all(&*db).await?,
        None => bail_msg!("Party not found."),
    };

    Ok(Some(Json(items)))
}
