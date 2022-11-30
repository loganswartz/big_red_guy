use migration::{Alias, Condition};
use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::{ColumnTrait, EntityName, EntityTrait, ModelTrait, QueryFilter, QueryTrait, Select};
use serde::Serialize;

use crate::db::pool::Db;
use crate::entities::{users, wishlist_item_user_fulfillments, wishlist_items};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::fulfillments::index::item_is_shared_with_user;

#[derive(Serialize)]
pub struct ItemFulfillment {
    fulfillment: wishlist_item_user_fulfillments::Model,
    editable: bool,
}

pub fn censor_fulfillments(
    query: Select<wishlist_item_user_fulfillments::Entity>,
    user: &users::Model,
) -> Select<wishlist_item_user_fulfillments::Entity> {
    query.filter(
        Condition::any().add(
            wishlist_item_user_fulfillments::Column::WishlistItemId.not_in_subquery(
                user.find_related(wishlist_items::Entity)
                    .into_query()
                    .clear_selects()
                    .column((
                        Alias::new(wishlist_items::Entity.table_name()),
                        wishlist_items::Column::Id,
                    ))
                    .to_owned(),
            ),
        ),
    )
}

#[get("/wishlist_items/<id>/fulfillments")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<ItemFulfillment>>>> {
    let item = item_is_shared_with_user(id, user.id, &db).await?;

    let query = item.find_related(wishlist_item_user_fulfillments::Entity);
    let censored = censor_fulfillments(query, &user);

    let results = wishlist_item_user_fulfillments::Entity::find()
        .filter(
            Condition::any().add(
                wishlist_item_user_fulfillments::Column::Id.in_subquery(
                    censored
                        .into_query()
                        .clear_selects()
                        .column((
                            Alias::new(wishlist_item_user_fulfillments::Entity.table_name()),
                            wishlist_item_user_fulfillments::Column::Id,
                        ))
                        .to_owned(),
                ),
            ),
        )
        .find_also_related(users::Entity)
        .all(&*db)
        .await?;

    Ok(Some(Json(
        results
            .iter()
            .map(|tuple| ItemFulfillment {
                fulfillment: tuple.0.to_owned(),
                editable: tuple
                    .1
                    .to_owned()
                    .map_or(false, |fulfiller| fulfiller.id == user.id),
            })
            .collect(),
    )))
}
