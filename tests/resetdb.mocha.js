var config = require('../config');
var fixturesModule = require('pow-mongodb-fixtures')
var db = require('../helpers/db');

var data = require('./testdb');

function connect(){
  return fixturesModule.connect(config.db.name);
}

function resetdb(fixtures){
  return new Promise((resolve, reject) => {
    fixtures.clearAndLoad(data, err => {
      if (err) return reject(err);
      resolve(true);
    });
  })
}

function disconnect(fixtures){
  return new Promise((resolve, reject) => {
    fixtures.close(err => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

if (global.beforeEach){
  beforeEach(() => {
    let fixtures = connect();
    return resetdb(fixtures)
      .then(() => disconnect(fixtures))
      .then(db.connect);
  });
  afterEach(() => {
    return db.disconnect();
  });
}

module.exports = resetdb;
