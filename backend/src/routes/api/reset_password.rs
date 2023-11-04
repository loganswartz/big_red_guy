use rocket::{post, serde::json::Json};
use rocket_db_pools::Connection;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use crate::bail_msg;
use crate::db::pool::Db;
use crate::entities::transactional_events;
use crate::entities::users;
use crate::rocket_anyhow::Result as RocketResult;

#[derive(Deserialize, Debug)]
pub struct ResetPasswordForm<'r> {
    pub token: &'r str,
    pub password: &'r str,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct AuthResponse {
    pub success: bool,
}

#[post("/reset-password", data = "<values>")]
pub async fn post(
    db: Connection<Db>,
    user: users::Model,
    values: Json<ResetPasswordForm<'_>>,
) -> RocketResult<Json<AuthResponse>> {
    let Some(event) = transactional_events::Entity::find_from_token(values.token)
        .filter(
            transactional_events::Column::EventType
                .eq(transactional_events::EventType::PasswordReset),
        )
        .filter(transactional_events::Column::SourceUserId.eq(user.id))
        .one(&*db)
        .await?
    else {
        // we want to avoid leaking the reason for failure
        bail_msg!("Invalid token");
    };

    // validated
    let success = user.set_password(values.password, &*db).await.is_ok();
    // events are one-time use
    event.delete(&*db).await?;

    Ok(Json(AuthResponse { success }))
}
