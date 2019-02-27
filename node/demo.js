var http = require('http');
var URL = require('url');

var noop = () => {};
var routers = {
  '/share-POST': (content) => {
    content = JSON.parse(content)
    
  }
};

http.createServer((request, response) => {
  var url = request.url;
  var path = URL.parse(url).pathname;
  var method = request.method;
  var name = [path, method].join('-');
  var content = '';
  request.on('data', function (chunk) {
    content += chunk;
  });
  request.on('end', function () {
    var router = routers[name] || noop;
    router(content);
  });
  response.writeHead(200, {
    'Access-Control-Allow-Method': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
  });
  response.end();
}).listen(9836);