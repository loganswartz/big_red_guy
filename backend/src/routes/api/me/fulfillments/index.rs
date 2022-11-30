use std::borrow::Cow;

use rocket::post;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, QueryFilter, Set,
};
use serde::Deserialize;

use crate::bail_msg;
use crate::entities::wishlist_items::WishlistItemToUsers;
use crate::entities::{wishlist_item_user_fulfillments, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::{db::pool::Db, entities::users};

#[derive(Deserialize, Debug)]
pub struct FulfillWishlistItem<'a> {
    pub wishlist_item_id: i32,
    #[serde(borrow)]
    pub notes: Option<Cow<'a, str>>,
    pub quantity: i32,
}

pub async fn item_is_shared_with_user(
    item_id: i32,
    user_id: i32,
    db: &DatabaseConnection,
) -> RocketResult<wishlist_items::Model> {
    let item = wishlist_items::Entity::find_by_id(item_id).one(db).await?;

    let item = match item {
        Some(model) => model,
        None => bail_msg!("Item not found."),
    };

    // check that the user somehow has access to this item
    let allowed = item
        .find_linked(WishlistItemToUsers)
        .filter(users::Column::Id.eq(user_id))
        .one(db)
        .await?;

    if allowed.is_none() {
        bail_msg!("Item not found.");
    }

    Ok(item)
}

#[post("/fulfillments", data = "<form>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    form: Json<FulfillWishlistItem<'_>>,
) -> RocketResult<Json<wishlist_item_user_fulfillments::Model>> {
    item_is_shared_with_user(form.wishlist_item_id, user.id, &db).await?;

    let assignment = wishlist_item_user_fulfillments::ActiveModel {
        wishlist_item_id: Set(form.wishlist_item_id),
        user_id: Set(user.id),
        notes: Set(form.notes.clone().map(|value| value.to_string())),
        quantity: Set(form.quantity),
        ..Default::default()
    };

    let model = assignment.insert(&*db).await?;

    Ok(Json(model))
}
