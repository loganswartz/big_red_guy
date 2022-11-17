use rocket::serde::json::Json;
use rocket::{get, post};
use rocket_db_pools::Connection;
use sea_orm::{entity::prelude::*, sea_query, ModelTrait, Set};

use crate::db::pool::Db;
use crate::entities::{users, wishlist_item_list_assignments, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::wishlist_items::id::AddWishlistItem;
use crate::routes::api::wishlists::id::find_wishlist;

#[get("/wishlists/<list_id>/items")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    list_id: i32,
) -> Option<Json<Vec<wishlist_items::Model>>> {
    let wishlist = find_wishlist(list_id, &*db, user).await;

    let items = wishlist?
        .find_related(wishlist_items::Entity)
        .all(&*db)
        .await;

    match items {
        Ok(items) => Some(Json(items)),
        Err(_) => None,
    }
}

#[post("/wishlists/<id>/items", data = "<form>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    form: Json<AddWishlistItem<'_>>,
    id: i32,
) -> RocketResult<Json<wishlist_items::Model>> {
    // make the new item
    let item = wishlist_items::ActiveModel {
        name: Set(form.name.to_owned()),
        url: Set(form.url.map_or(None, |value| Some(value.to_owned()))),
        quantity: Set(form.quantity),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let item = item.insert(&*db).await?;

    // assign it to the list
    let assignment = wishlist_item_list_assignments::ActiveModel {
        wishlist_id: Set(id),
        wishlist_item_id: Set(item.id),
        ..Default::default()
    };

    wishlist_item_list_assignments::Entity::insert(assignment)
        .on_conflict(
            sea_query::OnConflict::columns(
                vec![
                    wishlist_item_list_assignments::Column::WishlistId,
                    wishlist_item_list_assignments::Column::WishlistItemId,
                ]
                .into_iter(),
            )
            .do_nothing()
            .to_owned(),
        )
        .exec(&*db)
        .await?;

    Ok(Json(item))
}
