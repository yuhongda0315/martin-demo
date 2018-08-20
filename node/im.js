var RongSDK = require('rongcloud-sdk')({
  appkey: 'e0x9wycfx7flq',
  secret: 'STCevzDS6Xy18n',
  api: 'http://apixq.rongcloud.net:9200'
});

var Message = RongSDK.Message;
var Private = Message.Private;
var Group = RongSDK.Group;
var User = RongSDK.User;

// API 文档: http://www.rongcloud.cn/docs/server_sdk_api/message/private.html#send
var message = {
senderId: 'sea9902',
targetId: 'group_cdefg',
objectName: 'RC:TxtMsg',
content: {
  content: '你好，小明'
}
};
Private.send(message).then(result => {
console.log(result);
}, error => {
console.log(error);
});

