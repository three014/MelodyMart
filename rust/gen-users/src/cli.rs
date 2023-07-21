use clap::{Args, Parser};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{BufRead, Read};

#[derive(Debug)]
pub struct GenUsersCli {
    conn_uri: String,
}

#[derive(Debug, Parser)]
#[command(name = "gen-users", version = "0.1.0", author = "Group One")]
struct ArgsInner {
    #[command(flatten)]
    manual_spec: Option<ManualSpec>,

    /// Path to a .json file containing the user connection info
    #[arg(short = 'j', long, exclusive = true)]
    json_file: Option<String>,

    /// Path to a .env file containing the entire mongodb uri
    #[arg(short = 'e', long, exclusive = true)]
    env_file: Option<String>,
}

#[derive(Args, Debug, Deserialize, Serialize)]
#[group(required = false, multiple = true)]
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
    pub fn parse() -> Result<GenUsersCli, Box<dyn std::error::Error>> {
        const MAX_BUF: usize = 256;
        let inner = ArgsInner::parse();
        let cli = match (inner.json_file, inner.env_file, inner.manual_spec) {
            (Some(json_path), None, None) => {
                let user_file = File::open(json_path)?;
                let br =
                    std::io::BufReader::with_capacity(MAX_BUF, user_file).take(MAX_BUF as u64 * 12);
                let buf = std::io::read_to_string(br)?;
                let spec: ManualSpec = serde_json::from_str(&buf)?;
                GenUsersCli {
                    conn_uri: spec.to_string(),
                }
            }
            (None, Some(env_path), None) => {
                let user_file = File::open(env_path)?;
                let mut buf = String::with_capacity(MAX_BUF);
                let mut br =
                    std::io::BufReader::with_capacity(MAX_BUF, user_file).take(MAX_BUF as u64 * 12);
                let mut line = 0;
                loop {
                    buf.clear();
                    br.read_line(&mut buf)?;
                    line += 1;
                    let buf = buf.trim();
                    if buf.starts_with('#') {
                        continue;
                    }

                    if let Some((key, val)) = buf.split_once('=') {
                        if key == "MONGO_URL" {
                            break GenUsersCli {
                                conn_uri: val.trim_matches('\"').to_owned(),
                            };
                        }
                    } else {
                        if !buf.is_empty() {
                            return Err(format!(
                                "Line {line} does not contain a key=value pair: \n  {}.",
                                buf
                            )
                            .into());
                        } else {
                            return Err("Could not find key \"MONGO_URL\" in .env file".into());
                        }
                    }
                }
            }
            (None, None, Some(spec)) => GenUsersCli {
                conn_uri: spec.to_string(),
            },
            _ => unreachable!("At least one of the three options should be Some"),
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
