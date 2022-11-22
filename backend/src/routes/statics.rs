use rocket::{
    get,
    http::uri::{fmt::Path, Segments},
    request::{FromRequest, Outcome},
    Request,
};

use rocket::http::ContentType;
use rust_embed::{EmbeddedFile, RustEmbed};
use std::borrow::Cow;
use std::ffi::OsStr;
use std::path::PathBuf;

use crate::rocket_anyhow;

#[derive(RustEmbed)]
#[folder = "../frontend/build/"]
pub struct Asset;

pub struct EmbeddedAsset {
    pub path: PathBuf,
    pub file: EmbeddedFile,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for EmbeddedAsset {
    type Error = rocket_anyhow::Error;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let buf = req
            .segments::<Segments<'_, Path>>(0..)
            .ok()
            .and_then(|segments| segments.to_path_buf(false).ok());

        let path = match buf {
            Some(path) => path,
            None => return Outcome::Forward(()),
        };
        let stringified = match path.to_str() {
            Some(path) => path,
            None => return Outcome::Forward(()),
        };

        let asset = Asset::get(stringified);
        match asset {
            Some(file) => Outcome::Success(Self { path, file }),
            None => Outcome::Forward(()),
        }
    }
}

#[get("/<_..>", rank = 12)]
pub fn get(asset: EmbeddedAsset) -> Option<(ContentType, Cow<'static, [u8]>)> {
    let content_type = asset
        .path
        .extension()
        .and_then(OsStr::to_str)
        .and_then(ContentType::from_extension)
        .unwrap_or(ContentType::Bytes);

    Some((content_type, asset.file.data))
}
