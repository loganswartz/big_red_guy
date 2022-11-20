//! SeaORM Entity. Generated by sea-orm-codegen 0.10.1

use sea_orm::entity::prelude::*;
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize)]
#[sea_orm(table_name = "wishlist_items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub owner_id: i32,
    pub name: String,
    pub notes: Option<String>,
    pub url: Option<String>,
    pub quantity: Option<i32>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::users::Entity",
        from = "Column::OwnerId",
        to = "super::users::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Users,
    #[sea_orm(has_many = "super::wishlist_item_list_assignments::Entity")]
    WishlistItemListAssignments,
    #[sea_orm(has_many = "super::wishlist_item_user_fulfillments::Entity")]
    WishlistItemUserFulfillments,
}

pub struct WishlistItemToUsers;

impl Linked for WishlistItemToUsers {
    type FromEntity = Entity;
    type ToEntity = super::users::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            super::wishlist_item_list_assignments::Relation::WishlistItems
                .def()
                .rev(),
            super::wishlists::Relation::WishlistItemListAssignments
                .def()
                .rev(),
            super::wishlist_party_assignments::Relation::Wishlists
                .def()
                .rev(),
            super::parties::Relation::WishlistPartyAssignments
                .def()
                .rev(),
            super::party_memberships::Relation::Parties.def().rev(),
            super::users::Relation::PartyMemberships.def().rev(),
        ]
    }
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl Related<super::wishlist_item_list_assignments::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::WishlistItemListAssignments.def()
    }
}

impl Related<super::wishlist_item_user_fulfillments::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::WishlistItemUserFulfillments.def()
    }
}

impl Related<super::wishlists::Entity> for Entity {
    fn to() -> RelationDef {
        super::wishlist_item_list_assignments::Relation::Wishlists.def()
    }
    fn via() -> Option<RelationDef> {
        Some(
            super::wishlist_item_list_assignments::Relation::WishlistItems
                .def()
                .rev(),
        )
    }
}

impl ActiveModelBehavior for ActiveModel {}
