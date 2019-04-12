use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct IntegrationMeta {
    name: String,
    tags: Vec<String>,
}

fn main() -> Result<(), Box<std::error::Error>> {
    let point = Point { x: 1, y: 2 };

    // Convert the Point to a JSON string.
    let serialized = serde_json::to_string(&point).unwrap();

    // Prints serialized = {"x":1,"y":2}
    println!("serialized = {}", serialized);

    // Convert the JSON string back to a Point.
    let deserialized: Point = serde_json::from_str(&serialized).unwrap();

    // Prints deserialized = Point { x: 1, y: 2 }
    println!("deserialized = {:?}", deserialized);

    // now to yaml and back
    let yaml_serialized = serde_yaml::to_string(&point).unwrap();

    // Prints serialized = {"x":1,"y":2}
    println!("yaml = {}", yaml_serialized);

    // now the file
    let f = std::fs::File::open("./some-test.yaml")?;
    let d :serde_yaml::Value = serde_yaml::from_reader(f)?;
    println!("Read YAML value: {:?}", d);
    
    // now to an object
    let f2 = std::fs::File::open("./some-test.yaml")?;
    let d2 :IntegrationMeta = serde_yaml::from_reader(f2)?;
    println!("Read YAML object: {:?}", d2);
    
    Ok(())
}