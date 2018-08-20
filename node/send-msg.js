var RongSDK = require('rongcloud-sdk')({
    appkey: '8luwapkvucoil',
    secret: 'y0icysjl4h3LWz'
});
var Message = RongSDK.Message;
var Private = Message.Private;

var message = {
	senderId: 'mon9902',
	targetId: 'mon9906',
	objectName: 'RC:TxtMsg',
	content: {
		content: '你好，小明'
	}
};

var index = 0;
var timer = setInterval(() => {
    if(index == 30){
        clearInterval(timer);
    }
    message.content = {
        content: 'LLLL' + index
    }; 

    Private.send(message).then(result => {
        console.log(result);
    }, error => {
        console.log(error);
    });
    index++;
}, 50);