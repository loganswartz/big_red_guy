use rocket::serde::json::Json;
use rocket::{form::Form, get, post, FromForm};
use rocket_db_pools::Connection;
use sea_orm::{entity::prelude::*, ModelTrait, Set};

use crate::db::pool::Db;
use crate::entities::{users, wishlists};
use crate::rocket_anyhow::Result as RocketResult;

#[get("/wishlists")]
pub async fn get(
    user: users::Model,
    db: Connection<Db>,
) -> RocketResult<Json<Vec<wishlists::Model>>> {
    let lists = user.find_related(wishlists::Entity).all(&*db).await?;

    Ok(Json(lists))
}

#[derive(FromForm, Debug)]
pub struct AddWishlist<'r> {
    pub name: &'r str,
}

#[post("/wishlists", data = "<form>")]
pub async fn post(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlist<'_>>,
) -> RocketResult<Json<wishlists::Model>> {
    let new = wishlists::ActiveModel {
        name: Set(form.name.to_owned()),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let model = new.insert(&*db).await?;

    Ok(Json(model))
}
