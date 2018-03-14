var http = require('http');
var querystring = require('querystring');
//创建服务器
var server = http.createServer(function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	
    if (req.url === '/random' && req.method.toLowerCase() === 'get') {
        var data = '';
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
        	var random = Math.floor(Math.random() * 10000);
            res.end(JSON.stringify({random: random}));
        });
    };
});
//设置监听端口
server.listen(3000, "127.0.0.1", function () {
    console.log("server is started listen port 3000");
});