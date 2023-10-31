use std::collections::HashMap;

use regex::Regex;
use url::form_urlencoded::byte_serialize;

/// Generate a frontend URL.
pub fn frontend_url(path: &str, query: Option<HashMap<String, String>>) -> String {
    let host = "";

    let query_string = query
        .unwrap_or_default()
        .iter()
        .map(|(k, v)| format!("{}={}", k, v))
        .collect::<Vec<String>>()
        .join("&");

    let naive_uri = format!("{}/{}?{}", host, path, query_string);
    let sanitized_uri = Regex::new(r"([^:])(//+)")
        .unwrap()
        .replace_all(&naive_uri, "$1/");

    byte_serialize(&sanitized_uri.as_bytes()).collect::<String>()
}
