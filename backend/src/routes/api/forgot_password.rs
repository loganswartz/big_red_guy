use rocket::{post, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use serde::Deserialize;

use super::reset_password::AuthResponse;
use crate::db::pool::Db;
use crate::entities::users;
use crate::events::initiate_password_reset_flow;
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct ForgotPasswordForm<'r> {
    pub email: &'r str,
}

#[post("/forgot-password", data = "<values>")]
pub async fn post(
    db: Connection<Db>,
    values: Json<ForgotPasswordForm<'_>>,
) -> RocketResult<Json<AuthResponse>> {
    let found = users::Entity::find()
        .filter(users::Column::Email.contains(values.email))
        .one(&*db)
        .await?;

    if let Some(user) = found {
        // TODO: offload to a background worker
        initiate_password_reset_flow::dispatch(&*db, &user).await?;
    };

    // always return success to avoid leaking existing accounts
    Ok(Json(AuthResponse { success: true }))
}
