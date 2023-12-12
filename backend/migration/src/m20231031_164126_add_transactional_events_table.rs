use sea_orm_migration::prelude::*;

use crate::m20220101_000001_create_user_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

struct KeyManager {
    primary_user: String,
    secondary_user: String,
}

impl KeyManager {
    fn init() -> Self {
        KeyManager {
            primary_user: Self::format(
                &TransactionalEvents::Table.to_string(),
                &TransactionalEvents::PrimaryUserId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
            secondary_user: Self::format(
                &TransactionalEvents::Table.to_string(),
                &TransactionalEvents::SecondaryUserId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
        }
    }

    fn format(
        local_table: &str,
        local_key: &str,
        foreign_table: &str,
        foreign_key: &str,
    ) -> String {
        format!(
            "FK_{}_{}_{}_{}",
            local_table, local_key, foreign_table, foreign_key
        )
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let keys = KeyManager::init();

        manager
            .create_table(
                Table::create()
                    .table(TransactionalEvents::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(TransactionalEvents::Hash)
                            .string_len(64) // sha256
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(TransactionalEvents::EventType)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(TransactionalEvents::PrimaryUserId).big_unsigned())
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.primary_user)
                            .from(
                                TransactionalEvents::Table,
                                TransactionalEvents::PrimaryUserId,
                            )
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(TransactionalEvents::SecondaryUserId).big_unsigned())
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.secondary_user)
                            .from(
                                TransactionalEvents::Table,
                                TransactionalEvents::PrimaryUserId,
                            )
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(TransactionalEvents::MiscData).json())
                    .col(ColumnDef::new(TransactionalEvents::CreatedAt).timestamp())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TransactionalEvents::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(DeriveIden)]
enum TransactionalEvents {
    Table,
    Hash,
    EventType,
    PrimaryUserId,
    SecondaryUserId,
    MiscData,
    CreatedAt,
}
