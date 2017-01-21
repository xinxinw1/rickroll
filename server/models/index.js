'use strict';

var config = require('../config');
var db = module.exports = {};

var mongoose = require('./mongoose');

db.mongoose = mongoose;

function connect() {
  return mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name);
}

db.connect = connect;

function disconnect() {
  return mongoose.disconnect();
}

db.disconnect = disconnect;

db.page = require('./page');
