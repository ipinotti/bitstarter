var express = require('express');
var fs = require ('fs');
var app = express.createServer(express.logger());
var buffer = new buffer(48);
var path = "index.html";

buffer = fs.readFileSync(path, function (err, stats) {
  if (err) throw err;
  console.log('stats: ' + JSON.stringify(stats));
});

app.get('/', function(request, response) {
  response.send(buffer);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
