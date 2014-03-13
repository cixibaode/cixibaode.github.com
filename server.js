var http = require('http');
var connect = require('connect');
var fs = require('fs');
var path = require('path');

var file = path.join(__dirname, './index.html');
var content = fs.readFileSync(file);

var app = connect();
app.use('/assets', connect.static( __dirname));
app.use(function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(content);
});

var server = http.createServer(app);

server.listen(8080, function () {
  console.log('Server running at http://127.0.0.1:80/');
});
