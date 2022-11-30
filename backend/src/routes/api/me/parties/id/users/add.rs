use rocket::{put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{sea_query, ActiveValue::Set};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::Deserialize;

use crate::bail_msg;
use crate::entities::party_memberships;
use crate::rocket_anyhow::Result as RocketResult;
use crate::{db::pool::Db, entities::users};

use super::id::find_own_party;

#[derive(Deserialize, Debug)]
pub struct AssignUser<'r> {
    pub email: &'r str,
}

#[put("/parties/<party_id>/users/add", data = "<data>", rank = 4)]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    party_id: i32,
    data: Json<AssignUser<'_>>,
) -> RocketResult<()> {
    if find_own_party(party_id, &db, &user).await?.is_none() {
        bail_msg!("Party not found or not allowed to edit party.");
    }

    let found = match users::Entity::find()
        .filter(users::Column::Email.eq(data.email))
        .one(&*db)
        .await?
    {
        Some(model) => model,
        None => bail_msg!("User not found."),
    };

    // assign them to the party
    let assignment = party_memberships::ActiveModel {
        party_id: Set(party_id),
        user_id: Set(found.id),
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
