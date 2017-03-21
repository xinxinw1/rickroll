'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('validator');
var config = require('./config');
var page = require('./helpers/page');
var db = require('./models');

/* Define variables */

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

/* Route for get */

app.post('/api/create', bodyParser.json(), function (req, res){
  console.log("post to create", req.body);
  
  var name = req.body.name;
  var pretend = req.body.pretend;
  
  if (!(typeof name === 'string') || name === '') {
    res.status(400).json({error: 'Invalid name'}).end();
    return;
  }
  if (!(typeof pretend === 'string') || 
      !validator.isURL(pretend)){
    res.status(400).json({error: 'Invalid pretend address'}).end();
    return;
  }
  
  page.create(name, pretend)
    .then(json => {
      console.log('post created', name);
      res.json({message: 'Success'}).end();
    })
    .catch(err => {
      // err must be an Error object
      if (err.message == 'Name already exists'){
        res.status(409).json({error: err.message}).end();
      } else {
        console.log('page create error', err);
        res.status(500).json({error: err.message}).end();
      }
    });
});

/* Route for static pages */

app.use(express.static(__dirname + '/../rickroll-client/src'));

/* Route for page */

app.get('/:tag', function (req, res, next){
  console.log("getting tag", req.params.tag);
  page.get(req.params.tag)
    .then(page => res.render('page', page))
    .catch(err => next());
});

/* Listen on port or export app */

if (config.env !== 'testing') {
  db.connect().then(_ => {
    app.listen(config.port, config.hostname, function () {
      console.log('Listening on port ' + config.port + '!');
    });
  });
}

module.exports = app;
