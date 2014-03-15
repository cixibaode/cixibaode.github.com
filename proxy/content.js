var config = require('../config');
var Yaml = require('../lib/yaml');
var fs = require('fs');
var path = require('path');

var admin = require('./admin');
var user = admin.users;
var contents = admin.contents;


//user: 'admin', title: 'hello world', detail: '你好吗'
exports.add = function (options, cb) {
  var user = options.user;
  var value = contents[user];
  if (!value) {
  	return cb(new Error('User No Exist:' + JSON.stringify(options)));
  }
  var title = options.title;
  var dir = value.detail.dir;
  var handle = value.detail.info;
  var titles = handle.get('titles') || [];
  var d  = new Date().getTime() + '';
  var file = path.join(dir, d);
  options.user = value.name;
  fs.writeFileSync(file, JSON.stringify(options));
  titles.push({title: title, file: file, status: 1, name: d});
  handle.set('titles', titles);
  cb(null, '/content/' + user + '/' + d);
};

exports.get = function (user, cb) {
  var value = contents[user];
  var handle = value.detail.info;
  cb(undefined, handle.keys(), value);
};

exports.gets = function (cb) {
  cb(undefined, contents);
};