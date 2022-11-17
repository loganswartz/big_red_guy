use rocket::{get, response::status::BadRequest};

#[get("/<_..>", rank = 11)]
pub async fn get() -> BadRequest<()> {
    BadRequest::<()>(None)
}
