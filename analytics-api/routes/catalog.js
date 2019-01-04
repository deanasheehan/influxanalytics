var express = require('express');
var router = express.Router();

var dockerUtil = require('../docker-util');
var Promise = require("bluebird");

let catalogImages = [
  'testimage'
]

Promise.each(catalogImages,image=>dockerUtil.getInfluxAnalyticsMetadata(image).then(metadata=>{console.log('meta data',metadata)}))
  
  .catch(error=>{console.log('error',error)})


router.get('/', function(req, res, next) {
  catalog = [
    {name:"FBProphet",tags:["ML","Forecasting","Lang=R"]},
    {name:"MAD",tags:["ML","Anomoly Detection","Lang=Python"]},
  ]
  res.json(catalog);
});

module.exports = router;
