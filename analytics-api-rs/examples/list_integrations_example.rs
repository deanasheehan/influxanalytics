use std::time::Duration;
use std::thread;
mod docker_integrations;

fn main () {
    let di = docker_integrations::DockerIntegrationDescriptors::new();
    di.start();
    loop {
        for desc in di.get_descriptors() {
            println!("integration {}",desc.name())
        }
        thread::sleep(Duration::from_secs(10))
    }
}
