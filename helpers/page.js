var db = require('./db');
var config = require('../config');

function get(name){
  return db.page.get(name);
}

// returns a promise of a mongoose page object
function create(name, pretend, redirect = config.redirectUrl){
  return db.page.create(name, pretend, redirect);
}

module.exports = {
  get: get,
  create: create
};
