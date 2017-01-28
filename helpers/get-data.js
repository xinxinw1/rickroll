var scrape = require('html-metadata');

function getMetadata(pageUrl){
  return scrape(pageUrl)
    .catch(err => {
      console.log('scrape error', err);
      throw new Error('Server error');
    });
}

module.exports = {
  getMetadata: getMetadata
};