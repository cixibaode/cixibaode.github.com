var http = require('http');
var connet = require('connect');

var app = connect();
app.use(connect.static(__dirname));

var server = http.createServer(app);

server.listen(8080, function () {
  console.log('Server running at http://127.0.0.1:80/');
});


// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(80, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:80/');