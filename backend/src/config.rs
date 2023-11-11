use rocket::{
    figment::{
        providers::{Env, Format, Serialized, Toml},
        Figment, Profile,
    },
    Config,
};
use serde::{Deserialize, Serialize};

/// The application configuration.
///
/// The `setup` method is used to create the `Figment` instance that ultimately provides all
/// configuration for the app, and for Rocket. Rocket uses it to extract its config, and we can use
/// the `get` method to extract the application config from any part of the app. The `port` field
/// is shared between the two configs, since that info is needed in some parts of the application.
///
/// The `Figment` instance we create with `setup` is almost exactly the same as the default Rocket
/// configuration provider, with some small tweaks to change the config filename from `Rocket.toml`
/// to `config.toml`, and change the prefix on environment variables from `ROCKET_` to `BRG_`.
#[derive(Debug, Serialize, Deserialize)]
#[allow(unused)]
pub struct AppConfig {
    /// The hostname the server is being served on.
    pub hostname: String,
    /// The port to serve on. (default: same as Rocket's default)
    pub port: u16,
    /// The port to use when building URLs. (default: same as `port`)
    pub public_port: u16,
    /// The base URL of the server. (default: "/")
    pub base_url: String,
    /// Whether the app is publicly available over HTTPS. (default: false)
    pub https: bool,
    /// Email configuration options.
    pub email: Option<EmailConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(unused)]
pub struct EmailConfig {
    /// The hostname of the SMTP server.
    pub smtp_host: String,
    /// The username for SMTP authentication.
    pub username: String,
    /// The password for SMTP authentication.
    pub password: String,
    /// The email address to send from.
    pub from_address: String,
}

impl Default for AppConfig {
    fn default() -> AppConfig {
        AppConfig {
            hostname: "localhost".to_string(),
            base_url: "/".to_string(),
            port: Config::default().port,
            public_port: Config::default().port,
            https: false,
            email: None,
        }
    }
}

impl AppConfig {
    /// Create the `Figment` instance used to extract the application configuration.
    pub fn figment() -> Figment {
        Figment::from(rocket::Config::default())
            .merge(Serialized::defaults(AppConfig::default()))
            .merge(Toml::file(Env::var_or("BRG_CONFIG", "config.toml")).nested())
            .merge(Env::prefixed("BRG_").ignore(&["PROFILE"]).global())
            .select(Profile::from_env_or(
                "BRG_PROFILE",
                rocket::Config::DEFAULT_PROFILE,
            ))
    }

    /// Get the application configuration.
    pub fn get() -> Result<Self, rocket::figment::Error> {
        AppConfig::figment().extract()
    }
}
