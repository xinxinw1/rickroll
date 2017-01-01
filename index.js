var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var jwtVerify = require('express-jwt');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/rickroll';

var co = require('co');

/* Define variables */

app.set('port', process.env.PORT || 8080);
app.set('hostname', process.env.HOSTNAME || undefined);
app.set('views', __dirname + '/views')
app.set('view engine', 'pug');
app.set('secret', process.env.SECRET || 'a secret');

var jwtMiddle = jwtVerify({ secret: app.get('secret') });

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

/* Data */

function getPage(name){
  console.log("getting page", name);
  return new Promise((resolve, reject) => {
    co(function *() {
      var db = yield MongoClient.connect(dbUrl);
      var res = yield db.collection('pages').findOne({name: name}, {_id: 0, token: 0});
      db.close();
      return res;
    }).then(res => {
      console.log('found page', res);
      if (res)resolve({
        name: res.name,
        pretend: res.pretend,
        redirect: res.redirect
      });
      else reject('Not found');
    }).catch(function (err){
      console.log(err);
      reject('DB Error');
    });
  });
}

function getAll(){
  console.log("getting all pages");
  return new Promise((resolve, reject) => {
    co(function *() {
      var db = yield MongoClient.connect(dbUrl);
      var res = yield db.collection('pages').find({}, {_id: 0}).toArray();
      db.close();
      return res;
    }).then(res => {
      console.log('found pages', res);
      resolve(res);
    }).catch(function (err){
      console.log(err);
      reject('DB Error');
    });
  });
}

function createPage(name, pretend, redirect){
  console.log("creating page", name);
  return new Promise((resolve, reject) => {
    if (!name || !pretend || !redirect){
      return reject('Invalid input');
    }
    let token = jwt.sign({
      name: name
    }, app.get('secret'));
    let item = {
      name: name,
      pretend: pretend,
      redirect: redirect
    };
    co(function *() {
      var db = yield MongoClient.connect(dbUrl);
      var res = yield db.collection('pages').insertOne(item);
      db.close();
      return res;
    }).then(res => {
      console.log('created page', res);
      resolve({message: 'Created', token: token});
    }).catch(function (err){
      console.log(err);
      if (err.code && err.code == 11000){
        reject('Name already exists');
      } else {
        reject('DB Error');
      }
    });
  });
}

function updatePage(origName, page){
  console.log("updating page", origName, page);
  return new Promise((resolve, reject) => {
    let name = page.name;
    let pretend = page.pretend;
    let redirect = page.redirect;
    if (!name || !pretend || !redirect){
      return reject('Invalid input');
    }
    let token = jwt.sign({
      name: name
    }, app.get('secret'));
    let item = {
      name: name,
      pretend: pretend,
      redirect: redirect
    };
    co(function *() {
      var db = yield MongoClient.connect(dbUrl);
      var res = yield db.collection('pages').findOneAndReplace({name: origName}, item);
      db.close();
      return res;
    }).then(res => {
      console.log('updated page', res);
      if (res.value)resolve({message: 'Updated', token: token});
      else reject('Not found');
    }).catch(function (err){
      console.log(err);
      if (err.code && err.code == 11000){
        reject('New name already exists');
      } else {
        reject('DB Error');
      }
    });
  });
}

function deletePage(name){
  console.log("deleting page", name);
  return new Promise((resolve, reject) => {
    co(function *() {
      var db = yield MongoClient.connect(dbUrl);
      var res = yield db.collection('pages').findOneAndDelete({name: name});
      db.close();
      return res;
    }).then(res => {
      console.log('deleted page', res);
      if (res.value)resolve('Deleted');
      else reject('Not found');
    }).catch(function (err){
      console.log(err);
      reject('DB Error');
    });
  });
}

/* Route for get */

app.get('/api/get/:tag', function (req, res){
  getPage(req.params.tag)
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
  createPage(req.body.name, req.body.pretend, req.body.redirect)
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
        }, app.get('secret'), { expiresIn: 60 * 2 })
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

app.use(express.static(__dirname + '/dist/client'));

/* Route for page */

app.get('/:tag', function (req, res, next){
  console.log("getting tag", req.params.tag);
  getPage(req.params.tag)
    .then(page => res.render('page', page))
    .catch(err => next());
});

/* Listen on port or export app */

if (require.main === module){
  app.listen(app.get('port'), app.get('hostname'), function () {
    console.log('Listening on port ' + app.get('port') + '!');
  });
} else {
  module.exports = app;
}
