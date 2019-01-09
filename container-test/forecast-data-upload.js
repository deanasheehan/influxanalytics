const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('forecast-data.csv');
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
                var data = `forecast trend=${line[2]},additive_terms=${line[3]},additive_terms_lower=${line[4]},additive_terms_upper=${line[5]},weekly=${line[6]},weekly_lower=${line[7]},weekly_upper=${line[8]},yearly=${line[9]},yearly_lower=${line[10]},yearly_upper=${line[11]},multiplicative_terms=${line[12]},multiplicative_terms_lower=${line[13]},multiplicative_terms_upper=${line[14]},yhat_lower=${line[15]},yhat_upper=${line[16]},trend_lower=${line[17]},trend_upper=${line[18]},yhat=${line[19]} ${Date.parse(line[1])}`
                //console.log(data);
                //cbk();
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

1 - UI Capture input query to run against Influx
2 - UI Capture output destination: database, measurement, output schema field by field mapping? Additional tags?
3 - On Execute, query data, spin up container, write data to container, wait for container to finish, read data and write data back to influx

4 - Move 'Days' to the Action, rather than Config, and give it a default value.

5 - Record Forecast Generating/Forecast Generated Activity.

*/



