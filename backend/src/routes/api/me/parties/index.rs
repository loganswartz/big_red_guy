use rocket::{get, post, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ModelTrait};
use serde::Deserialize;

use crate::db::pool::Db;
use crate::entities::{parties, party_memberships, users};
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct AddParty<'r> {
    pub name: &'r str,
}

#[get("/parties")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
) -> RocketResult<Json<Vec<parties::Model>>> {
    let parties = user
        .find_linked(users::UserToParticipatingParties)
        .all(&*db)
        .await?;

    Ok(Json(parties))
}

#[post("/parties", data = "<data>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    data: Json<AddParty<'_>>,
) -> RocketResult<Json<parties::Model>> {
    let party = parties::ActiveModel {
        name: Set(data.name.to_owned()),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let model = party.insert(&*db).await?;

    // assign user to party
    let membership = party_memberships::ActiveModel {
        user_id: Set(user.id),
        party_id: Set(model.id),
    };

    membership.insert(&*db).await?;

    Ok(Json(model))
}
