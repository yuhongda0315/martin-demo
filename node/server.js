var express      = require('express')
var bodyParser = require('body-parser');
var RongCloudSDK = require('rongcloud-sdk');

var RongSDK = RongCloudSDK({
    appkey: '8luwapkvucoil',
    secret: 'y0icysjl4h3LWz'
});

var app = express()
app.use(bodyParser.json());

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

var index = 1;

app.post('/send', (req, res) => {
	var params = req.params || {};

	var Message = RongSDK.Message;
	var Private = Message.Private;
	var message = {
		senderId: 'bmsystem01',
		targetId: 'mar9901',
		objectName: 'RC:TxtMsg',
		content: {
			content: '你好，' + index
		}
	};
	Private.send(message).then(result => {
		console.log(result);
		index++;
		res.end(JSON.stringify({
			code: 200	
		}));
	}, error => {
		res.end(JSON.stringify({
			code: error	
		}));
	});
});

var port = 8585;
app.listen(port);
console.log('listener port : %d', port);
