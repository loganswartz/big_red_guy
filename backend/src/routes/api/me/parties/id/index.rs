use migration::DbErr;
use rocket::{get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::{NotSet, Set, Unchanged},
    ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, QueryFilter, TryIntoModel,
};

use crate::db::pool::Db;
use crate::entities::{parties, users};
use crate::rocket_anyhow::Result as RocketResult;
use crate::{bail_msg, entities::users::UserToParticipatingParties};

use crate::routes::api::me::parties::index::AddParty;

pub async fn find_participating_party(
    id: i32,
    db: &DatabaseConnection,
    user: &users::Model,
) -> Result<Option<parties::Model>, DbErr> {
    user.find_linked(UserToParticipatingParties)
        .filter(parties::Column::Id.eq(id))
        .one(db)
        .await
}

#[get("/parties/<id>")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<Option<Json<parties::Model>>> {
    let wishlist = find_participating_party(id, &*db, &user)
        .await?
        .map(|model| Json(model));

    Ok(wishlist)
}

#[put("/parties/<id>", data = "<form>")]
pub async fn put(
    user: users::Model,
    db: Connection<Db>,
    form: Json<AddParty<'_>>,
    id: i32,
) -> RocketResult<Json<parties::Model>> {
    let party = parties::Entity::find_by_id(id).one(&*db).await?;

    if let Some(row) = &party {
        if row.owner_id != user.id {
            bail_msg!("Not allowed to modify this party.");
        }
    }
    let id = match party {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let party = parties::ActiveModel {
        id,
        name: Set(form.name.to_owned()),
        owner_id: Unchanged(user.id),
        ..Default::default()
    };

    let party = party.save(&*db).await?;
    let model = party.try_into_model()?;

    Ok(Json(model))
}
