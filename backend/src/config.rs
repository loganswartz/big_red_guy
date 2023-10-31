use rocket::figment::{
    providers::{Env, Format, Serialized, Toml},
    Figment, Profile,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[allow(unused)]
pub struct AppConfig {
    pub email: Option<EmailConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(unused)]
pub struct EmailConfig {
    pub smtp_host: String,
    pub username: String,
    pub password: String,
    pub from_address: String,
}

impl Default for AppConfig {
    fn default() -> AppConfig {
        AppConfig { email: None }
    }
}

impl AppConfig {
    pub fn setup() -> Figment {
        Figment::from(rocket::Config::default())
            .merge(Serialized::defaults(AppConfig::default()))
            .merge(Toml::file(Env::var_or("BRG_CONFIG", "config.toml")).nested())
            .merge(Env::prefixed("BRG_").ignore(&["PROFILE"]).global())
            .select(Profile::from_env_or(
                "BRG_PROFILE",
                rocket::Config::DEFAULT_PROFILE,
            ))
    }

    pub fn get() -> Result<Self, rocket::figment::Error> {
        AppConfig::setup().extract()
    }
}
