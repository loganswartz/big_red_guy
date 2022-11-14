use crate::entities::users;
use rocket::{
    http::{Cookie, CookieJar},
    post,
    serde::json::Json,
};

use super::login::AuthResponse;

#[post("/logout")]
pub fn post(cookies: &CookieJar<'_>) -> Json<AuthResponse> {
    cookies.remove_private(Cookie::named(users::Model::COOKIE_ID));
    Json(AuthResponse { success: true })
}
