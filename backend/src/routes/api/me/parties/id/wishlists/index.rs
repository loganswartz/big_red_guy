use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::{ColumnTrait, EntityTrait, ModelTrait, QueryFilter};
use serde::Serialize;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::{users, wishlist_items, wishlists};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;

#[derive(Serialize)]
pub struct WishlistWithItems {
    pub wishlist: wishlists::Model,
    pub items: Vec<wishlist_items::Model>,
}

impl From<&(wishlists::Model, Vec<wishlist_items::Model>)> for WishlistWithItems {
    fn from(tuple: &(wishlists::Model, Vec<wishlist_items::Model>)) -> Self {
        WishlistWithItems {
            wishlist: tuple.0.to_owned(),
            items: tuple.1.to_owned(),
        }
    }
}

#[get("/parties/<id>/wishlists")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<WishlistWithItems>>>> {
    let party = match find_participating_party(id, &db, &user).await? {
        Some(party) => party,
        None => bail_msg!("Party not found."),
    };

    let lists = party
        .find_related(wishlists::Entity)
        .all(&*db)
        .await?
        .into_iter()
        .map(|model| model.id);

    let result = wishlists::Entity::find()
        .filter(wishlists::Column::Id.is_in(lists))
        .find_with_related(wishlist_items::Entity)
        .all(&*db)
        .await?;

    let mapped = result.iter().map(|tuple| tuple.into()).collect();

    Ok(Some(Json(mapped)))
}
