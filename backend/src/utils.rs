use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, PasswordVerifier,
};

pub fn make_salted_hash(password: &str) -> Result<String, argon2::password_hash::Error> {
    let password = password.as_bytes();
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    argon2
        .hash_password(password, &salt)
        .map(|hash| hash.to_string())
}

pub fn verify_hash(hash: &str, password: &str) -> bool {
    let stored = match argon2::PasswordHash::new(hash) {
        Ok(value) => value,
        Err(_) => return false,
    };

    Argon2::default()
        .verify_password(password.as_bytes(), &stored)
        .is_ok()
}
