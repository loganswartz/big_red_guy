use std::borrow::Cow;

use rocket::{
    delete, put,
    response::status::{self, NoContent},
    serde::json::Json,
};
use rocket_db_pools::Connection;
use sea_orm::{entity::prelude::*, ActiveValue::NotSet, Set, TryIntoModel};
use serde::Deserialize;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::{users, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct AddWishlistItem<'r> {
    pub name: &'r str,
    #[serde(borrow)]
    pub notes: Option<Cow<'r, str>>,
    pub url: Option<&'r str>,
    pub quantity: Option<i32>,
}

#[put("/wishlist_items/<id>", data = "<form>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    form: Json<AddWishlistItem<'_>>,
    id: i32,
) -> RocketResult<Json<wishlist_items::Model>> {
    let item = wishlist_items::Entity::find_by_id(id).one(&*db).await?;

    if let Some(row) = &item {
        if row.owner_id != user.id {
            bail_msg!("Not allowed to modify this item.");
        }
    }

    let id = match item {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let item = wishlist_items::ActiveModel {
        id,
        name: Set(form.name.to_owned()),
        notes: Set(form
            .notes
            .clone()
            .map_or(None, |value| Some(value.to_string()))),
        url: Set(form.url.map_or(None, |value| Some(value.to_owned()))),
        quantity: Set(form.quantity),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let item = item.save(&*db).await?;
    let model = item.try_into_model()?;

    Ok(Json(model))
}

#[delete("/wishlist_items/<id>")]
pub async fn delete(user: users::Model, db: Connection<Db>, id: i32) -> RocketResult<NoContent> {
    let row = wishlist_items::Entity::find_by_id(id).one(&*db).await?;

    let item = match row {
        Some(model) => model,
        None => bail_msg!("Item not found."),
    };

    if item.owner_id != user.id {
        bail_msg!("Not allowed to modify this item.");
    }

    let result = item.delete(&*db).await?;

    if result.rows_affected == 0 {
        bail_msg!("Unable to delete item.")
    } else {
        Ok(status::NoContent)
    }
}
