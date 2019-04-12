
pub trait IntegrationExecutor {
    fn streamToFs (&self); // this should take a map of named input streams
        // input: stream
        // state : stream
    fn execute (&self);
    fn streamFromFs (&self); // this should return a map of named output streams
        // output: stream
        // state: stream
    fn dispose (&self); // Is this an Automation when it goes out of scope?
}

pub trait IntegrationDescriptor {
    fn name(&self) -> &str;
    /*fn toJson (&self) -> &str;
    fn newExecutor (&self) -> Box<dyn IntegrationExecutor>;*/
}

pub trait IntegrationDescriptors {
    fn get_descriptors (&self) -> Vec<Box<dyn IntegrationDescriptor>>;
}

