'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var config = require('./config');
var page = require('./helpers/page');
var db = require('./helpers/db');

/* Define variables */

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

/* Route for get */

app.post('/api/create', bodyParser.json(), function (req, res){
  console.log("post to create", req.body);
  page.create(req.body.name, req.body.pretend)
    .then(json => {
      console.log("post created", json);
      res.json(json).end();
    })
    .catch(err => {
      console.log("error", err);
      if (err == 'Name already exists'){
        res.status(409).send(err).end();
      } else if (err == 'Invalid input'){
        res.status(400).send(err).end();
      } else {
        res.status(500).send(err).end();
      }
    });
});

/* Route for static pages */

app.use(express.static(__dirname + '/../rickroll-client/dist'));

/* Route for page */

app.get('/:tag', function (req, res, next){
  console.log("getting tag", req.params.tag);
  page.get(req.params.tag)
    .then(page => res.render('page', page))
    .catch(err => next());
});

app.get('/test/:tag', function (req, res, next){
  console.log("getting test tag", req.params.tag);
  page.get(req.params.tag)
    .then(page => {
      if (req.headers['user-agent'].includes('Twitterbot')) {
        res.status(302).header('Location', page.pretend).end();
      } else {
        res.render('page', page);
      }
    })
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
