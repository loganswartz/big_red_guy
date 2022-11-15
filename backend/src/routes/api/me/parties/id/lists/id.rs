use rocket::{get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::{NotSet, Set, Unchanged},
    ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, QueryFilter, TryIntoModel,
};

use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::parties::id::index::find_participating_party;
use crate::routes::api::me::parties::index::AddParty;
use crate::{bail_msg, entities::users::UserToParticipatingParties};
use crate::{db::pool::Db, entities::wishlists};
use crate::{
    entities::{parties, users},
    routes::api::me::wishlists::id::find_own_wishlist,
};

#[get("/parties/<party_id>/wishlists/<list_id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<Option<Json<Vec<wishlists::Model>>>> {
    let party = match find_participating_party(party_id, &*db, &user).await? {
        Some(found) => found,
        None => return Ok(None),
    };

    let lists = party.find_related(wishlists::Entity).all(&*db).await?;

    Ok(Some(Json(lists)))
}

#[put("/parties/<party_id>/wishlists/<list_id>", data = "<data>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    data: Json<AddParty<'_>>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<()> {
    let party = find_participating_party(party_id, &*db, &user).await?;
    let list = find_own_wishlist(party_id, &*db, &user).await?;

    if !(party.is_some() && list.is_some()) {
        bail_msg!("Party or wishlist not found.");
    }

    Ok(())
}
