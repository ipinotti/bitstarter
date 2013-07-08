var express = require('express');
var fs = require ('fs');
var app = express.createServer(express.logger());
var path = './index.html';
var buffer = fs.readFileSync(path);
console.log ("Read File ok"); 

//fs.readFile('./index.html', function (err, data) {
//  if (err) throw err;
//  console.log(data);
//  buffer = data;
//});

app.get('/', function(request, response) {
  response.send(buffer.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
