use rocket::async_trait;
use rocket_db_pools::Database;
use rocket_db_pools::{rocket::figment::Figment, Config};

#[derive(Database, Debug)]
#[database("main")]
pub struct Db(RocketDbPool);

#[derive(Debug, Clone)]
pub struct RocketDbPool {
    pub conn: sea_orm::DatabaseConnection,
}

#[async_trait]
impl rocket_db_pools::Pool for RocketDbPool {
    type Error = sea_orm::DbErr;

    type Connection = sea_orm::DatabaseConnection;

    async fn init(figment: &Figment) -> Result<Self, Self::Error> {
        let config = figment.extract::<Config>().unwrap();
        let conn = sea_orm::Database::connect(&config.url).await?;

        Ok(RocketDbPool { conn })
    }

    async fn get(&self) -> Result<Self::Connection, Self::Error> {
        Ok(self.conn.clone())
    }
}
