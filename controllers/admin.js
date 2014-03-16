var admin = require('../proxy/admin');
var content = require('../proxy/content');
var path = require('path');
var fs = require('fs');
var urlLib = require('url');

exports.middleware = function (req, res, next) {
  var user = req.session.user;
  //没有登录信息
  if(!user || Object.keys(user).length === 0 || !user.id ) {
    res.statusCode = 302;
    res.setHeader('Location', '/login?redirect=' + encodeURIComponent(req.originalUrl || req.url));
    return res.end();
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
  var body = req.body;
  var sub = body.sub;
  if (body.sub === 'report') {
    sub = '教师报告';
  }
  var options = {user: user.id, title: body.title, detail: body.detail, type: sub}
  content.add(options, function (err, url) {
    if (err) {
      return next(err);
    };
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({code: 1, href: url}))
  });
};

var loginFile = path.join(__dirname, '../assets/login.html');
var loginContent = fs.readFileSync(loginFile);

exports.login = function (req, res, next) {
	var body = req.body;
  var params = urlLib.parse(req.url, true);
  var redirect = params.redirect;
	//尝试登录
	if (body && body.name && body.pass) {
    admin.check(body.name, body.pass, function (err, flag, user) {
      if (err) {
      	return next(err)
      }
      if (flag === true) {
        req.session.user = user;
        res.statusCode = 302;
        res.setHeader('Location', redirect || '/');
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

exports.onlyAdmin = function (req, res, next) {
  var user = req.session.user;
  //没有登录信息
  if(!user || user.id !== 'admin') {
    res.statusCode = 302;
    res.setHeader('Location', '/assets/403.html');
  }
  return next();
}

var manageFile = path.join(__dirname, '../view/manage.html');
var manageContent = fs.readFileSync(manageFile).toString();

exports.manage = function (req, res, next) {
  var body = req.body;
  //新建用户
  if (body.id && body.name && body.password) {
    admin.add(body.id, {name: body.name, password: body.password}, function (err){
      if (err) {
        return next(err);
      }
      res.statusCode = 302;
      res.setHeader('Location', '/content');
      res.end();
    });
    return;
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  return res.end(manageContent);
};