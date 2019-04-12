use shiplift::{ContainerOptions, Docker};
use tokio::prelude::{Future, Stream};
use std::collections::HashMap;
use std::{env, path};

fn main () {
    let docker = Docker::new();
    let image = "fbprophetmock";

    let fut = docker
        .containers()
        .create(&ContainerOptions::builder(image.as_ref()).build())
        .and_then(move|info| {
            println!("container id {}",info.id);
            docker.containers()
                .get(&info.id)
                .copy_from(path::Path::new("./influx-integration.yaml"))
                .collect()
                .and_then(|stream| {
                    let tar = stream.concat();
                    let mut archive = tar::Archive::new(tar.as_slice());
                    archive.unpack(env::current_dir()?)?;
                    Ok(())
                })
                .and_then(move |_|{
                    docker.containers()
                    .get(&info.id)
                    .delete()
                })
        })
        .map_err(|e| eprintln!("Error: {}", e));
        
    tokio::run(fut);
}