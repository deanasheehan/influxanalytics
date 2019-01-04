const fs = require('fs');
const {Docker} = require('node-docker-api');
var tar = require('tar-stream')
 
const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('end', resolve)
  stream.on('error', reject)
});

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

exports.getInfluxAnalyticsMetadata = function (imageName) {
  let container;
  let result = null;
  return docker.container.create({Image: imageName})
    .then(_container => {
      container = _container
      return container.fs.get({ path: '/influx-analytics-meta.json' })
      })
    .then(stream => {
      var extract = tar.extract()
        extract.on('entry', function(header, stream, next) {
            if (header.name != "influx-analytics-meta.json") {
            console.log('error, not the file I thought')
          }
          let string = '';
          stream
            .on('data', (buf) => string += buf.toString())
            .on('end', () => result = JSON.parse(string));
          stream.on('end', function() {
            next() // ready for next entry
          })
        })
        extract.on('finish', function() {
          // all entries read
        })
      stream.pipe(extract)
      return promisifyStream(stream);
    })
    .then(() => container.delete({ force: true }))
    .then(()=>{return result})
  };





  
  