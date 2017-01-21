'use strict';

var mongoose = require('../helpers/mongoose');
var co = require('co');

var PageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  pretend: {
    type: String,
    required: true
  },
  redirect: {
    type: String,
    required: true
  }
});

var Page = mongoose.model('Page', PageSchema);

/* Data */

// returns a promise of a page
function _create(name, pretend, redirect){
  console.log('creating page', name, pretend, redirect);
  return _save(new Page({
    name: name,
    pretend: pretend,
    redirect: redirect
  }));
}

function _get(name){
  //console.log('getting page', name);
  return Page.findOne({name: name})
    .catch(err => {
      //console.log('get page error', err);
      throw {error: err, message: 'DB Error'};
    })
    .then(res => {
      if (res) {
        //console.log('found page', res);
        return res;
      } else {
        //console.log('not found', res);
        throw {error: res, message: 'Not found'};
      }
    });
}

function _getAll(){
  //console.log('getting all pages');
  return Page.find()
    .catch(err => {
      //console.log('getAll error', err);
      throw {error: err, message: 'DB Error'};
    })
    .then(res => {
      //console.log('found pages', res);
      return res;
    });
}

function _save(page){
  console.log('saving page', page);
  return page.save()
    .catch(err => {
      console.log('save page error', err);
      if (err.code && err.code == 11000){
        throw {error: err, message: 'Name already exists'};
      } else {
        throw {error: err, message: 'DB Error'};
      }
    })
    .then(res => {
      console.log('saved page', res);
      return res;
    });
}

function _delete(page){
  //console.log('deleting page', page);
  return page.remove()
    .catch(err => {
      //console.log('delete page error', err);
      throw {error: err, message: 'DB Error'};
    })
    .then(res => {
      //console.log('deleted page', res);
      return res;
    });
}

function _deleteByName(name){
  //console.log('deleting page by name', name);
  return Page.findOneAndRemove({name: name})
    .catch(err => {
      //console.log('delete page by name error', err);
      throw {error: err, message: 'DB Error'};
    })
    .then(res => {
      if (res) {
        //console.log('deleted page', res);
        return res;
      } else {
        //console.log('not found', res);
        throw {error: res, message: 'Not found'};
      }
    });
}

module.exports = {
  PageSchema: PageSchema,
  Page: Page,
  create: _create,
  get: _get,
  getAll: _getAll,
  save: _save,
  delete: _delete,
  deleteByName: _deleteByName
};
