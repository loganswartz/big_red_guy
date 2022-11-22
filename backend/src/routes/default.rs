use rocket::{get, response::content::RawHtml};
use std::borrow::Cow;

use crate::routes::statics::Asset;

#[get("/<_..>", rank = 15)]
pub fn get() -> Option<RawHtml<Cow<'static, [u8]>>> {
    let asset = Asset::get("index.html")?;
    Some(RawHtml(asset.data))
}
