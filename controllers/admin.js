var admin = require('../proxy/admin');
var content = require('../proxy/content');
var path = require('path');
var fs = require('fs');

exports.middleware = function (req, res, next) {
  var user = req.session.user;
  //没有登录信息
  if(!user || Object.keys(user).length === 0 || !user.id ) {
    res.statusCode = 302;
    res.setHeader('Location', '/login');
    res.end();
  }
  return next();
};

var createFile = path.join(__dirname, '../assets/create.html');
var createContent = fs.readFileSync(createFile);

exports.create = function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(createContent);
};


exports.upload = function (req, res, next) {
  var user = req.session.user;

  res.statusCode = 200;
  res.end(JSON.stringify({code: 1}))
};

var loginFile = path.join(__dirname, '../assets/login.html');
var loginContent = fs.readFileSync(loginFile);

exports.login = function (req, res, next) {
	var body = req.body;
	//尝试登录
	if (body && body.name && body.pass) {
    admin.check(body.name, body.pass, function (err, flag, user) {
      if (err) {
      	return next(err)
      }
      if (flag === true) {
        req.session.user = user;
        res.statusCode = 302;
        res.setHeader('Location', '/admin/create');
        return res.end();
      }
      res.statusCode = 302;
      res.setHeader('Location', '/assets/error.html');
      return res.end(); 

    });
    return;
	};

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(loginContent);
};