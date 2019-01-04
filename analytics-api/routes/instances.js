var express = require('express');
var router = express.Router();

var dockerUtil = require('../docker-util');
var Promise = require("bluebird");

let instances = []

router.get('/', function(req, res, next) {
  res.json(instances);
});

router.post('/:instanceName',function(req,res,next){
  console.log('received new instance',req.body)
  instances.push(req.body);
})

module.exports = router;
