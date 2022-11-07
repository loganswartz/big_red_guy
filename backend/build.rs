use std::process::Command;

fn main() -> Result<(), std::io::Error> {
    let path = format!("{}/../frontend", env!("CARGO_MANIFEST_DIR"));

    Command::new("yarn").args(&["build", &path]).status()?;

    Ok(())
}
