use rocket::serde::json::Json;
use rocket::{get, put};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use sea_orm::{ActiveValue::NotSet, Set, TryIntoModel, Unchanged};

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::{users, wishlists};
use crate::rocket_anyhow::Result as RocketResult;

use super::index::AddWishlist;

pub async fn find_own_wishlist(
    id: i32,
    db: &DatabaseConnection,
    user: &users::Model,
) -> Result<Option<wishlists::Model>, DbErr> {
    wishlists::Entity::find_by_id(id)
        .filter(wishlists::Column::OwnerId.eq(user.id))
        .one(db)
        .await
}

#[get("/wishlists/<id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<wishlists::Model>>> {
    let wishlist = find_own_wishlist(id, &*db, &user)
        .await?
        .map(|model| Json(model));

    Ok(wishlist)
}

#[put("/wishlists/<id>", data = "<form>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    form: Json<AddWishlist<'_>>,
    id: i32,
) -> RocketResult<Json<wishlists::Model>> {
    let list = wishlists::Entity::find_by_id(id).one(&*db).await?;

    if let Some(row) = &list {
        if row.owner_id != user.id {
            bail_msg!("Not allowed to modify this list.");
        }
    }
    let id = match list {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let list = wishlists::ActiveModel {
        id,
        name: Set(form.name.to_owned()),
        owner_id: Unchanged(user.id),
        ..Default::default()
    };

    let list = list.save(&*db).await?;
    let model = list.try_into_model()?;

    Ok(Json(model))
}
