use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::ModelTrait;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::parties::PartyToWishlistItemFulfillments;
use crate::entities::{users, wishlist_item_user_fulfillments, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;

#[get("/parties/<id>/fulfillments")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<wishlist_item_user_fulfillments::Model>>>> {
    let party = match find_participating_party(id, &*db, &user).await? {
        Some(party) => party,
        None => bail_msg!("Party not found."),
    };

    let fulfillments = party
        .find_linked(PartyToWishlistItemFulfillments)
        .all(&*db)
        .await?;

    let own_items = user.find_related(wishlist_items::Entity).all(&*db).await?;
    let ids: Vec<i32> = own_items.iter().map(|model| model.id).collect();
    let filtered: Vec<wishlist_item_user_fulfillments::Model> = fulfillments
        .into_iter()
        .filter(|model| !ids.contains(&model.wishlist_item_id))
        .collect();

    Ok(Some(Json(filtered)))
}
