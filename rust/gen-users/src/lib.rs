use clap::{Args, Parser};
use mongodb::{
    bson::{doc, Document},
    options::ClientOptions,
    Client,
};
use response::WrappedUserResponse;
use serde::{Deserialize, Serialize};
use std::{error::Error, fs::File, io::Write, time::Duration};
use tokio::sync::{self, mpsc::Sender};
use tokio_stream::StreamExt;

const MAX_BUF: usize = 256;

static LANDING: &str = r#"
--------------------------------------------
|                                          |
|             *** Gen Users ***            |
|     A dev tool to generate users and     |
|     add or remove them to a database     |
|                                          |
--------------------------------------------
"#;

static OPTIONS: &str = r#"Available options:
a             - Gen random users and add to a database
r             - Remove random users from a database
c             - Clear all users from a database
l             - List users in a database
q (or Ctrl-D) - Quit program

Choice: "#;

#[derive(Debug)]
pub struct GenUsersCli {
    conn_uri: String,
}

#[derive(Debug, Parser)]
#[command(name = "gen-users", version = "0.1.0", author = "Group One")]
struct ArgsInner {
    #[command(flatten)]
    manual_spec: Option<ManualSpec>,

    /// Path to the json file containing the user connection info
    #[arg(short, long, exclusive = true)]
    file: Option<String>,
}

#[derive(Args, Debug, Deserialize, Serialize)]
#[group(required = false, multiple = false)]
#[serde(rename_all = "kebab-case")]
struct ManualSpec {
    /// Username to login to mongodb
    #[arg(short, long)]
    username: String,

    /// Password to login to mongodb
    #[arg(short, long)]
    password: String,

    /// Url of the mongodb to connect
    #[arg(long)]
    conn_url: String,
}

#[derive(Debug)]
enum Action {
    Add { num_users: u32, database: String },
    Remove { num_users: u32, database: String },
    Clear { database: String },
    List { database: String },
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct User {
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    is_admin: bool,
    img: String,
}

impl From<User> for mongodb::error::Result<Document> {
    fn from(value: User) -> Self {
        let bson = mongodb::bson::to_bson(&value)?;
        Ok(bson.as_document().unwrap().to_owned())
    }
}

impl GenUsersCli {
    pub fn parse() -> Result<GenUsersCli, std::io::Error> {
        const MAX_BUF: usize = 256;
        let inner = ArgsInner::parse();
        let cli = if let Some(path) = inner.file.as_ref() {
            let user_file = File::open(path)?;
            let br = std::io::BufReader::with_capacity(MAX_BUF, user_file);
            let spec: ManualSpec = serde_json::from_reader(br)?;
            GenUsersCli {
                conn_uri: spec.to_string(),
            }
        } else {
            GenUsersCli {
                conn_uri: inner
                    .manual_spec
                    .expect("manual spec should be filled if no file specified")
                    .to_string(),
            }
        };

        Ok(cli)
    }

    pub fn conn_uri(&self) -> &str {
        self.conn_uri.as_ref()
    }
}

impl ToString for ManualSpec {
    fn to_string(&self) -> String {
        format!(
            "mongodb+srv://{}:{}@{}/?retryWrites=true&w=majority",
            self.username, self.password, self.conn_url
        )
    }
}

impl Action {
    pub async fn apply(self, db: Client) {
        println!("Starting new action!");
        match self.try_apply(db).await {
            Ok(success) => println!("Success: {success}"),
            Err(error) => println!("Error: {error}"),
        }
    }

    async fn try_apply(self, db: Client) -> Result<String, Box<dyn Error + Send + Sync + 'static>> {
        let success: String;
        match self {
            Action::Add {
                num_users,
                database,
            } => {
                let response_str = send_api_request(num_users).await?;
                let response: WrappedUserResponse = serde_json::from_str(&response_str)?;
                let docs: Vec<Document> = response.into();
                let users = db.database(&database).collection::<Document>("users");
                users.insert_many(&docs, None).await?;
                success = format!(
                    "Generated and added {} user(s) to database \"{}\" under collection \"users\"",
                    docs.len(),
                    database.trim()
                );
            }
            Action::Remove {
                num_users,
                database,
            } => {
                let users = db.database(&database).collection::<Document>("users");
                let pipeline = vec![doc! {
                    "$sample": {
                        "size": num_users
                    },
                    "$project": {
                        "_id": 1
                    }
                }];
                let ids = users.aggregate(pipeline, None).await?;
                let ids: Vec<Document> = ids.filter_map(Result::ok).collect().await;
                users
                    .delete_many(
                        doc! {
                            "_id": {"$in": &ids }
                        },
                        None,
                    )
                    .await?;
                success = format!(
                    "Removed {} user(s) from database \"{}\" under collection \"users\"",
                    ids.len(),
                    database.trim()
                );
            }
            Action::Clear { database } => {
                db.database(&database)
                    .collection::<Document>("users")
                    .drop(None)
                    .await?;
                success = format!(
                    "Cleared out collection \"users\" from database \"{}\"",
                    database.trim()
                );
            }
            Action::List { database } => {
                let users = db.database(&database).collection::<Document>("users");
                let mut num_users = 0;
                let mut users = users.find(None, None).await?;
                println!("Got users, printing now!");
                while let Some(user) = users.next().await {
                    if let Ok(user) = user {
                        println!("{}", user);
                        num_users += 1;
                    }
                }
                success = format!(
                    "Retrieved {} user(s) from database \"{}\" under collection \"users\"",
                    num_users,
                    database.trim()
                );
            }
        }

