use sea_orm_migration::prelude::*;

use crate::m20221103_141655_add_lists::WishlistItemUserFulfillments;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(WishlistItemUserFulfillments::Table)
                    .add_column(ColumnDef::new(Alias::new("notes")).text().null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(WishlistItemUserFulfillments::Table)
                    .drop_column(Alias::new("notes"))
                    .to_owned(),
            )
            .await
    }
}
