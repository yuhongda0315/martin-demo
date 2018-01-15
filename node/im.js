var rongcloudSDK = require('rongcloud-sdk');


var appkey = '8luwapkvucoil';
var secret = 'y0icysjl4h3LWz';
rongcloudSDK.init(appkey, secret);


// User
// var userModel = rongcloudSDK.user;

// var userId = '1001';
// var username = 'Lance';
// var portraitUri = 'http://files.domain.com/avatar.jpg';
// userModel.getToken(userId, username, portraitUri, (error, result) => {
// 	if (error) {
// 		console.log(JSON.stringify(error));
// 		return;
// 	}
// 	console.log(result);
// });

// Message
var messageModel = rongcloudSDK.message;


var fromUserId = '1001';
var toUserId = 'seal9901';
var objectName = 'RC:TxtMsg';

var content = {content: 'hello world'};
content = JSON.stringify(content);

var pushContent = ["push{name}"];
var pushData = ["pushd"];
var format = '';

// var publishPrivate = messageModel.private.publish_template;
// publishPrivate(fromUserId, toUserId, objectName, content, pushContent, pushData, format, (error, result) => {
// 	if (error) {
// 		console.log(JSON.stringify(error));
// 		return;
// 	}
// 	console.log(result);
// });

var content = {content: 'hello world,{name}'};
// content = JSON.stringify(content);
var values = [{"{name}":"martin"}];
var toUserIds = [toUserId];

var publishTmplPrivate = messageModel.private.publish_template;

publishTmplPrivate(fromUserId, toUserIds, objectName, content, values, pushContent, pushData, format, (error, result) => {
	if (error) {
		console.log(JSON.stringify(error));
		return;
	}
	console.log(result);
});