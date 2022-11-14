#[macro_use]
extern crate rocket;

mod db;
mod entities;
mod macros;
mod rocket_anyhow;
mod routes;
mod utils;

use rocket::{
    fairing::{self, AdHoc},
    fs::{relative, FileServer},
    Build, Rocket,
};
use rocket_db_pools::Database;

use crate::routes::api::{
    default, login, logout, parties, register, users, wishlist_items, wishlists,
};
use db::pool::Db;
use migration::MigratorTrait;

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    let conn = &Db::fetch(&rocket).unwrap().conn;
    let _ = migration::Migrator::up(conn, None).await;

    Ok(rocket)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("Migrations", run_migrations))
        .mount("/", FileServer::from(relative!("../frontend/build")))
        .mount("/", routes![default::get])
        .mount(
            "/api",
            routes![
                register::post,
                logout::post,
                login::post,
                users::me::get,
                wishlists::index::get,
                wishlists::index::post,
                wishlists::id::get,
                wishlists::id::put,
                wishlists::items::index::get,
                wishlists::items::index::post,
                wishlist_items::id::put,
                wishlist_items::id::delete,
                parties::index::get,
                parties::index::post,
                parties::id::get,
                parties::id::put,
            ],
        )
}
