use sea_orm_migration::prelude::*;

use crate::m20220101_000001_create_user_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

struct KeyManager {
    party_owner: String,
    party_member_user: String,
    party_member_party: String,
}

impl KeyManager {
    fn init() -> Self {
        KeyManager {
            party_owner: Self::format(
                &Parties::Table.to_string(),
                &Parties::OwnerId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
            party_member_party: Self::format(
                &PartyMemberships::Table.to_string(),
                &PartyMemberships::PartyId.to_string(),
                &Parties::Table.to_string(),
                &Parties::Id.to_string(),
            ),
            party_member_user: Self::format(
                &PartyMemberships::Table.to_string(),
                &PartyMemberships::UserId.to_string(),
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
                    .table(Parties::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Parties::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Parties::Name).string().not_null())
                    .col(ColumnDef::new(Parties::OwnerId).big_unsigned().not_null())
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.party_owner)
                            .from(Parties::Table, Parties::OwnerId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(PartyMemberships::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PartyMemberships::UserId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.party_member_user)
                            .from(PartyMemberships::Table, PartyMemberships::UserId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(PartyMemberships::PartyId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.party_member_party)
                            .from(PartyMemberships::Table, PartyMemberships::PartyId)
                            .to(Parties::Table, Parties::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .primary_key(
                        Index::create()
                            .col(PartyMemberships::UserId)
                            .col(PartyMemberships::PartyId),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let keys = KeyManager::init();

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.party_owner)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.party_member_user)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.party_member_party)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_table(Table::drop().table(Parties::Table).to_owned())
            .await?;

        Ok(())
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(DeriveIden)]
pub enum Parties {
    Table,
    Id,
    Name,
    OwnerId,
}

#[derive(DeriveIden)]
pub enum PartyMemberships {
    Table,
    UserId,
    PartyId,
}
