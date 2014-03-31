var content = require('../proxy/content');
var path = require('path');
var fs = require('fs');
var url = require('url');
var config = require('../config');

var folder = config.folder;
var contentFile = path.join(__dirname, '../view/content.html');
var contentContent = fs.readFileSync(contentFile).toString();

exports.middleware = function (req, res, next) {
  var params = url.parse(req.url, true);
  var pathname = params.pathname;
  var arr = pathname.split('/');
  var len = arr.length;
  if (pathname === '/') {
    content.gets(function (err, info) {
      if (err) {
        return next(err);
      }
      var arr = [];
      for (var key in info) {
        var value = info[key];
        var name = value.name;
        arr.push('<li><a href="/content/' + key + '">' + name +'</a></li>');
      }
      var detail = '<ul>' + arr.join('') + '</ul>';
      var str = contentContent.replace('{{user}}', '');
      str = str.replace('{{titile}}', '教师列表');
      str = str.replace('{{detail}}', detail);
      str = str.replace('{{type}}', '教师列表');
      res.writeHead(200, {'Content-Type': 'text/html'});
      return res.end(str);
    });
  } else if (len === 2) {
    var user = arr[1];
    content.get(user, function (err, info, userInfo) {
      if (err) {
        return next(err);
      }
      info = info || {};
      var titles = info.titles || [];
      var arr = [];

      for (var i = 0; i < titles.length; i++) {
        var item = titles[i] || {}
        arr.push('<li><a href="/content/'+ user+ '/' + item.name + '">' + item.title +'</a></li>');
      }
      var detail = '<ul>' + arr.join('') + '</ul>';
      var str = contentContent.replace('{{user}}', userInfo.name);
      str = str.replace('{{titile}}', userInfo.name);
      str = str.replace('{{detail}}', detail);
      str = str.replace('{{type}}', userInfo.name);
      res.writeHead(200, {'Content-Type': 'text/html'});
      return res.end(str);
    });

  } else if (len >= 3) {
    var file = path.join(folder, arr[1], arr[2]);
    fs.readFile(file, function (err, info) {
      if (err) {
        return next(err);
      }
      try {
        info= JSON.parse(info);
      } catch(err) {
        return next(err);
      }
      var user = info.user || '';
      var titile = info.title || '';
      var type = info.type || '';
      var detail = info.detail || '';
      var str = contentContent.replace('{{user}}', user);
      str = str.replace('{{titile}}', titile);
      str = str.replace('{{detail}}', detail);
      str = str.replace('{{type}}', type);
      res.writeHead(200, {'Content-Type': 'text/html'});
      return res.end(str);
    });

  }
};

