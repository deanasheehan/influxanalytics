const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('training-set.csv');
var request = require('request');
var async = require('async')


const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });


var lines = []
rl.on('line', (line) => {
    console.log(line)
    var array = line.split(",");
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
                var data = `activity value=${line[1]} ${line[0]}`
                request.post({url:"http://localhost:8086/write?db=analytics&precision=ms",body:data},(error,response,body)=>{
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    console.log('body:', body); // Print the HTML for the Google homepage.
                    console.log('writing line',data)
                    cbk()
                })
            }
    })
})


/*

Next steps:


0 - wire it up so that in 'Execute FOrecaste' I run hardwired query, collect results and push to Influx!

1 - UI Capture input query AND 'days' against action to run against Influx
2 - UI Capture output destination: database, measurement, output schema field by field mapping? Additional tags?
3 - On Execute, query data, spin up container, write data to container, wait for container to finish, read data and write data back to influx

4 - Move 'Days' to the Action, rather than Config, and give it a default value.

5 - Record Forecast Generating/Forecast Generated Activity.

*/



