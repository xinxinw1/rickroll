var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var jwtVerify = require('express-jwt');

var bcrypt = require('bcrypt');
const saltRounds = 10;

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

function SetOn(fn, setfn){
  this.arr = []; // map from positions to items
  this.table = {}; // map from ids to positions
  this.fn = fn;
  this.setfn = setfn;
}

SetOn.prototype.contains = function (id){
  return this.table[id] !== undefined;
};

SetOn.prototype.get = function (id){
  if (!this.contains(id))return;
  return this.arr[this.table[id]];
};

SetOn.prototype.getAll = function (){
  return this.arr;
};

SetOn.prototype.add = function (item){
  if (this.contains(this.fn(item)))return;
  this.table[this.fn(item)] = this.arr.length;
  this.arr.push(item);
  return item;
};

SetOn.prototype.update = function (item){
  console.log("remove", item);
  if (!this.contains(this.fn(item)))return;
  return this.arr[this.table[this.fn(item)]] = item;
};

SetOn.prototype.rename = function (oldid, newid){
  console.log("rename", oldid, newid);
  if (!this.contains(oldid) || this.contains(newid))return;
  console.log("past");
  this.setfn(this.arr[this.table[oldid]], newid);
  this.table[newid] = this.table[oldid];
  this.table[oldid] = undefined;
  return this.table[newid];
};

SetOn.prototype.renameAndUpdate = function (oldid, item){
  console.log(this.arr, this.table);
  console.log("renameAndUpdate", oldid, item);
  let newid = this.fn(item);
  if (oldid != newid){
    if (!this.contains(oldid) || this.contains(newid))return;
    this.rename(oldid, newid);
    return this.update(item);
  } else {
    return this.update(item);
  }
};

SetOn.prototype.remove = function (id){
  if (!this.contains(id))return;
  let pos = this.table[id];
  this.table[id] = undefined;
  if (pos == this.arr.length-1){
    return this.arr.pop();
  } else {
    let last = this.arr.pop();
    let orig = this.arr[pos];
    this.arr[pos] = last;
    this.table[this.fn(last)] = pos;
    return orig;
  }
};

let pages = new SetOn(p => p.name, (p, n) => p.name = n);

pages.add({
  name: 'carol-of-the-bells',
  pretend: 'https://www.youtube.com/watch?v=WSUFzC6_fp8',
  redirect: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
});

pages.add({
  name: 'testing',
  pretend: 'https://www.youtube.com/watch?v=WSUFzC6_fp8',
  redirect: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
});

pages.add({
  name: 'ayyyy-lmao',
  pretend: 'https://www.youtube.com/watch?v=WSUFzC6_fp8',
  redirect: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
});

function getPage(name){
  console.log("getting page", name);
  return new Promise((resolve, reject) => {
    let item = pages.get(name);
    console.log("item", item);
    if (item){
      resolve(item);
    } else {
      reject('Not found');
    }
  });
}

function getAll(){
  console.log("getting all pages");
  return new Promise((resolve, reject) => {
    let items = pages.getAll();
    console.log("items", items);
    if (items){
      resolve(items);
    } else {
      reject('Failed');
    }
  });
}

function createPage(name, pretend, redirect){
  console.log("creating page", name);
  return new Promise((resolve, reject) => {
    if (!name || !pretend || !redirect){
      reject('Invalid input');
    } else {
      let token = jwt.sign({
        name: name
      }, app.get('secret'));
      let item = pages.add({
        name: name,
        pretend: pretend,
        redirect: redirect,
        token: token
      });
      console.log("item", item);
      if (item){
        resolve({message: 'Created', token: token});
      } else {
        reject('Already exists');
      }
    }
  });
}

function updatePage(origName, page){
  console.log("updating page", origName, page);
  return new Promise((resolve, reject) => {
    let item = pages.renameAndUpdate(origName, page);
    console.log("item", item);
    if (item){
      resolve('Updated');
    } else {
      reject('Failed to update');
    }
  });
}

function deletePage(name){
  console.log("deleting page", name);
  return new Promise((resolve, reject) => {
    let item = pages.remove(name);
    console.log("item", item);
    if (item){
      resolve('Deleted');
    } else {
      reject('Failed to delete');
    }
  });
}

/* Route for get */

app.get('/api/get/:tag', function (req, res){
  getPage(req.params.tag)
    .then(page => res.json(page))
    .catch(err => {
      res.status(404);
      res.send(err);
    });
});

app.get('/api/getAll', jwtMiddle, function (req, res){
  getAll()
    .then(pages => res.json(pages))
    .catch(err => {
      res.status(500);
      res.send(err);
    });
});

app.use(bodyParser.json());

app.post('/api/create', function (req, res){
  console.log("post to create", req.body);
  createPage(req.body.name, req.body.pretend, req.body.redirect)
    .then(json => res.json(json))
    .catch(err => {
      res.status(409);
      res.send(err);
    });
});

app.post('/api/update', jwtMiddle, function (req, res){
  console.log("post to update", req.body, req.user);
  if (!req.user.name || req.user.name != req.body.origName){
    res.status(401);
    res.send('Invalid token');
    return;
  }
  updatePage(req.body.origName, req.body.page)
    .then(mess => res.send(mess))
    .catch(err => {
      res.status(500);
      res.send(err);
    });
});

app.post('/api/delete', jwtMiddle, function (req, res){
  console.log("post to delete", req.body, req.user);
  if (!req.user.name || req.user.name != req.body.name){
    res.status(401);
    res.send('Invalid token');
    return;
  }
  deletePage(req.body.name)
    .then(mess => res.send(mess))
    .catch(err => {
      res.status(404);
      res.send(err);
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
