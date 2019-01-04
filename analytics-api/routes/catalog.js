var express = require('express');
var router = express.Router();

var dockerUtil = require('../docker-util');
var Promise = require("bluebird");

let catalogImages = [
  'testimage',
  'testimage2',
  'testimage3'
]

let catalog = []

catalogImages.forEach(element => {
  dockerUtil.getInfluxAnalyticsMetadata(element)
    .then(metadata=>{
      metadata.imageName = element;
      console.log(metadata)
      catalog.push(metadata)
    })
    .catch(error=>{console.log('Unable to obtained meta data for image',element)}) 
});

router.get('/', function(req, res, next) {
  res.json(catalog);
});

module.exports = router;
