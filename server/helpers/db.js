'use strict';

var config = require('../config');
var mongoose = require('./mongoose');

function connect() {
  return mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name);
}

function disconnect() {
  return mongoose.disconnect();
}

var page = require('../models/page');

module.exports = {
  mongoose: mongoose,
  connect: connect,
  disconnect: disconnect,
  page: page
};
