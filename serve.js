// Zero-dependency static server: `node serve.js` → http://localhost:4180
var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 4180;
var ROOT = __dirname;
var TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'
};

http.createServer(function (req, res) {
  var file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (file.endsWith(path.sep)) file = path.join(file, 'index.html');
  fs.readFile(file, function (err, body) {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  });
}).listen(PORT, function () {
  console.log('Marketplace prototypes → http://localhost:' + PORT);
});
