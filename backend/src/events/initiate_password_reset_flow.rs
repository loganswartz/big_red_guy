use std::collections::HashMap;

use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection};
use tera::Context;

use crate::{
    email::{builder::TEMPLATES, smtp::send_email},
    entities::{
        transactional_events::{self, EventType, TokenTuple},
        users,
    },
    rocket_anyhow::Result as RocketResult,
    utils::templating::frontend_url,
};

pub async fn dispatch(db: &DatabaseConnection, user: &users::Model) -> RocketResult<()> {
    let TokenTuple { token, mut event } = transactional_events::ActiveModel::generate()?;

    event.event_type = Set(EventType::PasswordReset);
    event.target_user_id = Set(Some(user.id));
    event.save(db).await?;

    let mut context = Context::new();
    context.insert("name", &user.name);
    context.insert(
        "url",
        &frontend_url(
            "/reset-password",
            Some(HashMap::from([("token".to_owned(), token)])),
        ),
    );

    let body = TEMPLATES.render("reset-password.html", &context)?;
    send_email(&user.email, "Reset your password", &body)?;

    Ok(())
}
