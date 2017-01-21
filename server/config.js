var config = require('./config.global');

switch (process.env.NODE_ENV){
  case 'testing': require('./config.test'); break;
  case 'production': require('./config.prod'); break;
}

module.exports = config;
