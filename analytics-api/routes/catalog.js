var express = require('express');
var router = express.Router();

var dockerUtil = require('../docker-util');
var Promise = require("bluebird");

let catalogImages = [
  'testimage',
  'testimage2',
  'testimage3',
  'fbprophetmock'
]

let catalog = []

catalogImages.forEach(element => {
  dockerUtil.getInfluxAnalyticsMetadata(element)
    .then(metadata=>{
      metadata.imageName = element;
      console.log(metadata)
      catalog.push(metadata)
    })
    .then(()=>{
      catalog.sort((a,b)=>{return a.name > b.name})
    })
    .catch(error=>{console.log('Unable to obtained meta data for image',element)}) 
});

router.get('/', function(req, res, next) {
  res.json(catalog);
});

router.post('/:name',(req,res)=>{
  dockerUtil.getInfluxAnalyticsMetadata(req.params.name)
    .then(metadata=>{
      metadata.imageName = req.params.name;
      console.log(metadata)
      catalog.push(metadata)
    })
    .then(()=>{
      catalog.sort((a,b)=>{return a.name > b.name})
      res.json({})
    })
    .catch(error=>{
      console.log(error);
      res.json({});
    }) 

})

module.exports = router;
