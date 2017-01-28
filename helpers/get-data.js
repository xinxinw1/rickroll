var scrape = require('html-metadata');

function getMetadata(pageUrl){
  return scrape(pageUrl);
}

module.exports = {
  getMetadata: getMetadata
};