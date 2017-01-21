var path = require('path');

var config = {
  env: 'development',
  root: path.resolve(__dirname, '..'),
  port: process.env.PORT || 8080,
  hostname: process.env.HOSTNAME || undefined,
  secret: process.env.SECRET || 'a secret',
  db: {
    host: 'localhost',
    port: '27017',
    name: 'rickroll'
  },
  redirectUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

if (process.env.NODE_ENV === 'testing'){
  config.env = 'testing';
  config.db.name = 'rickroll-test';
}

if (process.env.NODE_ENV === 'production'){
  config.env = 'production'
}

module.exports = config;
