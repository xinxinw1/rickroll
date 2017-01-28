var db = require('./db');
var config = require('../config');
var validator = require('validator');
var getMetadata = require('./get-data').getMetadata;
const normalizeUrl = require('normalize-url');

function get(name){
  return db.page.get(name);
}

// returns a promise of a mongoose page object
function create(name, pretend, redirect = config.redirectUrl){
  if (!(typeof name === 'string') || name === '') {
    return Promise.reject({message: 'Invalid name'});
  }
  if (!(typeof pretend === 'string') || 
      !validator.isURL(pretend)){
    return Promise.reject({message: 'Invalid pretend address'});
  }
  if (!(typeof redirect === 'string') ||
      !validator.isURL(redirect)){
    return Promise.reject({message: 'Invalid redirect address'});
  }
  pretend = normalizeUrl(pretend);
  redirect = normalizeUrl(redirect);
  return getMetadata(pretend).then(metadata => {
    console.log('metadata', metadata);
    return db.page.create(name, pretend, redirect, metadata);
  });
}

module.exports = {
  get: get,
  create: create
};
