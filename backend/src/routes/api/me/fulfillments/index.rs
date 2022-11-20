use rocket::post;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, ModelTrait, QueryFilter, Set, TryIntoModel,
};
use serde::Deserialize;

use crate::bail_msg;
use crate::entities::wishlist_items::WishlistItemToUsers;
use crate::entities::{wishlist_item_user_fulfillments, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::{db::pool::Db, entities::users};

#[derive(Deserialize, Debug)]
pub struct FulfillWishlistItem {
    pub wishlist_item_id: i32,
    pub quantity: i32,
}

#[post("/fulfillments", data = "<form>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    form: Json<FulfillWishlistItem>,
) -> RocketResult<Json<wishlist_item_user_fulfillments::Model>> {
    let item = wishlist_items::Entity::find_by_id(form.wishlist_item_id)
        .one(&*db)
        .await?;

    let item = match item {
        Some(model) => model,
        None => bail_msg!("Item not found."),
    };

    // check that the user somehow has access to this item
    let allowed = item
        .find_linked(WishlistItemToUsers)
        .filter(users::Column::Id.eq(user.id))
        .one(&*db)
        .await?;

    if let None = allowed {
        bail_msg!("Item not found.");
    }

    let assignment = wishlist_item_user_fulfillments::ActiveModel {
        wishlist_item_id: Set(form.wishlist_item_id),
        user_id: Set(user.id),
        quantity: Set(form.quantity),
        ..Default::default()
    };

    let model = assignment.insert(&*db).await?;

    Ok(Json(model))
}
