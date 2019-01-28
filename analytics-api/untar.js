/*


const tar = require('tar');
var fs = require('fs')
tar.x({file:'state-json.tar'})
.then(()=>{
    var contents = fs.readFileSync("state.json");
    var jsonContent = JSON.parse(contents);
    console.log(jsonContent)
})

*/


var tarFile = 'state-json.tar';
var target = './';

// extracting a directory
var fs = require('fs')
var tarfs = require('tar-fs')
fs.createReadStream(tarFile).pipe(tarfs.extract(target));
