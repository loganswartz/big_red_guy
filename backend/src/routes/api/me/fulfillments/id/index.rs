use std::borrow::Cow;

use rocket::response::status::{self, NoContent};
use rocket::serde::json::Json;
use rocket::{delete, put};
use rocket_db_pools::Connection;
use sea_orm::{ActiveModelTrait, EntityTrait, ModelTrait, NotSet, Set, TryIntoModel};
use serde::Deserialize;

use crate::bail_msg;
use crate::entities::wishlist_item_user_fulfillments;
use crate::rocket_anyhow::Result as RocketResult;
use crate::{db::pool::Db, entities::users};

#[derive(Deserialize, Debug)]
pub struct EditFulfillment<'a> {
    #[serde(borrow)]
    pub notes: Option<Cow<'a, str>>,
    pub quantity: i32,
}

#[put("/fulfillments/<id>", data = "<form>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    form: Json<EditFulfillment<'_>>,
    id: i32,
) -> RocketResult<Json<wishlist_item_user_fulfillments::Model>> {
    let item = wishlist_item_user_fulfillments::Entity::find_by_id(id)
        .one(&*db)
        .await?;

    if let Some(row) = &item {
        if row.user_id != user.id {
            bail_msg!("Fulfillment not found.");
        }
    }

    let id = match item {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let item = wishlist_item_user_fulfillments::ActiveModel {
        id,
        notes: Set(form.notes.clone().map(|value| value.to_string())),
        quantity: Set(form.quantity),
        user_id: Set(user.id),
        ..Default::default()
    };

    let item = item.save(&*db).await?;
    let model = item.try_into_model()?;

    Ok(Json(model))
}

#[delete("/fulfillments/<id>")]
pub async fn delete(user: users::Model, db: Connection<Db>, id: i32) -> RocketResult<NoContent> {
    let row = wishlist_item_user_fulfillments::Entity::find_by_id(id)
        .one(&*db)
        .await?;

    let fulfillment = match row {
        Some(model) => model,
        None => bail_msg!("Fulfillment not found."),
    };

    if fulfillment.user_id != user.id {
        bail_msg!("Not allowed to modify this item.");
    }

    let result = fulfillment.delete(&*db).await?;

    if result.rows_affected == 0 {
        bail_msg!("Unable to delete fulfillment.")
    } else {
        Ok(status::NoContent)
    }
}
