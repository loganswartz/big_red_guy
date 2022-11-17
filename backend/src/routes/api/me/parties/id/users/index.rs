use rocket::get;
use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sea_orm::ModelTrait;

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::parties::PartyToPartyMembers;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;
use crate::routes::api::me::index::SanitizedUser;
use crate::routes::api::me::parties::id::index::find_participating_party;

#[get("/parties/<id>/users")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<Vec<SanitizedUser>>>> {
    let party = find_participating_party(id, &*db, &user).await?;

    let party = match party {
        Some(party) => party,
        None => bail_msg!("Party not found."),
    };

    let users = party.find_linked(PartyToPartyMembers).all(&*db).await?;

    Ok(Some(Json(
        users.into_iter().map(|user| user.into()).collect(),
    )))
}
