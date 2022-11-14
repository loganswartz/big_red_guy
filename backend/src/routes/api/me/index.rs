use rocket::get;
use rocket::serde::json::Json;
use serde::Serialize;

use crate::entities::users;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Me {
    pub name: String,
    pub email: String,
}

#[get("/")]
pub async fn get(user: users::Model) -> Json<Me> {
    Json(Me {
        name: user.name,
        email: user.email,
    })
}
