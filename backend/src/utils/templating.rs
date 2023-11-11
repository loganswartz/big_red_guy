use std::collections::HashMap;

use anyhow::Result;
use regex::Regex;
use tera::{from_value, Value as JsonValue};
use tera::{Error, Function, Result as TeraResult};
use url::form_urlencoded::byte_serialize;

use crate::config::AppConfig;

/// Generate a frontend URL.
pub fn frontend_url(path: &str, query: Option<HashMap<String, String>>) -> Result<String> {
    let config = AppConfig::get()?;

    // start with the protocol and hostname
    let mut uri = String::from("http");
    if config.https {
        uri.push_str("s")
    }
    uri.push_str("://");
    uri.push_str(&config.hostname);

    // add port, base URL, and path
    if config.public_port != 80 && config.public_port != 443 {
        uri.push_str(&format!(":{}", config.public_port));
    }
    uri.push_str(&config.base_url);
    uri.push_str(&format!("/{}", path));

    // add the query string if present
    if let Some(map) = query {
        let query_string = map
            .iter()
            .map(|(k, v)| format!("{}={}", url_encode(k), url_encode(v)))
            .collect::<Vec<String>>()
            .join("&");

        uri.push_str(&format!("?{}", query_string));
    }

    // collapse any double slashes to single slashes
    // (except for the double slashes in the protocol)
    let collapsed_uri = Regex::new(r"([^:])(//+)").unwrap().replace_all(&uri, "$1/");

    Ok(collapsed_uri.to_string())
}

fn url_encode(input: &str) -> String {
    byte_serialize(input.as_bytes()).collect::<String>()
}

/// A Tera wrapper around `frontend_url`.
pub struct TeraUrlFor {}

impl TeraUrlFor {
    pub fn new() -> Self {
        Self {}
    }
}

impl Function for TeraUrlFor {
    fn call(&self, args: &HashMap<String, JsonValue>) -> TeraResult<JsonValue> {
        let value = args.get("path").cloned().map(from_value::<String>);
        let Some(path) = value else {
            return Err(Error::msg("Missing path argument"));
        };

        match frontend_url(&path?.to_string(), None) {
            Ok(url) => Ok(JsonValue::String(url)),
            Err(e) => Err(Error::msg(e.to_string())),
        }
    }

    fn is_safe(&self) -> bool {
        true
    }
}
