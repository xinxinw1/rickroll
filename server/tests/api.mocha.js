require('./resetdb.mocha');
var should = require('should');
var request = require('supertest');
var app = require('../index');

describe('/api/create', () => {
  it('should be able to create a page', () => {
    return request(app)
      .post('/api/create')
      .send({
        name: 'test',
        pretend: 'whoa'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        res.body.should.have.properties({
          name: 'test',
          pretend: 'whoa'
        });
      });
  });
  
  it('should be able to get a page', () => {
    return request(app)
      .get('/a')
      .expect('Content-Type', /html/)
      .expect(200)
      .then(res => {
        res.text.should.endWith('</html>');
      });
  });
  
});
