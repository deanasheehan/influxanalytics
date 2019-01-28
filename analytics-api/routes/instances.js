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
var tarfs = require('tar-fs')


let instances = [
]

function getInstanceGivenName (name) {
    console.log('looking for instance',name)
    let result = null;
    instances.forEach(item =>{
        if (item.instanceName == name) {
            console.log('found it at',item)
            result = item
        } else {
            console.log('didnt find it at',item)
        }
    })
    return result;
}

router.get('/', function(req, res, next) {
  res.json(instances);
});

router.post('/',function(req,res,next){
  console.log('received new instance',req.body)


    if (req.body.catalog.initialState) {
        req.body.state = req.body.catalog.initialState
    } else {
        req.body.state = 'Ready';
    }


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
            console.log('series',series)

            // nast non-generic hack 
            let fileName = "query-output.csv";
            if (req.body.action == 'Train Detector') {
                fileName = 'input.csv'
            }

            let writeStream = fs.createWriteStream(fileName,{flags:'a'});
            if (req.body.action == 'Train Detector') {
                writeStream.write("Date,Value\n")
            }
            series.forEach(item => {
                 if (req.body.action == 'Train Detector') {
                    writeStream.write(Number(item[0]).toString())
                } else {
                    writeStream.write('\"');
                    writeStream.write(dateformat(new Date(item[0]),'isoDate'))
                    writeStream.write('\"')
                }
                writeStream.write(","+item[1])
                writeStream.write('\n')
            });
            writeStream.end(()=>{
                let tarFileName = "query-output-csv.tar";
                if (req.body.action == 'Train Detector') {
                    tarFileName = 'input-csv.tar'
                }
                tar.c({
                    file:tarFileName, // 'query-output-csv.tar',
                    },
                    ['./'+fileName])
                    .then(()=>{
                        console.log('tar created')
                        executeAnalysis(req.params.id,req.body)
                          .then(()=>{
                            if (req.body.action == 'Train Detector') {
                                return captureState(req.params.id)
                            } else {
                                return uploadForecast(req.body.output.db,req.body.output.measurement)
                            }
                          })
                          .then(()=>{
                              setCompletedState(req.params.id,req.body.action)
                          })
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

  res.json({})
})

module.exports = router;


function captureState (id) {
    let instance = getInstanceGivenName(id);
    // read in state obj and attached to this instance
    var contents = fs.readFileSync("state.json");
    var jsonContent = JSON.parse(contents);
    instance.state = jsonContent;
}

function setCompletedState (instanceName, actionName) {
    let instance = getInstanceGivenName(instanceName);
    for (index = 0; index < instance.catalog.actions.length; index++) {
        if (instance.catalog.actions[index].name == actionName) {
            instance.state = instance.catalog.actions[index].successState;
        }
    }
}

function executeAnalysis (instanceName,body) {

    let instance = getInstanceGivenName(instanceName);
    console.log('instance',instance)

  const docker = new Docker({ socketPath: '/var/run/docker.sock' });
  let container = null;  
  return docker.container.create({Image: instance.catalog.imageName}) // 'fbprophetmock'})
    .then(_container => {container = _container})
    .then(() => container.status())
    .then(status => console.log("pre upload status",status.data.State.Status))
    .then(()=>{
        if (body.action == 'Train Detector') {
            console.log('loading up input-csv.tar')
            return container.fs.put('./input-csv.tar', {path: '/'})
        } else {
            console.log('loading up query-output-csv.tar')
            return container.fs.put('./query-output-csv.tar', {path: 'root'})
        }    
    })
    .then(() => container.status())
    .then(status => console.log("post upload status",status.data.State.Status))  
    .then(() => container.start())
    .then(() => waitForExit(container))
    .then(() => console.log('container completed'))
    .then(()=>{
        if (body.action == 'Train Detector') {
             console.log('about to get state.json from container')
            return container.fs.get({ path: './state.json' })
            .then(stream => {
                console.log('creating tar of container state-json.tar')
                const file = fs.createWriteStream("state-json.tar");
                stream.pipe(file);
                return promisifyStream(stream);
            })
            .then(()=>{
                console.log('state-json.tar stream completed')
                var stream2 = fs.createReadStream('state-json.tar')
                stream2.pipe(tarfs.extract('./'));
                console.log('created stream and returning promise on it')
                return promisifyStream(stream2);
            })
            .then(()=>{
                console.log('the fs steam finished')
            })
            .then(() => container.delete())
            .catch(error => console.log('error is',error))
        } else {
            console.log('about to get output.csv from container')
            return container.fs.get({ path: './output.csv' })
            .then(stream => {
                console.log('creating tar of container output csv')
                const file = fs.createWriteStream("analysis-output-csv.tar");
                stream.pipe(file);
                return promisifyStream(stream);
            })
            .then(()=>{
                console.log('analysis-output-csv.tar stream completed')
            })
            .then(() => tar.x({file:'./analysis-output-csv.tar'}))
            .then(()=>{
                var contents = fs.readFileSync("output.csv");
                console.log('have opened analysis output.csv')
            })
            .then(() => container.delete())
            .catch(error => console.log('error is',error))
        }
    })
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
  stream.on('error',reject)
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

