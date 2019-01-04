var express = require('express');
var router = express.Router();

var dockerUtil = require('../docker-util');
var Promise = require("bluebird");

let instances = [
  {name:"mock1"},
  {name:"mock2"}
]

router.get('/', function(req, res, next) {
  res.json(instances);
});

router.post('/',function(req,res,next){
  console.log('received new instance',req.body)
  instances.push(req.body);
  res.json(req.body)
})

module.exports = router;
