const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('input.csv');
var request = require('request');
var async = require('async')
var dateformat = require('dateformat')



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
    if (error == null) {
        if (response && response.statusCode == 200) {
            let jsonBody = JSON.parse(body);
            let series = jsonBody.results[0].series[0].values
  
            const fs = require('fs');
            let writeStream = fs.createWriteStream('query-output.csv',{flags:'a'});
            series.forEach(item => {
                writeStream.write('\"');
                writeStream.write(dateformat(new Date(item[0]),'isoDate'))
                writeStream.write('\",')
                writeStream.write(""+item[1])
                writeStream.write('\n')
            });
            writeStream.end(()=>{
                const tar = require('tar');
                tar.c({
                    file:'query-output-csv.tar',
                    },
                    ['./query-output.csv'])
                    .then(()=>{
                        console.log('tar created')
                    })

            });
            
            
           
            
        } else {
            console.log('response',response.statusCode)

        }
    } else {
        console.log('error',error)
    }
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
})

var json =  {
				"format" : "csv-file",
				"format-options" : {
					"location" : "./input.csv"
				},
				"fields" : [
					{
						"timestamp":true,
						"epoc":"d",
						"headerLabel":"ds",
						"format":"\"isoDate\""
					},
					{
						"headerLabel":"y"
					}
                ]
            }
    


