var config = require('../config');
var Yaml = require('../lib/yaml');
var fs = require('fs');
var path = require('path');

var folder = config.folder;
var users = Yaml({file: config.user});


var values = users.keys();
for (f in values) {
	var p = path.join(folder, f);
	if (!fs.existsSync(p)) {
	  fs.mkdirSync(p);
	}
  infoFile = path.join(p, 'info.yaml');
  values[f].detail = {
    info: Yaml({ file: infoFile }),
    dir: p
  }
}


exports.check = function (user, password, cb) {
  var info = users.get(user);
  if (info && info.password === password) {
  	return cb(undefined, true, {name: info.name, id: user});
  }
  cb(undefined, false);
};


exports.add = function (user, info, cb) {
  var info = users.get(user);
  //user 已经存在
  if (info) {
    
  }
};

exports.users = users;
exports.contents = values;