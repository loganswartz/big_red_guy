#[macro_use]
extern crate rocket;

use std::{io, path::Path};

use anyhow::anyhow;
use migration::MigratorTrait;
use rocket::{
    fairing::{self, AdHoc},
    form::Form,
    fs::{relative, FileServer, NamedFile},
    http::{Cookie, CookieJar, Status},
    response::status::{self, NoContent},
    serde::json::Json,
    Build, Rocket,
};
use rocket_db_pools::{Connection, Database};
use sea_orm::{entity::prelude::*, ActiveValue::NotSet, Set, TryIntoModel, Unchanged};
use serde::Serialize;

mod db;
use db::pool::Db;

mod entities;
use entities::{users, wishlist_item_list_assignments, wishlist_items, wishlists};

mod rocket_anyhow;
use rocket_anyhow::Result as RocketResult;
mod utils;

#[derive(FromForm, Debug)]
struct Credentials<'r> {
    email: &'r str,
    password: &'r str,
}

#[derive(FromForm, Debug)]
struct AddWishlist<'r> {
    name: &'r str,
}

macro_rules! bail_msg {
    ($msg:literal) => {
        return Err(rocket_anyhow::Error { 0: anyhow!($msg) })
    };
}

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    let conn = &Db::fetch(&rocket).unwrap().conn;
    let _ = migration::Migrator::up(conn, None).await;

    Ok(rocket)
}

#[post("/register", data = "<credentials>")]
async fn register(
    db: Connection<Db>,
    credentials: Form<Credentials<'_>>,
) -> RocketResult<Json<Me>> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await?;

    if let Some(_) = result {
        bail_msg!("That email is already in use.");
    }

    let hash = utils::make_password_hash(credentials.password)?;

    let new = users::ActiveModel {
        name: sea_orm::ActiveValue::Set(credentials.email.to_string()),
        email: sea_orm::ActiveValue::Set(credentials.email.to_string()),
        password: sea_orm::ActiveValue::Set(hash),
        ..Default::default()
    };

    let new = new.insert(&*db).await?;

    Ok(Json(Me {
        name: new.name,
        email: new.email,
    }))
}

