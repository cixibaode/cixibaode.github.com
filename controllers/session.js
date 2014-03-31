
exports.middleware  = function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  return res.end(JSON.stringify(req.session.user));
};