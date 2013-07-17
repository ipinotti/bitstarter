var express = require('express');
var fs = require ('fs');
var app = express.createServer(express.logger());
var path = './index.html';
var buffer = fs.readFileSync(path);
console.log ("Read File ok"); 

app.get('/', function(request, response) {
  response.send(buffer.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
