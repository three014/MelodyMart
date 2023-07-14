use clap::{Args, Parser};
use serde::{Deserialize, Serialize};
use std::fs::File;

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

#[cfg(test)]
mod test {
    use super::ArgsInner;
    use clap::CommandFactory;

    #[test]
    fn cli_works() {
        ArgsInner::command().debug_assert();
    }
}
