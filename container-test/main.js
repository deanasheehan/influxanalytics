
const fs = require('fs');
const {Docker} = require('node-docker-api');
 
const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('end', resolve)
  stream.on('error', reject)
});

const waitForExit = theContainer => new Promise((resolve,reject) => {
    const intervalObj = setInterval(
        ()=>{
            theContainer.status()
                .then(status=>{
                    console.log('status is',status.data.State.Status)
                    if (status.data.State.Status == 'exited') {
                        clearInterval(intervalObj);
                        resolve()
                    } else if (status.data.State.Status != 'running') {
                        clearInterval(intervalObj);
                        reject()
                    }
                })
        }
        ,1000)
})
 
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
let container;
 
docker.container.create({Image: 'fbprophetmock'})
  .then(_container => {container = _container})
  .then(() => container.status())
  .then(status => console.log("pre upload status",status.data.State.Status))
  .then(() => container.fs.put('./query-output-csv.tar', {path: 'root'}))
  .then(() => container.status())
  .then(status => console.log("post upload status",status.data.State.Status))  
  .then(() => container.start())
  .then(() => waitForExit(container))
  .then(() => container.fs.get({ path: './output.csv' }))
  .then(stream => {
    const file = fs.createWriteStream("analysis-output-csv.tar");
    stream.pipe(file);
    return promisifyStream(stream);
  })
  .then(() => container.delete())
  .catch(error => console.log('error is',error))


