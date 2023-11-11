use lettre::{
    message::header::ContentType,
    transport::smtp::{
        authentication::{Credentials, Mechanism},
        PoolConfig,
    },
    Message, SmtpTransport, Transport,
};

use crate::rocket_anyhow::Result as RocketResult;
use crate::{bail_msg, config::AppConfig};

pub fn send_email(to: &str, subject: &str, body: &str) -> RocketResult<()> {
    let config = AppConfig::get()?;
    let Some(email) = &config.email else {
        bail_msg!("Email not configured.");
    };

    // Create TLS transport on port 587 with STARTTLS
    let sender = SmtpTransport::starttls_relay(&email.smtp_host)?
        // Add credentials for authentication
        .credentials(Credentials::new(
            email.username.to_owned(),
            email.password.to_owned(),
        ))
        .authentication(vec![Mechanism::Plain])
        .pool_config(PoolConfig::new().max_size(20))
        .build();

    let message = Message::builder()
        .from(email.from_address.parse()?)
        .reply_to(email.from_address.parse()?)
        .to(to.parse()?)
        .subject(subject)
        .header(ContentType::TEXT_HTML)
        .body(body.to_string())?;

    sender.send(&message)?;

    Ok(())
}
