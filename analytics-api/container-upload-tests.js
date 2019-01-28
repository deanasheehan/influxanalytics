const {Docker} = require('node-docker-api');
const fs = require('fs');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
let container;

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
  });
  


docker.container.create({
    Image: 'ubuntu',
    Cmd: [ '/bin/bash', '-c', 'cat input.csv' ],
    name: 'test'
  })
    .then(_container => {container = _container})
    .then(()=>container.fs.put('./input-csv.tar',{path:'/'})) // , {path: 'root'}
    .then(stream =>{
        console.log('stream',stream)
        return stream;
    })
    .then(stream => promisifyStream(stream))
    .then(() => container.start())
    //.then(() => container.status())
    //.then(container => container.stop())
    .catch(error => console.log(error));