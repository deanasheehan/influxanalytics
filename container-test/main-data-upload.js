const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('input.csv');
var request = require('request');
var async = require('async')


const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });


var lines = []
rl.on('line', (line) => {
    var array = line.split(",");
    array[0] = array[0].substring(1)
    array[0] = array[0].substring(0,array[0].length-1)
    array[1] = Number(array[1])
    lines.push(array);
})

rl.on('close',()=>{
        //var data = `data value=${line[1]} ${Date.parse(line[0])}`
        async.eachSeries(lines,(line,cbk)=>{
            var data = `data value=${line[1]} ${Date.parse(line[0])}`
            request.post({url:"http://localhost:8086/write?db=analytics&precision=ms",body:data},(error,response,body)=>{
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                console.log('writing line',data)
                cbk()
            })
        
        })
})



