var crypto = require('crypto');
//npm install request --save
var request = require('request');

var appkey = '8luwapkvucoil';
var secret = 'y0icysjl4h3LWz'; 

var sha1 = (input) => {
	var shasum = crypto.createHash('sha1');
	shasum.update(input);
	return shasum.digest('hex');
};

var nonce = parseInt(Math.random() * 0xffffff); 
var timestamp = Date.parse(new Date()) / 1000; 
var str = secret+nonce+timestamp; 
var sign = sha1(str); 

var url = "http://api.sms.ronghub.com/sendCode.json";
var body = 'mobile=18688898888&region=86&templateId=d03lrQuk44Ybk_YGzCnlIS';
request({
	url: url,
	method: "POST",
	json: true,
	headers: {
		'App-Key': appkey,
		'Nonce': nonce,
		'Timestamp': timestamp,
		'Signature': sign,
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: body
}, function(error, response, body) {
	console.log(error, body);
});