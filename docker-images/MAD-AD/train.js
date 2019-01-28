#!/usr/bin/env node

var fs = require('fs')
var csv = require("fast-csv");
var median = require('median')
var stream = fs.createReadStream("./input.csv");
 
var data = []
let dev = []
var csvStream = csv()
    .on("data", function(row){
         data.push(row[1])
    })
    .on("end", function(){
        let dataSorted = data.slice(0, data.length);
        dataSorted.sort((a,b) => a-b)
        
        let m = median(dataSorted);
        
        for (index = 0; index < data.length; index++) {
            dev.push(Math.abs(m-data[index]))
        }
        let devSorted = dev.slice(0, dev.length);
        devSorted.sort((a,b) => a-b)
        
        let mad = 1.4826 * median(devSorted)
        
        var model = {
            median:m,
            mad:mad
        }

        console.log('state is',model,m,mad)

        fs.writeFile('state.json', JSON.stringify(model), 'utf8', ()=>{
            console.log('OK')
        });
    });
 
stream.pipe(csvStream);