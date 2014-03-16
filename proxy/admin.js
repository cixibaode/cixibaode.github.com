var config = require('../config');
var Yaml = require('../lib/yaml');
var fs = require('fs');
var path = require('path');

var folder = config.folder;
var users = Yaml({file: config.user});

var values = users.keys();

function initUser (f) {
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

for (f in values) {
  initUser(f);
}



exports.check = function (user, password, cb) {
  var info = users.get(user);
  if (info && info.password === password) {
  	return cb(undefined, true, {name: info.name, id: user});
  }
  cb(undefined, false);
};


exports.add = function (user, infos, cb) {
  var info = users.get(user);
  //user 已经存在
  if (info) {
    return cb(new Error('User Exist: ' + JSON.stringify({user: user, info: infos}) ));
  }
  var name = infos.name; 
  var password =  infos.password;
  if (!user || !name || !password) {
    return cb(new Error('Invalid Params: ' + JSON.stringify({user: user, info: infos}) ));
  }
  users.set(user, infos);
  values[user] = infos;
  initUser(user);
  cb();
};

exports.users = users;
exports.contents = values;