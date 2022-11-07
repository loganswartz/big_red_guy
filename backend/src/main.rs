#[macro_use]
extern crate rocket;

use std::{io, path::Path};

use migration::MigratorTrait;
use rocket::{
    fairing::{self, AdHoc},
    form::Form,
    fs::{relative, FileServer, NamedFile},
    http::{Cookie, CookieJar, Status},
    response::{status, Redirect},
    serde::json::Json,
    Build, Rocket,
};
use rocket_db_pools::{Connection, Database};
use sea_orm::{entity::prelude::*, Set};
use serde::Serialize;

mod db;
use db::pool::Db;

mod entities;
use entities::{users, wishlist_item_list_assignments, wishlist_items, wishlists};

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

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    let conn = &Db::fetch(&rocket).unwrap().conn;
    let _ = migration::Migrator::up(conn, None).await;
    Ok(rocket)
}

#[post("/register", data = "<credentials>")]
async fn register(
    db: Connection<Db>,
    credentials: Form<Credentials<'_>>,
) -> Result<Json<Me>, String> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await;

    match result {
        Ok(Some(_)) => return Err("That email is already in use.".to_string()),
        Err(e) => return Err(e.to_string()),
        _ => (),
    };

    let hash = match utils::make_password_hash(credentials.password) {
        Ok(value) => value,
        Err(e) => return Err(e.to_string()),
    };

    let new = users::ActiveModel {
        name: sea_orm::ActiveValue::Set(credentials.email.to_string()),
        email: sea_orm::ActiveValue::Set(credentials.email.to_string()),
        password: sea_orm::ActiveValue::Set(hash),
        ..Default::default()
    };

    let new: users::Model = match new.insert(&*db).await {
        Ok(model) => model,
        Err(e) => return Err(e.to_string()),
    };

    Ok(Json(Me {
        name: new.name,
        email: new.email,
    }))
}

#[post("/logout")]
fn logout(cookies: &CookieJar<'_>) -> Redirect {
    cookies.remove_private(Cookie::named(users::Model::COOKIE_ID));
    Redirect::to("/")
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct LoginResponse {
    success: bool,
}

#[post("/login", data = "<credentials>")]
async fn login(
    db: Connection<Db>,
    cookies: &CookieJar<'_>,
    credentials: Form<Credentials<'_>>,
) -> Result<status::Custom<Json<LoginResponse>>, String> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await;

    let user = match result {
        Ok(Some(user)) => user,
        Ok(None) => return Err("User not found.".to_string()),
        Err(e) => return Err(e.to_string()),
    };

    if user.verify_password(credentials.password) {
        cookies.add_private(Cookie::new(users::Model::COOKIE_ID, user.id.to_string()));
        return Ok(status::Custom(
            Status::Ok,
            Json(LoginResponse { success: true }),
        ));
    } else {
        return Ok(status::Custom(
            Status::Unauthorized,
            Json(LoginResponse { success: false }),
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
) -> Result<Json<Vec<wishlists::Model>>, String> {
    match user.find_related(wishlists::Entity).all(&*db).await {
        Ok(lists) => Ok(Json(lists)),
        Err(e) => return Err(e.to_string()),
    }
}

#[post("/wishlists/add", data = "<form>")]
async fn add_wishlist(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlist<'_>>,
) -> Result<Json<wishlists::Model>, String> {
    let new = wishlists::ActiveModel {
        name: Set(form.name.to_owned()),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let model = match new.insert(&*db).await {
        Ok(model) => model,
        Err(e) => return Err(e.to_string()),
    };

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

    let list = match wishlists::Entity::find_by_id(id)
        .filter(wishlists::Column::OwnerId.eq(user.id))
        .one(db)
        .await
    {
        Ok(Some(list)) => Some(list),
        _ => return None,
    };

    list
}

#[get("/wishlists/<list_id>")]
async fn get_wishlist(
    user: users::Model,
    db: Connection<Db>,
    list_id: &str,
) -> Option<Json<wishlists::Model>> {
    let wishlist = find_wishlist(list_id, &*db, user).await;

    match wishlist {
        Some(model) => Some(Json(model)),
        None => None,
    }
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
) -> Result<Json<wishlist_items::Model>, String> {
    // make the new item
    let item = wishlist_items::ActiveModel {
        name: Set(form.name.to_owned()),
        url: Set(form.url.map_or(None, |val| Some(val.to_owned()))),
        quantity: Set(form.quantity.to_owned()),
        owner_id: Set(user.id),
        ..Default::default()
    };

    let item = match item.insert(&*db).await {
        Ok(model) => model,
        Err(e) => return Err(e.to_string()),
    };

    // assign it to the list
    let assignment = wishlist_item_list_assignments::ActiveModel {
        wishlist_id: Set(id),
        wishlist_item_id: Set(item.id),
        ..Default::default()
    };

    if let Err(e) = assignment.insert(&*db).await {
        return Err(e.to_string());
    };

    Ok(Json(item))
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
                add_wishlist_item,
            ],
        )
}
