use argon2;
use rand::distributions::Alphanumeric;
use rand::prelude::*;

pub fn gen_salt(count: usize) -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(count)
        .map(char::from)
        .collect::<String>()
}

pub fn make_password_hash(password: &str) -> argon2::Result<String> {
    let password = password.as_bytes();
    let salt = gen_salt(16);
    let config = argon2::Config::default();

    argon2::hash_encoded(password, salt.as_bytes(), &config)
}
