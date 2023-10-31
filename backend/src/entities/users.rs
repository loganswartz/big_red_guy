//! SeaORM Entity. Generated by sea-orm-codegen 0.10.1

use rocket::{
    http::Status,
    outcome::Outcome,
    request::{self, FromRequest, Request},
};
use rocket_db_pools::Connection;
use sea_orm::{entity::prelude::*, IntoActiveModel, Set};
use serde::Serialize;

use crate::db::pool::Db;
use crate::utils::password;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub profile_picture: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::parties::Entity")]
    Parties,
    #[sea_orm(has_many = "super::party_memberships::Entity")]
    PartyMemberships,
    #[sea_orm(has_many = "super::wishlists::Entity")]
    Wishlists,
    #[sea_orm(has_many = "super::wishlist_items::Entity")]
    WishlistItems,
    #[sea_orm(has_many = "super::wishlist_item_user_fulfillments::Entity")]
    WishlistItemUserFulfillments,
}

impl Related<super::parties::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Parties.def()
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

impl Related<super::wishlist_items::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::WishlistItems.def()
    }
}

impl Related<super::wishlist_item_user_fulfillments::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::WishlistItemUserFulfillments.def()
    }
}

pub struct UserToParticipatingParties;

impl Linked for UserToParticipatingParties {
    type FromEntity = Entity;
    type ToEntity = super::parties::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            super::party_memberships::Relation::Users.def().rev(),
            super::party_memberships::Relation::Parties.def(),
        ]
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl Model {
    pub const COOKIE_ID: &str = "auth";

    pub async fn set_password(self, password: &str, db: Connection<Db>) -> Result<Model, String> {
        let mut active = self.into_active_model();
        let hash = match password::make_salted_hash(password) {
            Ok(value) => value,
            Err(e) => return Err(e.to_string()),
        };

        active.password = Set(hash);
        let model = match active.update(&*db).await {
            Ok(value) => value,
            Err(e) => return Err(e.to_string()),
        };

        Ok(model)
    }

    pub fn verify_password(&self, password: &str) -> bool {
        password::verify_hash(&self.password, password)
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Model {
    type Error = String;

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        let denied = Outcome::Failure((
            Status::Unauthorized,
            "No valid credentials found.".to_string(),
        ));

        let header = req
            .cookies()
            .get_private(Model::COOKIE_ID)
            .map(|cookie| cookie.value().to_owned());

        let id: i32 = match header.map(|value| value.parse()) {
            Some(Ok(id)) => id,
            _ => return denied,
        };

        let db = match req.rocket().state::<Db>() {
            Some(conn) => conn,
            _ => {
                return Outcome::Failure((
                    Status::InternalServerError,
                    "Unable to contact DB.".to_string(),
                ))
            }
        };

        let result = Entity::find_by_id(id).one(&db.conn).await;

        match result {
            Ok(Some(option)) => Outcome::Success(option),
            _ => denied,
        }
    }
}
