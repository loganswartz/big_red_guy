//! SeaORM Entity. Generated by sea-orm-codegen 0.10.1

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "wishlist_item_list_assignments")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub wishlist_id: i32,
    #[sea_orm(primary_key, auto_increment = false)]
    pub wishlist_item_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::wishlist_items::Entity",
        from = "Column::WishlistItemId",
        to = "super::wishlist_items::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    WishlistItems,
    #[sea_orm(
        belongs_to = "super::wishlists::Entity",
        from = "Column::WishlistId",
        to = "super::wishlists::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Wishlists,
}

impl Related<super::wishlist_items::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::WishlistItems.def()
    }
}

impl Related<super::wishlists::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Wishlists.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
