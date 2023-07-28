use self::user::WrappedUserResponse;
use crate::request_base;
use mongodb::{
    bson::{doc, Document},
    Client,
};
use std::error::Error;
use tokio_stream::StreamExt;

pub mod user {
    use mongodb::bson::{Document, DateTime};
    pub use response::WrappedUserResponse;
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub struct User {
        #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
        id: Option<u32>,
        firstname: String,
        lastname: String,
        username: String,
        email: String,
        password: String,
        is_admin: bool,
        img: String,
        created_at: DateTime,
        updated_at: DateTime,
        #[serde(rename = "__v", skip_serializing_if = "Option::is_none")]
        v: Option<i32>,
    }

    impl From<User> for mongodb::error::Result<Document> {
        fn from(value: User) -> Self {
            let bson = mongodb::bson::to_bson(&value)?;
            Ok(bson.as_document().unwrap().to_owned())
        }
    }

    mod response {
        use super::User;
        use chrono::Utc;
        use mongodb::bson::{Document, DateTime};
        use rayon::prelude::{IntoParallelIterator, ParallelIterator};
        use serde::{Deserialize, Serialize};

        #[derive(Debug, Serialize, Deserialize)]
        #[serde(rename_all = "kebab-case")]
        enum Gender {
            Female,
            Male,
            NonBinary,
        }

        #[derive(Debug, Serialize, Deserialize)]
        struct Name {
            title: String,
            first: String,
            last: String,
        }

        #[derive(Debug, Serialize, Deserialize)]
        struct Email(String);

        #[derive(Debug, Serialize, Deserialize)]
        struct Login {
            uuid: String,
            username: String,
            password: String,
            salt: String,
            md5: String,
            sha1: String,
            sha256: String,
        }

        #[derive(Debug, Serialize, Deserialize)]
        struct Picture {
            large: String,
            medium: String,
            thumbnail: String,
        }

        #[derive(Debug, Serialize, Deserialize)]
        struct UserResponse {
            gender: Gender,
            name: Name,
            email: Email,
            login: Login,
            picture: Picture,
        }

        #[derive(Debug, Deserialize)]
        pub struct WrappedUserResponse {
            results: Vec<UserResponse>,
        }

        impl From<UserResponse> for User {
            fn from(value: UserResponse) -> Self {
                User {
                    id: None,
                    firstname: value.name.first,
                    lastname: value.name.last,
                    username: value.login.username,
                    email: value.email.0,
                    password: value.login.password,
                    is_admin: false,
                    img: value.picture.medium,
                    created_at: DateTime::from_chrono(Utc::now()),
                    updated_at: DateTime::from_chrono(Utc::now()),
                    v: Some(0),
                }
            }
        }

        impl From<WrappedUserResponse> for Vec<Document> {
            fn from(value: WrappedUserResponse) -> Self {
                const THRESHOLD: usize = 500;
                if value.results.len() > THRESHOLD {
                    value
                        .results
                        .into_par_iter()
                        .map(Into::<User>::into)
                        .map(Into::<mongodb::error::Result<Document>>::into)
                        .filter_map(Result::ok)
                        .collect()
                } else {
                    value
                        .results
                        .into_iter()
                        .map(Into::<User>::into)
                        .map(Into::<mongodb::error::Result<Document>>::into)
                        .filter_map(Result::ok)
                        .collect()
                }
            }
        }
    }
}

pub struct Action {
    choice: Choice,
}

enum Choice {
    Add(Add),
    Remove(Remove),
    Clear(Clear),
    List(List),
}

struct Add {
    num_users: u32,
    database: String,
}

struct Remove {
    num_users: u32,
    database: String,
}

struct Clear {
    database: String,
}

struct List {
    database: String,
}

impl Add {
    pub async fn try_apply(
        self,
        db: Client,
    ) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        let response_str = send_api_request(self.num_users).await?;
        let response: WrappedUserResponse = serde_json::from_str(&response_str)?;
        let docs: Vec<Document> = response.into();
        let users = db.database(&self.database).collection::<Document>("users");
        users.insert_many(&docs, None).await?;
        Ok(format!(
            "Generated and added {} user(s) to database \"{}\" under collection \"users\"",
            docs.len(),
            self.database.trim()
        ))
    }
}

impl Remove {
    pub async fn try_apply(
        self,
        db: Client,
    ) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        let users = db.database(&self.database).collection::<Document>("users");
        let pipeline = vec![doc! {
            "$sample": {
                "size": self.num_users
            },
            "$project": {
                "_id": 1
            }
        }];
        let ids = users.aggregate(pipeline, None).await?;
        let ids: Vec<Document> = ids.filter_map(Result::ok).collect().await;
        let query = doc! {
            "_id": { "$in": &ids }
        };
        users.delete_many(query, None).await?;
        Ok(format!(
            "Removed {} user(s) from database \"{}\" under collection \"users\"",
            ids.len(),
            self.database.trim()
        ))
    }
}

impl Clear {
    pub async fn try_apply(
        self,
        db: Client,
    ) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        db.database(&self.database)
            .collection::<Document>("users")
            .drop(None)
            .await?;
        Ok(format!(
            "Cleared out collection \"users\" from database \"{}\"",
            self.database.trim()
        ))
    }
}

impl List {
    pub async fn try_apply(
        self,
        db: Client,
    ) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        let users = db.database(&self.database).collection::<Document>("users");
        let mut num_users = 0;
        let mut users = users.find(None, None).await?;
        println!("Got users, printing now!");
        while let Some(user) = users.next().await {
            if let Ok(user) = user {
                println!("{},", serde_json::to_string_pretty(&user)?);
                num_users += 1;
            }
        }
        Ok(format!(
            "Retrieved {} user(s) from database \"{}\" under collection \"users\"",
            num_users,
            self.database.trim()
        ))
    }
}

impl Action {
    pub fn add(num_users: u32, database: String) -> Self {
        Self {
            choice: Choice::Add(Add {
                num_users,
                database,
            }),
        }
    }

    pub fn remove(num_users: u32, database: String) -> Self {
        Self {
            choice: Choice::Remove(Remove {
                num_users,
                database,
            }),
        }
    }

    pub fn clear(database: String) -> Self {
        Self {
            choice: Choice::Clear(Clear { database }),
        }
    }

    pub fn list(database: String) -> Self {
        Self {
            choice: Choice::List(List { database }),
        }
    }

    pub async fn apply(self, db: Client) {
        println!("Starting new action!");
        match self.try_apply(db).await {
            Ok(success) => println!("Success: {success}"),
            Err(error) => println!("Error: {error}"),
        }
    }

    async fn try_apply(self, db: Client) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        let success: String;
        match self.choice {
            Choice::Add(add) => {
                success = add.try_apply(db).await?;
            }
            Choice::Remove(remove) => {
                success = remove.try_apply(db).await?;
            }
            Choice::Clear(clear) => {
                success = clear.try_apply(db).await?;
            }
            Choice::List(list) => {
                success = list.try_apply(db).await?;
            }
        }

        Ok(success)
    }
}

async fn send_api_request(num_users: u32) -> reqwest::Result<String> {
    reqwest::get(request_base!(num_users)).await?.text().await
}