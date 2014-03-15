var http = require('http');
var connect = require('connect');
var fs = require('fs');
var path = require('path');
var admin = require('./controllers/admin');
var index = require('./controllers/index');

var file = path.join(__dirname, './index.html');
var content = fs.readFileSync(file);

var loginFile = path.join(__dirname, './assets/login.html');
var loginContent = fs.readFileSync(loginFile);

var app = connect();
app.use(connect.bodyParser());
//cookie
app.use(connect.cookieParser());
//session
app.use(connect.cookieSession({ secret: 'cixibade github com', cookie: { maxAge: 8 * 60 * 60 * 1000 }}));

app.use('/login', admin.login);
app.use('/admin/', admin.middleware);
app.use('/admin/create', admin.create);
app.use('/admin/upload', admin.upload);
app.use('/admin/manage', admin.onlyAdmin);
app.use('/admin/manage', admin.manage);

app.use('/content/', index.middleware);
app.use('/assets', connect.static( __dirname + '/assets'));
app.use('/public', connect.static( __dirname + '/public'));

app.use(function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(content);
});

var server = http.createServer(app);

server.listen(8080, function () {
  console.log('Server running at http://127.0.0.1:80/');
});
