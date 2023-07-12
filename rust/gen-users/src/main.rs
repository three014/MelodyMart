#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

use gen_users::{GenUsersCli, landing};
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let args = GenUsersCli::parse()?;
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .worker_threads(2)
        .build()?;

    Ok(rt.block_on(landing(args))?)
}
