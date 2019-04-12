
use serde::{Serialize, Deserialize};
use std::sync::{Mutex, Arc};    
use std::ops::Deref;
use std::time::Duration;
use std::thread;

use crate::integrations::{IntegrationDescriptor,IntegrationDescriptors};
    
#[derive(Serialize, Deserialize, Debug, Clone)]
    struct IntegrationMeta {
    name: String,
    tags: Vec<String>,
}

#[derive(Clone)]
struct DockerIntegrationDescriptor {
    imageName: String,
    meta: IntegrationMeta,
}

impl IntegrationDescriptor for DockerIntegrationDescriptor {
    fn name (&self) -> &str {
        &self.imageName
    }

}

pub struct DockerIntegrationDescriptors {
    descriptors: Arc<Mutex<Vec<Box<DockerIntegrationDescriptor>>>>
}

impl IntegrationDescriptors for DockerIntegrationDescriptors {
    fn get_descriptors (&self) -> Vec<Box<dyn IntegrationDescriptor>> {
        let descriptors = Arc::clone(&self.descriptors);
        let r = descriptors.lock().unwrap();
        let mut res : Vec<Box<dyn IntegrationDescriptor>> = Vec::new();
        // iteratate, clone and push TODO
        for i in r.deref() {
            let id:&DockerIntegrationDescriptor = i;
            let id_clone:DockerIntegrationDescriptor = id.clone();
            //et ic:IntegrationDescriptor = id_clone;
            let b: Box<IntegrationDescriptor> = Box::new(id_clone);
            res.push(b);
        }
        res
    }
}

impl DockerIntegrationDescriptors {

    pub fn new () -> DockerIntegrationDescriptors {
        DockerIntegrationDescriptors{descriptors:Arc::new(Mutex::new(Vec::new()))}

    }

    pub fn start (&self) {
        self.populate_initial_integrations();
        self.initiate_integrations_refresh();
    }
    fn populate_initial_integrations (&self) {
        let mut desc = self.descriptors.lock().unwrap();
        desc.clear();
        desc.push(Box::new(DockerIntegrationDescriptor{imageName:String::from("foo"),meta: IntegrationMeta{name:String::from("foo"), tags:vec![]}}));
    }
    fn initiate_integrations_refresh (&self) {
        // connect to event stream in a thread
        // and then as image add/remove appears then add/rmv from the internal vector
        let descriptors = Arc::clone(&self.descriptors);
        thread::spawn(move ||{
            loop {
                {
                    let mut vec = descriptors.lock().unwrap();
                    let did = DockerIntegrationDescriptor{imageName:String::from("foo"),meta: IntegrationMeta{name:String::from("foo"), tags:vec![]}};
                    vec.push(Box::new(did));
                }
                thread::sleep(Duration::from_secs(5))
            }
        });

        // ISSUE here is that leftime of 'self' might be shorter than the liften of thread
    }

    fn is_integration_image (&self, image_name: &str) -> bool {
        true
    }

    fn get_meta_data (&self, container_id: &str) -> IntegrationMeta {
        IntegrationMeta{name:"".to_string(),tags:Vec::new()}
    }
}
