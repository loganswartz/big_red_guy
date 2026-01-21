pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_user_table;
mod m20221102_220210_add_parties_table;
mod m20221103_141655_add_lists;
mod m20221125_230206_add_notes_to_fulfillments;
mod m20231031_164126_add_transactional_events_table;
mod m20260120_153240_add_settings_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_user_table::Migration),
            Box::new(m20221102_220210_add_parties_table::Migration),
            Box::new(m20221103_141655_add_lists::Migration),
            Box::new(m20221125_230206_add_notes_to_fulfillments::Migration),
            Box::new(m20231031_164126_add_transactional_events_table::Migration),
            Box::new(m20260120_153240_add_settings_table::Migration),
        ]
    }
}
