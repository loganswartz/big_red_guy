use rand::distributions::Alphanumeric;
use rand::prelude::*;

pub fn get_random_alphanumeric(count: usize) -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(count)
        .map(char::from)
        .collect::<String>()
}

pub fn make_salted_hash(password: &str) -> argon2::Result<String> {
    let password = password.as_bytes();
    let salt = get_random_alphanumeric(16);
    let config = argon2::Config::default();

    argon2::hash_encoded(password, salt.as_bytes(), &config)
}