#[post("/logout")]
fn logout(cookies: &CookieJar<'_>) -> Json<AuthResponse> {
    cookies.remove_private(Cookie::named(users::Model::COOKIE_ID));
    Json(AuthResponse { success: true })
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct AuthResponse {
    success: bool,
}

#[post("/login", data = "<credentials>")]
async fn login(
    db: Connection<Db>,
    cookies: &CookieJar<'_>,
    credentials: Form<Credentials<'_>>,
) -> RocketResult<status::Custom<Json<AuthResponse>>> {
    let found = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await?;

    let user = match found {
        Some(user) => user,
        None => {
            bail_msg!("User not found.");
        }
    };

    if user.verify_password(credentials.password) {
        cookies.add_private(Cookie::new(users::Model::COOKIE_ID, user.id.to_string()));
        return Ok(status::Custom(
            Status::Ok,
            Json(AuthResponse { success: true }),
        ));
    } else {
        return Ok(status::Custom(
            Status::Unauthorized,
            Json(AuthResponse { success: false }),
        ));
    }
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Me {
    name: String,
    email: String,
}

#[get("/me")]
async fn me(user: users::Model) -> Json<Me> {
    Json(Me {
        name: user.name,
        email: user.email,
    })
}

#[get("/wishlists")]
async fn all_wishlists(
    user: users::Model,
    db: Connection<Db>,
) -> RocketResult<Json<Vec<wishlists::Model>>> {
    let lists = user.find_related(wishlists::Entity).all(&*db).await?;

    Ok(Json(lists))
}

#[post("/wishlists/add", data = "<form>")]
async fn add_wishlist(
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

#[derive(FromForm, Debug)]
struct AddWishlistItem<'r> {
    name: &'r str,
    url: Option<&'r str>,
    quantity: Option<i32>,
}

async fn find_wishlist(
    id: &str,
    db: &DatabaseConnection,
    user: users::Model,
) -> Option<wishlists::Model> {
    let id: i32 = match id.parse() {
        Ok(value) => value,
        Err(_) => return None,
    };

    match wishlists::Entity::find_by_id(id)
        .filter(wishlists::Column::OwnerId.eq(user.id))
        .one(db)
        .await
    {
        Ok(Some(list)) => Some(list),
        _ => return None,
    }
}

#[get("/wishlists/<id>")]
async fn get_wishlist(
    user: users::Model,
    db: Connection<Db>,
    id: &str,
) -> Option<Json<wishlists::Model>> {
    let wishlist = find_wishlist(id, &*db, user).await;

    match wishlist {
        Some(model) => Some(Json(model)),
        None => None,
    }
}

#[put("/wishlists/<id>", data = "<form>")]
async fn put_wishlist(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlist<'_>>,
    id: i32,
) -> RocketResult<Json<wishlists::Model>> {
    let list = wishlists::Entity::find_by_id(id).one(&*db).await?;

    if let Some(row) = &list {
        if row.owner_id != user.id {
            bail_msg!("Not allowed to modify this list.");
        }
    }
    let id = match list {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let list = wishlists::ActiveModel {
        id,
        name: Set(form.name.to_owned()),
        owner_id: Unchanged(user.id),
        ..Default::default()
    };

    let list = list.save(&*db).await?;
    let model = list.try_into_model()?;

    Ok(Json(model))
}

#[get("/wishlists/<list_id>/items")]
async fn get_wishlist_items(
    user: users::Model,
    db: Connection<Db>,
    list_id: &str,
) -> Option<Json<Vec<wishlist_items::Model>>> {
    let wishlist = find_wishlist(list_id, &*db, user).await;

    let items = wishlist?
        .find_related(wishlist_items::Entity)
        .all(&*db)
        .await;

    match items {
        Ok(items) => Some(Json(items)),
        Err(_) => None,
    }
}

#[post("/wishlists/<id>/items/add", data = "<form>")]
async fn add_wishlist_item(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlistItem<'_>>,
    id: i32,
) -> RocketResult<Json<wishlist_items::Model>> {
    // make the new item
    let item = wishlist_items::ActiveModel {
        name: Set(form.name.to_owned()),
        url: Set(form.url.map_or(None, |value| Some(value.to_owned()))),
        quantity: Set(form.quantity),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let item = item.insert(&*db).await?;

    // assign it to the list
    let assignment = wishlist_item_list_assignments::ActiveModel {
        wishlist_id: Set(id),
        wishlist_item_id: Set(item.id),
        ..Default::default()
    };

    assignment.insert(&*db).await?;

    Ok(Json(item))
}

#[put("/wishlist_items/<id>", data = "<form>")]
async fn put_wishlist_item(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlistItem<'_>>,
    id: i32,
) -> RocketResult<Json<wishlist_items::Model>> {
    let item = wishlist_items::Entity::find_by_id(id).one(&*db).await?;

    if let Some(row) = &item {
        if row.owner_id != user.id {
            bail_msg!("Not allowed to modify this item.");
        }
    }

    let id = match item {
        Some(model) => Set(model.id),
        None => NotSet,
    };

    let item = wishlist_items::ActiveModel {
        id,
        name: Set(form.name.to_owned()),
        url: Set(form.url.map_or(None, |value| Some(value.to_owned()))),
        quantity: Set(form.quantity),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let item = item.save(&*db).await?;
    let model = item.try_into_model()?;

    Ok(Json(model))
}

#[delete("/wishlist_items/<id>")]
async fn delete_wishlist_item(
    user: users::Model,
    db: Connection<Db>,
    id: i32,
) -> RocketResult<NoContent> {
    let row = wishlist_items::Entity::find_by_id(id).one(&*db).await?;

    let item = match row {
        Some(model) => model,
        None => bail_msg!("Item not found."),
    };

    if item.owner_id != user.id {
        bail_msg!("Not allowed to modify this item.");
    }

    let result = item.delete(&*db).await?;

    if result.rows_affected == 0 {
        bail_msg!("Unable to delete item.")
    } else {
        Ok(status::NoContent)
    }
}

#[get("/<_..>", rank = 12)]
async fn default() -> io::Result<NamedFile> {
    let page_directory_path = format!("{}/../frontend/build", env!("CARGO_MANIFEST_DIR"));
    let absolute = Path::new(&page_directory_path).join("index.html");

    NamedFile::open(absolute).await
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("Migrations", run_migrations))
        .mount("/", FileServer::from(relative!("../frontend/build")))
        .mount("/", routes![default])
        .mount(
            "/api",
            routes![
                register,
                logout,
                login,
                me,
                all_wishlists,
                get_wishlist,
                get_wishlist_items,
                add_wishlist,
                put_wishlist,
                add_wishlist_item,
                put_wishlist_item,
                delete_wishlist_item,
            ],
        )
}
