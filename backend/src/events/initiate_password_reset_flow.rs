use std::collections::HashMap;

use anyhow::Result;
use rocket::async_trait;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection};
use tera::Context;

use crate::{
    email::{builder::TEMPLATES, smtp::send_email},
    entities::{
        transactional_events::{self, EventType, TokenTuple},
        users,
    },
    queue::Task,
    utils::templating::frontend_url,
};

pub struct SendPasswordResetEmail {
    user: users::Model,
    db: DatabaseConnection,
}

impl SendPasswordResetEmail {
    pub fn new(db: &DatabaseConnection, user: &users::Model) -> Self {
        Self {
            user: user.clone(),
            db: db.clone(),
        }
    }
}

#[async_trait]
impl Task for SendPasswordResetEmail {
    async fn run(&self) -> Result<()> {
        let TokenTuple { token, mut event } = transactional_events::ActiveModel::generate()?;

        event.event_type = Set(EventType::PasswordReset);
        event.primary_user_id = Set(Some(self.user.id));
        event.insert(&self.db).await?;

        let mut context = Context::new();
        context.insert("name", &self.user.name);
        context.insert(
            "url",
            &frontend_url(
                "/reset-password",
                Some(HashMap::from([("token".to_owned(), token)])),
            )?,
        );

        let body = TEMPLATES.render("reset-password.html", &context)?;
        send_email(&self.user.email, "Reset your password", &body)?;

        Ok(())
    }
}
