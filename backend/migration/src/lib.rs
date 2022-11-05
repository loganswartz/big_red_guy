pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_user_table;
mod m20221102_220210_add_parties_table;
mod m20221103_141655_add_lists;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_user_table::Migration),
            Box::new(m20221102_220210_add_parties_table::Migration),
            Box::new(m20221103_141655_add_lists::Migration),
        ]
    }
}
