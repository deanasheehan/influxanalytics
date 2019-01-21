
var median = require('median')
let signal = 515
let data = []
let dev = []
let noise = 10
let newData = []

for (index = 0; index < 1000; index++) {
    newData.push(signal + Math.random()*noise*3)
    data.push(signal + Math.random()*noise)
}
let dataSorted = data.slice(0, data.length);
dataSorted.sort((a,b) => a-b)

let m = median(dataSorted);

for (index = 0; index < data.length; index++) {
    dev.push(Math.abs(m-data[index]))
}
let devSorted = dev.slice(0, dev.length);
devSorted.sort((a,b) => a-b)

for (index = 0; index < data.length; index++) {
    console.log(data[index],dev[index])
}

let mad = 1.4826 * median(devSorted)
console.log('median is',m)
console.log('mad',mad)

for (index = 0; index < data.length; index++) {
    let thisDev = Math.abs(m-data[index])
    if (thisDev > 2*mad) {
        console.log('outlier',index,data[index],thisDev)
    }
}



