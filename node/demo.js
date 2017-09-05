var readof = require('./readof');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser");  
  
var app = express();

app.use(bodyParser.json());  
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/base64', function(req, resp){
    var url = req.body.url;
    
	var params = {
		url: url
	};

	readof.read(params, (error, buffer) => {
		var base64 = buffer.toString('base64');
		var result = JSON.stringify({code: 200, base64: base64});
    	resp.end(result);
	});
});
app.listen(9090);