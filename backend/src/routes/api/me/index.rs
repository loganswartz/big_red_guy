use rocket::get;
use rocket::serde::json::Json;
use serde::Serialize;

use crate::entities::users;

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct SanitizedUser {
    pub id: i32,
    pub name: String,
    pub email: String,
}

impl From<users::Model> for SanitizedUser {
    fn from(user: users::Model) -> Self {
        return SanitizedUser {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}

#[get("/")]
pub async fn get(user: users::Model) -> Json<SanitizedUser> {
    Json(SanitizedUser {
        id: user.id,
        name: user.name,
        email: user.email,
    })
}
