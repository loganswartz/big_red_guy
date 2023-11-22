use rocket::{post, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use serde::Deserialize;

use super::reset_password::AuthResponse;
use crate::db::pool::Db;
use crate::entities::users;
use crate::events::initiate_password_reset_flow::SendPasswordResetEmail;
use crate::queue::ManagedQueue;
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct ForgotPasswordForm<'r> {
    pub email: &'r str,
}

#[post("/forgot-password", data = "<values>")]
pub async fn post(
    queue: &rocket::State<ManagedQueue>,
    db: Connection<Db>,
    values: Json<ForgotPasswordForm<'_>>,
) -> RocketResult<Json<AuthResponse>> {
    let found = users::Entity::find()
        .filter(users::Column::Email.contains(values.email))
        .one(&*db)
        .await?;

    let Some(user) = found else {
        return Ok(Json(AuthResponse { success: true }))
    };

    let job = Box::new(SendPasswordResetEmail::new(&*db, &user));
    let success = queue.try_push(job).is_ok();
    if !success {
        println!("Failed to queue job");
    }

    // always return success to avoid leaking existing accounts
    Ok(Json(AuthResponse { success }))
}
