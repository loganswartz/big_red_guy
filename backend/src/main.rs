#[macro_use]
extern crate rocket;

use rocket::{
    fairing::{self, AdHoc},
    fs::{relative, FileServer},
    Build, Rocket,
};
use rocket_db_pools::Database;

use big_red_guy::{
    db::pool::Db,
    routes::{
        api::{default as api_default, login, logout, me, register},
        default, statics,
    },
};
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
        .mount("/", routes![default::get, statics::get])
        .mount(
            "/public/uploads",
            FileServer::from(relative!("../frontend/public/uploads")).rank(14),
        )
        .mount(
            "/api",
            routes![
                api_default::get,
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
                me::pfp::put,
                me::fulfillments::index::post,
                me::fulfillments::id::index::put,
                me::fulfillments::id::index::delete,
                me::wishlists::index::get,
                me::wishlists::index::post,
                me::wishlists::id::index::get,
                me::wishlists::id::index::put,
                me::wishlists::id::items::index::get,
                me::wishlists::id::items::index::post,
                me::wishlist_items::id::index::put,
                me::wishlist_items::id::index::delete,
                me::wishlist_items::id::fulfillments::get,
                me::parties::index::get,
                me::parties::index::post,
                me::parties::id::index::get,
                me::parties::id::index::put,
                me::parties::id::wishlists::index::get,
                me::parties::id::wishlists::id::get,
                me::parties::id::wishlists::id::put,
                me::parties::id::wishlists::id::delete,
                me::parties::id::users::index::get,
                me::parties::id::users::id::get,
                me::parties::id::users::id::put,
                me::parties::id::users::id::delete,
                me::parties::id::users::add::put,
                me::parties::id::fulfillments::get,
            ],
        )
}
