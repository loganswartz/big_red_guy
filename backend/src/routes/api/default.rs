use rocket::{fs::NamedFile, get};
use std::{io, path::Path};

#[get("/<_..>", rank = 12)]
pub async fn get() -> io::Result<NamedFile> {
    let page_directory_path = format!("{}/../frontend/build", env!("CARGO_MANIFEST_DIR"));
    let absolute = Path::new(&page_directory_path).join("index.html");

    NamedFile::open(absolute).await
}
