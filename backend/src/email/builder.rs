use std::str;

use lazy_static::lazy_static;
use rust_embed::RustEmbed;
use tera::Tera;

use crate::utils::templating::TeraUrlFor;

#[derive(RustEmbed)]
#[folder = "src/email/templates/"]
struct EmailTemplate;

lazy_static! {
    pub static ref TEMPLATES: Tera = {
        let mut tera = Tera::default();
        tera.register_function("url_for", TeraUrlFor::new());

        EmailTemplate::iter().for_each(|filename| {
            let file = EmailTemplate::get(&filename).expect("Template should be loadable");
            tera.add_raw_template(
                &filename,
                str::from_utf8(file.data.as_ref()).expect("Template should be valid UTF-8"),
            )
            .expect("Template should be parsable");
        });

        tera
    };
}
