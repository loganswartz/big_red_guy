use rocket::{get, put, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::{NotSet, Set, Unchanged},
    ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, TryIntoModel,
};

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::{parties, users};
use crate::rocket_anyhow::Result as RocketResult;

use super::index::AddParty;

pub async fn find_party(
    id: i32,
    db: &DatabaseConnection,
    user: users::Model,
) -> Option<parties::Model> {
    match parties::Entity::find_by_id(id)
        .filter(parties::Column::OwnerId.eq(user.id))
        .one(db)
        .await
    {
        Ok(Some(party)) => Some(party),
        _ => None,
    }
}

#[get("/parties/<id>")]
pub async fn get(user: users::Model, db: Connection<Db>, id: i32) -> Option<Json<parties::Model>> {
    let wishlist = find_party(id, &db, user).await?;

    Some(Json(wishlist))
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
    };

    let party = party.save(&*db).await?;
    let model = party.try_into_model()?;

    Ok(Json(model))
}
