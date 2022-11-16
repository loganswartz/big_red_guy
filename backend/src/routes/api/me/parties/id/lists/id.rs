use rocket::{get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ModelTrait};
use sea_orm::{ColumnTrait, QueryFilter};

use crate::bail_msg;
use crate::routes::api::me::parties::id::index::find_participating_party;
use crate::{db::pool::Db, entities::wishlists};
use crate::{entities::users, routes::api::me::wishlists::id::find_own_wishlist};
use crate::{entities::wishlist_party_assignments, rocket_anyhow::Result as RocketResult};

#[get("/parties/<party_id>/wishlists/<list_id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<Option<Json<wishlists::Model>>> {
    let party = match find_participating_party(party_id, &*db, &user).await? {
        Some(found) => found,
        None => return Ok(None),
    };

    let list = party
        .find_related(wishlists::Entity)
        .filter(wishlists::Column::Id.eq(list_id))
        .one(&*db)
        .await?;

    Ok(list.map(|model| Json(model)))
}

#[put("/parties/<party_id>/wishlists/<list_id>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<()> {
    let party = find_participating_party(party_id, &*db, &user).await?;
    let list = find_own_wishlist(party_id, &*db, &user).await?;

    if !(party.is_some() && list.is_some()) {
        bail_msg!("Party or wishlist not found.");
    }

    // assign it to the list
    let assignment = wishlist_party_assignments::ActiveModel {
        party_id: Set(party_id),
        wishlist_id: Set(list_id),
        ..Default::default()
    };

    assignment.insert(&*db).await?;

    Ok(())
}
