require('../resetdb.mocha');
var should = require('should');

var page = require('../../helpers/page');

describe('Page Helper', () => {
  it('should be able to get a page', () => {
    return page.get('a').then(page => {
      page.should.have.properties({
        name: 'a',
        pretend: 'b',
        redirect: 'c'
      });
    });
  });
  
  it('should be able to create a page', () => {
    return page.create('whoa', 'https://youtu.be/WSUFzC6_fp8', 'https://youtu.be/dQw4w9WgXcQ')
      .then(page => {
        page.should.have.properties({
          name: 'whoa',
          pretend: 'https://youtu.be/WSUFzC6_fp8',
          redirect: 'https://youtu.be/dQw4w9WgXcQ'
        });
      })
      .then(_ => page.get('whoa'))
      .then(page => {
        page.should.have.properties({
          name: 'whoa',
          pretend: 'https://youtu.be/WSUFzC6_fp8',
          redirect: 'https://youtu.be/dQw4w9WgXcQ'
        });
      })
  });
  
  it('should fail to create a page when pretend addr is invalid', () => {
    return page.create('whoa', 'what', 'https://youtu.be/dQw4w9WgXcQ')
      .should.be.rejected()
      .then(err => {
        err.message.should.be.eql('Invalid pretend address');
      });
  });
  
  it('should fail to create a page when redirect addr is invalid', () => {
    return page.create('whoa', 'https://youtu.be/WSUFzC6_fp8', 'hey')
      .should.be.rejected()
      .then(err => {
        err.message.should.be.eql('Invalid redirect address');
      });
  });
});
