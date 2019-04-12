mod integrations;
mod docker_integrations;

use std::time::Duration;
use std::thread;
use crate::integrations::IntegrationDescriptors;
use crate::docker_integrations::DockerIntegrationDescriptors;

fn main () {
    let di = DockerIntegrationDescriptors::new();
    di.start();
    loop {
        println!("loop");
        for desc in di.get_descriptors() {
            println!("integration {}",desc.name())
        }
        thread::sleep(Duration::from_secs(5))
    }
}