        Ok(success)
    }
}

fn print_landing() {
    println!("{LANDING}")
}

fn print_options() {
    print!("{OPTIONS}")
}

pub async fn landing(args: GenUsersCli) -> Result<(), Box<dyn Error>> {
    let mongo = connect_db(args.conn_uri()).await?;
    let (tx, mut rx) = sync::mpsc::channel::<Action>(15);
    tokio::spawn(launch(tx));

    let mut tasks = Vec::with_capacity(12);

    loop {
        match rx.recv().await {
            Some(task) => tasks.push(tokio::spawn(task.apply(mongo.clone()))),
            None => break,
        }
    }

    for task in tasks {
        if !task.is_finished() {
            task.await?;
        }
    }

    Ok(())
}

async fn launch(tx: Sender<Action>) -> std::io::Result<()> {
    const TIMEOUT: u64 = 500;
    let mut input = String::with_capacity(MAX_BUF);
    print_landing();
    loop {
        input.clear();
        print_options();
        if async {
            let mut exit = false;
            std::io::stdout().flush()?;
            if std::io::stdin().read_line(&mut input)? == 0 {
                exit = true;
            }
            Ok::<bool, std::io::Error>(exit)
        }
        .await?
        {
            break;
        }

        match input.chars().next() {
            Some('a') => {
                input.clear();
                async {
                    print!("Enter database to append users: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                let database = input.clone();

                input.clear();
                async {
                    print!("Enter number of users to generate and add: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                match input.trim().parse::<u32>() {
                    Ok(num_users) => {
                        let _ = tx
                            .send_timeout(
                                Action::Add {
                                    num_users,
                                    database,
                                },
                                Duration::from_millis(TIMEOUT),
                            )
                            .await;
                    }
                    Err(e) => println!("Error: {e}"),
                }
            }
            Some('r') => {
                input.clear();
                async {
                    print!("Enter database to remove users from: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                let database = input.clone();

                input.clear();
                async {
                    print!("Enter number of users to remove: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                match input.trim().parse::<u32>() {
                    Ok(num_users) => {
                        let _ = tx
                            .send_timeout(
                                Action::Remove {
                                    num_users,
                                    database,
                                },
                                Duration::from_millis(TIMEOUT),
                            )
                            .await;
                    }
                    Err(e) => println!("Error: {e}"),
                }
            }
            Some('c') => {
                input.clear();
                async {
                    print!("Enter database to clear out: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                let database = input.clone();

                let _ = tx
                    .send_timeout(Action::Clear { database }, Duration::from_millis(TIMEOUT))
                    .await;
            }
            Some('l') => {
                input.clear();
                async {
                    print!("Enter database to list: ");
                    std::io::stdout().flush()?;
                    std::io::stdin().read_line(&mut input)?;
                    Ok::<(), std::io::Error>(())
                }
                .await?;
                let database = input.clone();

                let _ = tx
                    .send_timeout(Action::List { database }, Duration::from_millis(TIMEOUT))
                    .await;
            }
            Some('q') => break,
            _ => println!("Error: unknown option."),
        }
        println!();
        std::io::stdout().flush()?;
    }

    std::io::stdout().flush()
}

async fn send_api_request(num_users: u32) -> reqwest::Result<String> {
    reqwest::get(request_base!(num_users)).await?.text().await
}

async fn connect_db(conn_uri: &str) -> mongodb::error::Result<Client> {
    let options = ClientOptions::parse_async(conn_uri).await?;
    Client::with_options(options)
}

#[cfg(test)]
mod test {
    use crate::ArgsInner;
    use clap::CommandFactory;

    #[test]
    fn cli_works() {
        ArgsInner::command().debug_assert();
    }
}

mod macros {
    #[macro_export]
    macro_rules! request_base {
        ($txt:expr) => {
            format!("https://randomuser.me/api/?results={}&nat=us,mx,ca&inc=gender,name,email,login,picture&noinfo", $txt)
        };
    }
}

mod response {
    use crate::User;
    use mongodb::bson::{oid::ObjectId, Document};
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
        #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
        id: Option<ObjectId>,
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
                firstname: value.name.first,
                lastname: value.name.last,
                username: value.login.username,
                email: value.email.0,
                password: value.login.password,
                is_admin: false,
                img: value.picture.medium,
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
