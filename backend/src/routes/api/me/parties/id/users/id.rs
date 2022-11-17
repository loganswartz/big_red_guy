use migration::DbErr;
use rocket::{delete, get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{sea_query, ActiveValue::Set, ModelTrait};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::bail_msg;
use crate::entities::parties::PartyToPartyMembers;
use crate::entities::{parties, party_memberships};
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::index::SanitizedUser;
use crate::routes::api::me::parties::id::index::find_participating_party;
use crate::{db::pool::Db, entities::users};

pub async fn find_own_party(
    id: i32,
    db: &DatabaseConnection,
    user: &users::Model,
) -> Result<Option<parties::Model>, DbErr> {
    parties::Entity::find_by_id(id)
        .filter(parties::Column::OwnerId.eq(user.id))
        .one(db)
        .await
}

#[get("/parties/<party_id>/users/<user_id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    user_id: i32,
) -> RocketResult<Option<Json<SanitizedUser>>> {
    let party = match find_participating_party(party_id, &*db, &user).await? {
        Some(found) => found,
        None => return Ok(None),
    };

    let user = party
        .find_linked(PartyToPartyMembers)
        .filter(users::Column::Id.eq(user_id))
        .one(&*db)
        .await?;

    Ok(user.map(|model| {
        Json(SanitizedUser {
            id: model.id,
            name: model.name,
            email: model.email,
        })
    }))
}

#[put("/parties/<party_id>/users/<user_id>", rank = 5)]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    user_id: i32,
) -> RocketResult<()> {
    if let None = find_own_party(party_id, &*db, &user).await? {
        bail_msg!("Party not found or not allowed to edit party.");
    }

    if let None = users::Entity::find_by_id(user_id).one(&*db).await? {
        bail_msg!("User not found.");
    }

    // assign them to the party
    let assignment = party_memberships::ActiveModel {
        party_id: Set(party_id),
        user_id: Set(user_id),
        ..Default::default()
    };

    party_memberships::Entity::insert(assignment)
        .on_conflict(
            // upsert
            sea_query::OnConflict::columns(
                vec![
                    party_memberships::Column::PartyId,
                    party_memberships::Column::UserId,
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

#[delete("/parties/<party_id>/users/<user_id>")]
pub async fn delete(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    user_id: i32,
) -> RocketResult<()> {
    // assign it to the list
    if let None = find_own_party(party_id, &*db, &user).await? {
        bail_msg!("Not allowed to edit this party.");
    }

    party_memberships::Entity::delete_by_id((user_id, party_id))
        .exec(&*db)
        .await?;

    Ok(())
}
