use migration::JoinType;
use rocket::{delete, get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{sea_query, ActiveValue::Set, ModelTrait};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QuerySelect, RelationTrait};

use crate::bail_msg;
use crate::entities::{parties, party_memberships, wishlist_items};
use crate::routes::api::me::parties::id::index::find_participating_party;
use crate::{db::pool::Db, entities::wishlists};
use crate::{entities::users, routes::api::me::wishlists::id::index::find_own_wishlist};
use crate::{entities::wishlist_party_assignments, rocket_anyhow::Result as RocketResult};

use super::index::WishlistWithItems;

#[get("/parties/<party_id>/wishlists/<list_id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<Option<Json<WishlistWithItems>>> {
    let party = match find_participating_party(party_id, &*db, &user).await? {
        Some(found) => found,
        None => bail_msg!("Party not found."),
    };

    let wishlist = match party
        .find_related(wishlists::Entity)
        .filter(wishlists::Column::Id.eq(list_id))
        .one(&*db)
        .await?
    {
        Some(found) => found,
        None => bail_msg!("Wishlist not found."),
    };

    let items = wishlist
        .find_related(wishlist_items::Entity)
        .all(&*db)
        .await?;

    Ok(Some(Json(WishlistWithItems { wishlist, items })))
}

#[put("/parties/<party_id>/wishlists/<list_id>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<()> {
    let party = find_participating_party(party_id, &*db, &user).await?;
    let list = find_own_wishlist(list_id, &*db, &user).await?;

    if !(party.is_some() && list.is_some()) {
        bail_msg!("Party or wishlist not found.");
    }

    // assign it to the list
    let assignment = wishlist_party_assignments::ActiveModel {
        party_id: Set(party_id),
        wishlist_id: Set(list_id),
        ..Default::default()
    };

    wishlist_party_assignments::Entity::insert(assignment)
        .on_conflict(
            // upsert
            sea_query::OnConflict::columns(
                vec![
                    wishlist_party_assignments::Column::PartyId,
                    wishlist_party_assignments::Column::WishlistId,
                ]
                .into_iter(),
            )
            .do_nothing()
            .to_owned(),
        )
        .exec(&*db)
        .await?;

    Ok(())
}

#[delete("/parties/<party_id>/wishlists/<list_id>")]
pub async fn delete(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    list_id: i32,
) -> RocketResult<()> {
    // assign it to the list
    let result = wishlist_party_assignments::Entity::find()
        .join(
            JoinType::InnerJoin,
            wishlists::Relation::WishlistPartyAssignments.def().rev(),
        )
        .join(
            JoinType::InnerJoin,
            parties::Relation::WishlistPartyAssignments.def().rev(),
        )
        .join(
            JoinType::LeftJoin,
            party_memberships::Relation::Parties.def().rev(),
        )
        .join(
            JoinType::InnerJoin,
            users::Relation::PartyMemberships.def().rev(),
        )
        .filter(wishlists::Column::OwnerId.eq(user.id))
        .filter(party_memberships::Column::UserId.eq(user.id))
        .filter(wishlist_party_assignments::Column::WishlistId.eq(list_id))
        .filter(wishlist_party_assignments::Column::PartyId.eq(party_id))
        .one(&*db)
        .await?;

    let found = match result {
        Some(model) => model,
        None => bail_msg!("Party or wishlist not found."),
    };

    found.delete(&*db).await?;

    Ok(())
}
