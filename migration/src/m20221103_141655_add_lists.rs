use sea_orm_migration::prelude::*;

use crate::{
    m20220101_000001_create_user_table::Users, m20221102_220210_add_parties_table::Parties,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

struct KeyManager {
    wishlist_owner: String,
    wishlist_party: String,
    wishlist_items_owner: String,
    wishlist_item_list_assignment_wishlist: String,
    wishlist_item_list_assignment_items: String,
    wishlist_item_user_fulfillment_user: String,
    wishlist_item_user_fulfillment_items: String,
}

impl KeyManager {
    fn init() -> Self {
        KeyManager {
            wishlist_owner: Self::format(
                &Wishlists::Table.to_string(),
                &Wishlists::OwnerId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
            wishlist_party: Self::format(
                &Wishlists::Table.to_string(),
                &Wishlists::PartyId.to_string(),
                &Parties::Table.to_string(),
                &Parties::Id.to_string(),
            ),
            wishlist_items_owner: Self::format(
                &WishlistItems::Table.to_string(),
                &WishlistItems::OwnerId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
            wishlist_item_list_assignment_wishlist: Self::format(
                &WishlistItemListAssignments::Table.to_string(),
                &WishlistItemListAssignments::WishlistItemId.to_string(),
                &Wishlists::Table.to_string(),
                &Wishlists::Id.to_string(),
            ),
            wishlist_item_list_assignment_items: Self::format(
                &WishlistItemListAssignments::Table.to_string(),
                &WishlistItemListAssignments::WishlistItemId.to_string(),
                &WishlistItems::Table.to_string(),
                &WishlistItems::Id.to_string(),
            ),
            wishlist_item_user_fulfillment_user: Self::format(
                &WishlistItemUserFulfillments::Table.to_string(),
                &WishlistItemUserFulfillments::UserId.to_string(),
                &Users::Table.to_string(),
                &Users::Id.to_string(),
            ),
            wishlist_item_user_fulfillment_items: Self::format(
                &WishlistItemUserFulfillments::Table.to_string(),
                &WishlistItemUserFulfillments::WishlistItemId.to_string(),
                &WishlistItems::Table.to_string(),
                &WishlistItems::Id.to_string(),
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
                    .table(Wishlists::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Wishlists::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Wishlists::OwnerId).big_unsigned().not_null())
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_owner)
                            .from(Wishlists::Table, Wishlists::OwnerId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(Wishlists::PartyId).big_unsigned())
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_party)
                            .from(Wishlists::Table, Wishlists::PartyId)
                            .to(Parties::Table, Parties::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(Wishlists::Name).string().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(WishlistItems::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(WishlistItems::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(WishlistItems::OwnerId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_items_owner)
                            .from(WishlistItems::Table, WishlistItems::OwnerId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(WishlistItems::Name).string().not_null())
                    .col(ColumnDef::new(WishlistItems::Url).string())
                    .col(ColumnDef::new(WishlistItems::Quantity).big_unsigned())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(WishlistItemListAssignments::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(WishlistItemListAssignments::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(WishlistItemListAssignments::WishlistId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_item_list_assignment_wishlist)
                            .from(
                                WishlistItemListAssignments::Table,
                                WishlistItemListAssignments::WishlistItemId,
                            )
                            .to(Wishlists::Table, Wishlists::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(WishlistItemListAssignments::WishlistItemId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_item_list_assignment_items)
                            .from(
                                WishlistItemListAssignments::Table,
                                WishlistItemListAssignments::WishlistItemId,
                            )
                            .to(WishlistItems::Table, WishlistItems::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(WishlistItemUserFulfillments::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(WishlistItemUserFulfillments::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(WishlistItemUserFulfillments::UserId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_item_user_fulfillment_user)
                            .from(
                                WishlistItemUserFulfillments::Table,
                                WishlistItemUserFulfillments::UserId,
                            )
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(WishlistItemUserFulfillments::WishlistItemId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        sea_query::ForeignKey::create()
                            .name(&keys.wishlist_item_user_fulfillment_items)
                            .from(
                                WishlistItemUserFulfillments::Table,
                                WishlistItemUserFulfillments::WishlistItemId,
                            )
                            .to(WishlistItems::Table, WishlistItems::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(WishlistItemUserFulfillments::Quantity)
                            .big_unsigned()
                            .default(1),
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
                    .name(&keys.wishlist_owner)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_party)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_items_owner)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_item_list_assignment_wishlist)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_item_list_assignment_items)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_item_user_fulfillment_user)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name(&keys.wishlist_item_user_fulfillment_items)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(Table::drop().table(Wishlists::Table).to_owned())
            .await?;

        Ok(())
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
pub enum Wishlists {
    Table,
    Id,
    OwnerId,
    PartyId,
    Name,
}

#[derive(Iden)]
pub enum WishlistItems {
    Table,
    Id,
    OwnerId,
    Name,
    Url,
    Quantity,
}

#[derive(Iden)]
pub enum WishlistItemListAssignments {
    Table,
    Id,
    WishlistId,
    WishlistItemId,
}

#[derive(Iden)]
pub enum WishlistItemUserFulfillments {
    Table,
    Id,
    UserId,
    WishlistItemId,
    Quantity,
}
