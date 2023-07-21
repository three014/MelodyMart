use action::Action;
pub use cli::GenUsersCli;
use mongodb::{options::ClientOptions, Client};
use std::{error::Error, io::Write, num::ParseIntError, time::Duration};
use tokio::sync::{self, mpsc::Sender};

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

mod cli;
mod action;

fn print_landing() {
    println!("{LANDING}")
}

fn print_options() {
    print!("{OPTIONS}")
}

pub async fn launch(args: GenUsersCli) -> Result<(), Box<dyn Error>> {
    let mongo = connect_db(args.conn_uri()).await?;
    let (tx, mut rx) = sync::mpsc::channel::<Action>(15);
    let landing = tokio::spawn(landing(tx));

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

    Ok(landing.await??)
}

async fn landing(tx: Sender<Action>) -> std::io::Result<()> {
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
            Some('a') => match handle_add_choice(&mut input).await? {
                Ok(action) => {
                    let _ = tx
                        .send_timeout(action, Duration::from_millis(TIMEOUT))
                        .await;
                }
                Err(e) => println!("Error: {e}"),
            },
            Some('r') => match handle_remove_choice(&mut input).await? {
                Ok(action) => {
                    let _ = tx
                        .send_timeout(action, Duration::from_millis(TIMEOUT))
                        .await;
                }
                Err(e) => println!("Error: {e}"),
            },
            Some('c') => {
                let _ = tx
                    .send_timeout(
                        handle_clear_choice(&mut input).await?,
                        Duration::from_millis(TIMEOUT),
                    )
                    .await;
            }
            Some('l') => {
                let _ = tx
                    .send_timeout(
                        handle_list_choice(&mut input).await?,
                        Duration::from_millis(TIMEOUT),
                    )
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

async fn handle_add_choice(buf: &mut String) -> std::io::Result<Result<Action, ParseIntError>> {
    buf.clear();
    async {
        print!("Enter database to append users: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    let database = buf.trim().to_owned();

    buf.clear();
    async {
        print!("Enter number of users to generate and add: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    Ok(buf
        .trim()
        .parse::<u32>()
        .map(|num_users| Action::add(num_users, database)))
}

async fn handle_remove_choice(buf: &mut String) -> std::io::Result<Result<Action, ParseIntError>> {
    buf.clear();
    async {
        print!("Enter database to remove users from: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    let database = buf.trim().to_owned();

    buf.clear();
    async {
        print!("Enter number of users to remove: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    Ok(buf
        .trim()
        .parse::<u32>()
        .map(|num_users| Action::remove(num_users, database)))
}

async fn handle_clear_choice(buf: &mut String) -> std::io::Result<Action> {
    buf.clear();
    async {
        print!("Enter database to clear out: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    let database = buf.trim().to_owned();
    Ok(Action::clear(database))
}

async fn handle_list_choice(buf: &mut String) -> std::io::Result<Action> {
    buf.clear();
    async {
        print!("Enter database to list: ");
        std::io::stdout().flush()?;
        std::io::stdin().read_line(buf)?;
        Ok::<(), std::io::Error>(())
    }
    .await?;
    let database = buf.trim().to_owned();
    Ok(Action::list(database))
}

async fn connect_db(conn_uri: &str) -> mongodb::error::Result<Client> {
    let options = ClientOptions::parse_async(conn_uri).await?;
    Client::with_options(options)
}

mod macros {
    #[macro_export]
    macro_rules! request_base {
        ($txt:expr) => {
            format!(
                "https://randomuser.me/api/?results={}&inc=gender,name,email,login,picture&noinfo",
                $txt
            )
        };
    }
}
