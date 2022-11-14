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

use crate::routes::{
    api::{login, logout, me, parties, register, users, wishlist_items, wishlists},
    default,
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
                // TODO: implement Admin users auth
                // wishlists::index::get,
                // wishlists::index::post,
                // wishlists::id::get,
                // wishlists::id::put,
                // wishlists::items::index::get,
                // wishlists::items::index::post,
                // wishlist_items::id::put,
                // wishlist_items::id::delete,
                // parties::index::get,
                // parties::index::post,
                // parties::id::get,
                // parties::id::put,
            ],
        )
        .mount(
            "/api/me",
            routes![
                me::index::get,
                me::wishlists::index::get,
                me::wishlists::index::post,
                me::wishlists::id::get,
                me::wishlists::id::put,
                me::wishlists::items::index::get,
                me::wishlists::items::index::post,
                me::wishlist_items::id::put,
                me::wishlist_items::id::delete,
                me::parties::index::get,
                me::parties::index::post,
                me::parties::id::get,
                me::parties::id::put,
            ],
        )
}
