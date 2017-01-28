'use strict';

var config = require('../config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function connect() {
  return mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name);
}

function disconnect() {
  return mongoose.disconnect();
}

var Page = require('../models/page')(mongoose);

module.exports = {
  mongoose: mongoose,
  connect: connect,
  disconnect: disconnect,
  Page: Page
};
