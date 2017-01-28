var db = require('../models');
var config = require('../config');
var getMetadata = require('./get-data').getMetadata;
var normalizeUrl = require('normalize-url');

// returns a promise of a mongoose page object
function get(name){
  //console.log('getting page', name);
  return db.Page.findOne({name: name})
    .catch(err => {
      console.log('get page error', err);
      throw new Error('DB Error');
    })
    .then(res => {
      if (res) {
        //console.log('found page', res);
        return res;
      } else {
        //console.log('not found', res);
        throw new Error('Not found');
      }
    });
}

// returns a promise of a mongoose page object
function create(name, pretend, redirect = config.redirectUrl){
  //console.log('creating page', name, pretend, redirect);
  pretend = normalizeUrl(pretend);
  redirect = normalizeUrl(redirect);
  return getMetadata(pretend)
    .then(metadata => {
    //console.log('got metadata for', name);
    return save(new db.Page({
      name: name,
      pretend: pretend,
      redirect: redirect,
      metadata: metadata
    }));
  });
}

// page is a mongoose object
// returns a promise of a mongoose page object
function save(page){
  //console.log('saving page', page);
  return page.save()
    .catch(err => {
      if (err.code && err.code == 11000){
        throw new Error('Name already exists');
      } else {
        console.log('save page error', err);
        throw new Error('DB Error');
      }
    })
    .then(res => {
      //console.log('saved page', res);
      return res;
    });
}

module.exports = {
  get: get,
  create: create,
  save: save
};
