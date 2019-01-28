var readline = require('readline');
var request = require('request')


let spike = false;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    console.log('generating activity spike');
    spike = true
})

const signal = 515
const noise = 10

setInterval(()=>{
    let value = 0;
    if (spike) {
        spike = false;
        console.log('sending activity spike');
        value = signal + noise*2;
    } else {
        console.log('sending activity regular');
        value = signal + Math.random()*noise;
    }
    let date = Date.now()
    var data = `activity value=${value} ${date}`
    console.log('line is',data)
    request.post({url:"http://localhost:8086/write?db=analytics&precision=ms",body:data},(error,response,body)=>{
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        //console.log('writing line',data)
    })



},1000)
