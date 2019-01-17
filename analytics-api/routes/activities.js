var express = require('express');
var router = express.Router();

let activities = [
]

router.get('/', function(req, res, next) {
  res.json(activities);
});

module.exports = {
  "router": router,
  "addActivity ": function (date,name,action,state) {
    activities.push({date:date,name:name,action,state:state})
  }
}