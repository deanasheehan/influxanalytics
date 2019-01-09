const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('input.csv');
var request = require('request');
var async = require('async')



// now query that data
let query = {
    url : "http://localhost:8086/query",
    form : {
        "db":"analytics",
        "q" : `SELECT "value" FROM "analytics"."autogen"."data"`,
        "epoch":"ms"
    }
}
request.post(query,(error,response,body)=>{
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.

})
    


