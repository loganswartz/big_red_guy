//! SeaORM Entity. Generated by sea-orm-codegen 0.10.1

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "parties")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub owner_id: i32,
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
    #[sea_orm(has_many = "super::party_memberships::Entity")]
    PartyMemberships,
    #[sea_orm(has_many = "super::wishlists::Entity")]
    Wishlists,
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl Related<super::party_memberships::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::PartyMemberships.def()
    }
}

impl Related<super::wishlists::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Wishlists.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
