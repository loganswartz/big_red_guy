use rocket::delete;
use rocket::response::status::{self, NoContent};
use rocket_db_pools::Connection;
use sea_orm::{EntityTrait, ModelTrait};

use crate::bail_msg;
use crate::entities::wishlist_item_user_fulfillments;
use crate::rocket_anyhow::Result as RocketResult;
use crate::{db::pool::Db, entities::users};

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
