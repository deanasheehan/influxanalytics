let signal = 515
let noise = 10

let date = Date.now()
let data = []
for (index = 0; index < 10; index++) {
    data.push({date:date+index,value:signal + Math.random()*noise})
}
data.push({date:date+index,value:signal + noise*2})

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './detection-set.csv',
    header:[{id:'date',title:"Date"},{id:'value',title:"Value"}]
});
 
console.log(data)
csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
        console.log('...Done');
    });