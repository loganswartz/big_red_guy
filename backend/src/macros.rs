#[macro_export]
macro_rules! bail_msg {
    ($msg:literal) => {
        return Err($crate::rocket_anyhow::Error {
            0: anyhow::anyhow!($msg),
        })
    };
}
