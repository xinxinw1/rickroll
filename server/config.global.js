var path = require('path');

module.exports = {
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
