/* Load libraries */

var express = require('express');
var app = express();

/* Define variables */

app.set('port', process.env.PORT || 8080);
app.set('hostname', process.env.HOSTNAME || undefined);

/* Route for static pages */

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(express.static(__dirname + '/static'));

app.use(function (req, res){
  res.sendFile(__dirname + '/static/index.html');
});

'test';

/* Listen on port or export app */

if (require.main === module){
  app.listen(app.get('port'), app.get('hostname'), function () {
    console.log('Listening on port ' + app.get('port') + '!');
  });
} else {
  module.exports = app;
}

