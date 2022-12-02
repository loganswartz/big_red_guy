use std::env;
use std::process::Command;

fn main() -> Result<(), String> {
    if env::var("PROFILE").unwrap() == *"release" {
        let include = [
            "../frontend/package.json",
            "../frontend/yarn.lock",
            "../frontend/tsconfig.json",
            "../frontend/public/",
            "../frontend/src/",
        ];
        for path in include {
            println!("cargo:rerun-if-changed={}", path);
        }

        let path = format!("{}/../frontend", env!("CARGO_MANIFEST_DIR"));

        let status = Command::new("yarn")
            .current_dir(&path)
            .args(["build-release"])
            .status()
            .expect("Failed to start frontend build process.");

        if status.success() {
            println!("cargo:warning=Frontend was successfully built.");
        } else {
            println!("cargo:warning=Failed to build frontend.");
            return Err(status.to_string());
        }
    }

    Ok(())
}
