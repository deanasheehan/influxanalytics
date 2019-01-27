#!/usr/bin/env node

var fs = require('fs')
var csv = require("fast-csv");
var stream = fs.createReadStream("./input.csv");
var model = require('./state.json')
 
var data = []
const threshold = 2;
var csvStream = csv()
    .on("data", function(row){
         data.push(row)
    })
    .on("end", function(){
        let result = [];
        for (let i = 1; i < data.length; i++) {
            let thisDev = Math.abs(model.median-data[i][1])
            result.push({
                date:data[i][0],
                anomoly:thisDev > (model.mad*threshold)
            })
        }
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: './output.csv',
            header:[{id:'date',title:"Date"},{id:'anomoly',title:"Anomoly"}]
            });
        csvWriter.writeRecords(result)       
            .then(() => {
                console.log('OK');
            });

    });
 
stream.pipe(csvStream);