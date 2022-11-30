use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::ModelTrait;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::parties::PartyToWishlistItemFulfillments;
use crate::entities::{users, wishlist_item_user_fulfillments};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;
use crate::routes::api::me::wishlist_items::id::fulfillments::censor_fulfillments;

#[get("/parties/<id>/fulfillments")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<wishlist_item_user_fulfillments::Model>>>> {
    let party = match find_participating_party(id, &db, &user).await? {
        Some(party) => party,
        None => bail_msg!("Party not found."),
    };

    let query = party.find_linked(PartyToWishlistItemFulfillments);
    let censored = censor_fulfillments(query, &user).all(&*db).await?;

    Ok(Some(Json(censored)))
}
