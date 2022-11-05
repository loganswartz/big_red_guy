#[macro_use]
extern crate rocket;

use migration::MigratorTrait;
use rocket::{
    fairing::{self, AdHoc},
    form::Form,
    fs::{relative, FileServer},
    http::{Cookie, CookieJar},
    response::Redirect,
    Build, Rocket,
};
use rocket_db_pools::{Connection, Database};
use rocket_dyn_templates::{context, Template};
use sea_orm::{entity::prelude::*, Set};

mod db;
use db::pool::Db;

mod entities;
use entities::{users, wishlists};

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

#[get("/")]
fn index() -> Template {
    Template::render("index", context! {})
}

#[get("/register")]
async fn register() -> Template {
    Template::render("register", context! {})
}

#[post("/register", data = "<credentials>")]
async fn post_register(
    db: Connection<Db>,
    credentials: Form<Credentials<'_>>,
) -> Result<Redirect, String> {
    let result = users::Entity::find()
        .filter(users::Column::Email.contains(credentials.email))
        .one(&*db)
        .await;

    println!("Creds: {:?}", credentials);
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
    println!("Model: {:?}", new);

    Ok(Redirect::to("/login"))
}

#[get("/login")]
async fn authed_login(_user: users::Model) -> Redirect {
    Redirect::to("home")
}

#[get("/login", rank = 2)]
fn login() -> Template {
    Template::render("login", context! {})
}

#[get("/logout")]
fn logout(cookies: &CookieJar<'_>) -> Redirect {
    cookies.remove_private(Cookie::named(users::Model::COOKIE_ID));
    Redirect::to("/")
}

#[post("/login", data = "<credentials>")]
async fn post_login(
    db: Connection<Db>,
    cookies: &CookieJar<'_>,
    credentials: Form<Credentials<'_>>,
) -> Result<Redirect, String> {
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
        return Ok(Redirect::to("/home"));
    } else {
        return Ok(Redirect::to("/login"));
    }
}

#[get("/home")]
fn home(user: users::Model) -> Template {
    Template::render("home", context! { name: user.name })
}

#[get("/wishlists")]
async fn wishlist_index(user: users::Model, db: Connection<Db>) -> Result<Template, String> {
    let wishlists = match user.find_related(wishlists::Entity).all(&*db).await {
        Ok(lists) => lists,
        Err(e) => return Err(e.to_string()),
    };

    Ok(Template::render(
        "wishlist_index",
        context! { name: user.name, lists: wishlists },
    ))
}

#[get("/wishlists/add")]
async fn add_wishlist(_user: users::Model) -> Result<Template, String> {
    Ok(Template::render("add_wishlist", context! {}))
}

#[post("/wishlists/add", data = "<form>")]
async fn add_wishlist_post(
    user: users::Model,
    db: Connection<Db>,
    form: Form<AddWishlist<'_>>,
) -> Result<Redirect, String> {
    let new = wishlists::ActiveModel {
        name: Set(form.name.to_owned()),
        owner_id: Set(user.id),
        ..Default::default()
    };

    if let Err(e) = new.insert(&*db).await {
        return Err(e.to_string());
    }

    Ok(Redirect::to("/wishlists"))
}

#[get("/wishlists/<list_id>")]
async fn view_wishlist(user: users::Model, db: Connection<Db>, list_id: &str) -> Option<Template> {
    let id: i32 = match list_id.parse() {
        Ok(value) => value,
        Err(_) => return None,
    };

    let list = match wishlists::Entity::find_by_id(id).one(&*db).await {
        Ok(list) => list,
        Err(_) => return None,
    };

    match list {
        Some(found) => Some(Template::render(
            "view_wishlist",
            context! { name: user.name, list: found },
        )),
        None => None,
    }
}

#[get("/<_..>", rank = 12)]
fn no_auth() -> Redirect {
    Redirect::to("/login")
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("Migrations", run_migrations))
        .attach(Template::fairing())
        .mount("/public", FileServer::from(relative!("static")))
        .mount(
            "/",
            routes![
                index,
                register,
                post_register,
                login,
                logout,
                authed_login,
                post_login,
                home,
                wishlist_index,
                view_wishlist,
                add_wishlist,
                add_wishlist_post,
                no_auth
            ],
        )
}
