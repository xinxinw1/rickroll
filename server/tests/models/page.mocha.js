require('../resetdb.mocha');
var should = require('should');

var db = require('../../helpers/db');

describe('Page Model', () => {
  it('should be able to get a page', () => {
    return db.page.get('a').then(page => {
      page.should.have.properties({
        name: 'a',
        pretend: 'b',
        redirect: 'c'
      });
    });
  });
  
  it('should be able to create a page', () => {
    return db.page.create('whoa', 'b', 'c').then(page => {
      page.should.have.properties({
        name: 'whoa',
        pretend: 'b',
        redirect: 'c'
      });
    });
  });
  
  it('should not be able to get just created page', () => {
    return db.page.get('whoa')
      .should.be.rejected()
      .then(err => {
        err.message.should.eql('Not found');
      });
  });
  
  it('should be able to get all pages', () => {
    return db.page.getAll().then(pages => {
      pages.should.have.size(2);
      pages[0].should.have.properties({
        name: 'a',
        pretend: 'b',
        redirect: 'c'
      });
      pages[1].should.have.properties({
        name: 'd',
        pretend: 'e',
        redirect: 'f'
      });
    });
  });
  
  it('should be able to delete a page by name', () => {
    return db.page.deleteByName('a')
      .then(page => {
        page.should.have.properties({
          name: 'a',
          pretend: 'b',
          redirect: 'c'
        });
        return db.page.get('a');
      })
      .should.be.rejected()
      .then(err => {
        err.message.should.eql('Not found');
        return db.page.getAll();
      })
      .then(pages => {
        pages.should.have.size(1);
        pages[0].should.have.properties({
          name: 'd',
          pretend: 'e',
          redirect: 'f'
        });
      });
  });
  
  it('should be able to delete a page', () => {
    return db.page.get('a')
      .then(page => {
        return db.page.delete(page)
      })
      .then(page => {
        page.should.have.properties({
          name: 'a',
          pretend: 'b',
          redirect: 'c'
        });
        return db.page.get('a');
      })
      .should.be.rejected()
      .then(err => {
        err.message.should.eql('Not found');
        return db.page.getAll();
      })
      .then(pages => {
        pages.should.have.size(1);
        pages[0].should.have.properties({
          name: 'd',
          pretend: 'e',
          redirect: 'f'
        });
      });
  });
  
  it('should be able to update a page', () => {
    return db.page.get('a')
      .then(page => {
        page.should.have.properties({
          name: 'a',
          pretend: 'b',
          redirect: 'c'
        });
        page.pretend = 'whoa';
        return db.page.save(page);
      })
      .then(page => {
        page.should.have.properties({
          name: 'a',
          pretend: 'whoa',
          redirect: 'c'
        });
        return db.page.get('a');
      })
      .then(page => {
        page.should.have.properties({
          name: 'a',
          pretend: 'whoa',
          redirect: 'c'
        });
      })
  });
});
