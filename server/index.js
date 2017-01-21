'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var jwtVerify = require('express-jwt');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var config = require('./config');
var db = require('./models');

/* Define variables */

app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

var jwtMiddle = jwtVerify({ secret: config.secret });

/* Users */

var users = {};

bcrypt.hash("password", saltRounds)
  .then(function (hash){
    users["secret2008"] = hash;
  });

function getHash(username){
  return new Promise((resolve, reject) => {
    if (!users[username])reject(false);
    else resolve(users[username]);
  });
}
  
function authUser(username, password){
  if (!username || !password)return Promise.reject(false);
  return getHash(username)
    .then(hash => bcrypt.compare(password, hash))
    .then(b => {
      if (b) return Promise.resolve(b);
      return Promise.reject(b);
    });
}



/* Route for get */

app.get('/api/get/:tag', function (req, res){
  db.page.get(req.params.tag)
    .then(page => res.json(page))
    .catch(err => {
      if (err == 'Not found'){
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    });
});

app.get('/api/getAll', jwtMiddle, function (req, res){
  if (!req.user.username){
    return forbidden(res);
  }
  getAll()
    .then(pages => res.json(pages))
    .catch(err => {
      res.status(500).send(err);
    });
});

app.use(bodyParser.json());

app.post('/api/create', function (req, res){
  console.log("post to create", req.body);
  db.page.create(req.body.name, req.body.pretend)
    .then(json => res.json(json))
    .catch(err => {
      if (err == 'Name already exists'){
        res.status(409).send(err);
      } else if (err == 'Invalid input'){
        res.status(400).send(err);
      } else {
        res.status(500).send(err);
      }
    });
});

app.post('/api/update', jwtMiddle, function (req, res){
  console.log("post to update", req.body, req.user);
  if (!req.user.username && (!req.user.name || req.user.name != req.body.origName)){
    return forbidden(res);
  }
  updatePage(req.body.origName, req.body.page)
    .then(mess => res.send(mess))
    .catch(err => {
      if (err == 'New name already exists'){
        res.status(409).send(err);
      } else if (err == 'Invalid input'){
        res.status(400).send(err);
      } else if (err == 'Not found'){
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    });
});

app.post('/api/delete', jwtMiddle, function (req, res){
  console.log("post to delete", req.body, req.user);
  if (!req.user.username && (!req.user.name || req.user.name != req.body.name)){
    return forbidden(res);
  }
  deletePage(req.body.name)
    .then(mess => res.send(mess))
    .catch(err => {
      if (err == 'Not found'){
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    });
});

app.post('/api/auth', function (req, res){
  console.log("auth", req.body);
  authUser(req.body.username, req.body.password)
    .then(bool => res.json({
        token: jwt.sign({
          username: req.body.username
        }, config.secret, { expiresIn: 60 * 2 })
      }))
    .catch(err => {
      res.status(401);
      res.send('Invalid username or password');
    });
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  }
});

function forbidden(res){
  res.status(403).send('You are not allowed to do that!');
}

/* Route for static pages */

app.use(express.static(__dirname + '/../dist/client'));

/* Route for page */

app.get('/:tag', function (req, res, next){
  console.log("getting tag", req.params.tag);
  db.page.get(req.params.tag)
    .then(page => res.render('page', page))
    .catch(err => next());
});

/* Listen on port or export app */

if (require.main === module){
  app.listen(config.port, config.hostname, function () {
    console.log('Listening on port ' + config.port + '!');
  });
} else {
  module.exports = app;
}
