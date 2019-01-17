var express = require('express');
var router = express.Router();
var activities = require('./activities');
const fs = require('fs');
const readline = require('readline');
var request = require('request');
var async = require('async')
var dateformat = require('dateformat')
const tar = require('tar');
const {Docker} = require('node-docker-api');


let instances = [
]

router.get('/', function(req, res, next) {
  res.json(instances);
});

router.post('/',function(req,res,next){
  console.log('received new instance',req.body)
  instances.push(req.body);
  res.json(req.body)
})



/*
Going to need to know verb and input params for that verb
Input query
Params
What to do with result (if it has a result)
All that would come from the body
{
    input: {
        query : {
            db : "",
            text: ""
        },
        params : {
            "days" : ""
        }
    },
    output :
    {
        db : "".
        measurement : ""
    }
}
*/
router.post('/:id/execute',function(req,res,next){
  console.log('execute',req.params.id)

  // record there is an instance executing
  activities["addActivity "](Date.now(),req.params.id ,req.body.action,"Started")

  // query, write the input tar file
  let query = {
    url : "http://localhost:8086/query",
    form : {
        "db":req.body.input.query.db,
        "q" : req.body.input.query.text,
        "epoch":"ms" // WTODO HERE DOES THIS COME FROM?
    }
  }
  request.post(query,(error,response,body)=>{
    if (error == null) {
        if (response && response.statusCode == 200) {
            let jsonBody = JSON.parse(body);
            let series = jsonBody.results[0].series[0].values  
            let writeStream = fs.createWriteStream('query-output.csv',{flags:'a'});
            series.forEach(item => {
                writeStream.write('\"');
                writeStream.write(dateformat(new Date(item[0]),'isoDate'))
                writeStream.write('\",')
                writeStream.write(""+item[1])
                writeStream.write('\n')
            });
            writeStream.end(()=>{
                
                tar.c({
                    file:'query-output-csv.tar',
                    },
                    ['./query-output.csv'])
                    .then(()=>{
                        console.log('tar created')
                        executeAnalysis()
                          .then(()=>uploadForecast(req.body.output.db,req.body.output.measurement))
                          .then(()=>{
                            activities["addActivity "](Date.now(),req.params.id,req.body.action,"Completed")
                          })






                        
                    })

            });
            
            
           
            
        } else {
            console.log('response',response.statusCode)

        }
    } else {
        console.log('error',error)
    }
  })

  // spin up container with input tar

  // wait for container to finish

  // pull results tar

  // send to influx

  // record the instance executing has finished
  

  res.json({})
})

module.exports = router;

function executeAnalysis () {
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });
  let container = null;  
  return docker.container.create({Image: 'fbprophetmock'})
    .then(_container => {container = _container})
    .then(() => container.status())
    .then(status => console.log("pre upload status",status.data.State.Status))
    .then(() => container.fs.put('./query-output-csv.tar', {path: 'root'}))
    .then(() => container.status())
    .then(status => console.log("post upload status",status.data.State.Status))  
    .then(() => container.start())
    .then(() => waitForExit(container))
    .then(() => console.log('container completed'))
    .then(() => container.fs.get({ path: './output.csv' }))
    .then(stream => {
      console.log('creating tar of container output csv')
      const file = fs.createWriteStream("analysis-output-csv.tar");
      stream.pipe(file);
      return promisifyStream(stream);
    })
    .then(() => container.delete())
    .catch(error => console.log('error is',error))
}

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

const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('end', resolve)
  stream.on('error', reject)
});


function uploadForecast (database, measurement) {
  return new Promise((resolve,reject)=>{

    const fs = require('fs');
    const readline = require('readline');
    const fileStream = fs.createReadStream('output.csv');
    var request = require('request');
    var async = require('async')
    
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
  
      var lines = []
      rl.on('line', (line) => {
          //console.log(line)
          var array = line.split(",");
          //array[0] = array[0].substring(1)
          //array[0] = array[0].substring(0,array[0].length-1)
          //array[1] = Number(array[1])
          lines.push(array);
      })
  
      rl.on('close',()=>{
        console.log('close')
            var firstLine = true;
                async.eachSeries(lines,(line,cbk)=>{
                    if (firstLine) {
                        firstLine = false;
                        cbk();
                    } else {
                    //"","ds","trend","additive_terms"=3,"additive_terms_lower=4","additive_terms_upper=5","weekly=6","weekly_lower=7","weekly_upper=8","yearly=9","yearly_lower=10","yearly_upper=11","multiplicative_terms=12","multiplicative_terms_lower=13","multiplicative_terms_upper=14","yhat_lower=15","yhat_upper=16","trend_lower=17","trend_upper=18","yhat=19"
                    var data = measurement + ` trend=${line[2]},additive_terms=${line[3]},additive_terms_lower=${line[4]},additive_terms_upper=${line[5]},weekly=${line[6]},weekly_lower=${line[7]},weekly_upper=${line[8]},yearly=${line[9]},yearly_lower=${line[10]},yearly_upper=${line[11]},multiplicative_terms=${line[12]},multiplicative_terms_lower=${line[13]},multiplicative_terms_upper=${line[14]},yhat_lower=${line[15]},yhat_upper=${line[16]},trend_lower=${line[17]},trend_upper=${line[18]},yhat=${line[19]} ${Date.parse(line[1])}`
                    //console.log(data);
                    //cbk();
                    request.post({url:"http://localhost:8086/write?db="+database+"&precision=ms",body:data},(error,response,body)=>{
                        //console.log('error:', error); // Print the error if one occurred
                        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        //console.log('body:', body); // Print the HTML for the Google homepage.
                        //console.log('writing line',data)
                        cbk()
                    })
                }
        },
        (error)=>{
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
    })





  });
}