use rocket::{get, response::status::BadRequest};

#[get("/<_..>", rank = 13)]
pub async fn get() -> BadRequest<()> {
    BadRequest(())
}
