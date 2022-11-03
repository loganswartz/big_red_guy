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
use sea_orm::entity::prelude::*;

mod db;
use db::pool::Db;

mod entities;
use entities::users;

mod utils;

#[derive(FromForm, Debug)]
struct Credentials<'r> {
    email: &'r str,
    password: &'r str,
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
                no_auth
            ],
        )
}
