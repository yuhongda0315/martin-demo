'use strict';
var http = require('http');
var url = require('url');
var server = http.createServer();
server.on('request',function(req, res){
    res.writeHead(200,{'Content-Type':'application/javascript'});
    console.log(JSON.stringify(req.headers));
    var callback = 'location.reload();';
    res.end(callback);
});
server.listen('8999');
console.log('Server running!');