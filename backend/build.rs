use std::env;
use std::process::Command;

fn main() -> Result<(), std::io::Error> {
    if env::var("PROFILE").unwrap() == "release".to_owned() {
        let path = format!("{}/../frontend", env!("CARGO_MANIFEST_DIR"));

        Command::new("yarn")
            .current_dir(&path)
            .args(&["build"])
            .status()
            .expect("Failed to build frontend.");

        println!("cargo:warning=Frontend was successfully built.");
    }

    Ok(())
}
