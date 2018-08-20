/// <reference path="./RongIMLib-2.3.2.d.ts" />
var Merda;
(function (Merda) {
    var Client = /** @class */ (function () {
        function Client() {
        }
        Client.init = function (params) {
            var RongIMClient = RongIMLib.RongIMClient;
            RongIMClient.init('8luwapkvucoil');
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    switch (status) {
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            console.log('链接成功');
                            break;
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            console.log('正在链接');
                            break;
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            console.log('断开连接');
                            break;
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            console.log('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                            console.log('域名不正确');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            console.log('网络不可用');
                            break;
                    }
                }
            });
            // 消息监听器
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {
                    // 判断消息类型
                    switch (message.messageType) {
                        case RongIMClient.MessageType.TextMessage:
                            // message.content.content => 消息内容
                            break;
                        case RongIMClient.MessageType.VoiceMessage:
                            // 对声音进行预加载                
                            // message.content.content 格式为 AMR 格式的 base64 码
                            break;
                        case RongIMClient.MessageType.ImageMessage:
                            // message.content.content => 图片缩略图 base64。
                            // message.content.imageUri => 原图 URL。
                            break;
                        case RongIMClient.MessageType.DiscussionNotificationMessage:
                            // message.content.extension => 讨论组中的人员。
                            break;
                        case RongIMClient.MessageType.LocationMessage:
                            // message.content.latiude => 纬度。
                            // message.content.longitude => 经度。
                            // message.content.content => 位置图片 base64。
                            break;
                        case RongIMClient.MessageType.RichContentMessage:
                            // message.content.content => 文本消息内容。
                            // message.content.imageUri => 图片 base64。
                            // message.content.url => 原图 URL。
                            break;
                        case RongIMClient.MessageType.InformationNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.ContactNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.ProfileNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.CommandNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.CommandMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.UnknownMessage:
                            // do something...
                            break;
                        default:
                        // do something...
                    }
                }
            });
            var token = "KDYuOkJE8hwr9R41yrtgULrkPG6U/xPk3zvPIWf9le0Ft3u/nBdfKEYWUwwODrDUEsDUPue0AC+o5EHfWTcxTQ==";
            RongIMClient.connect(token, {
                onSuccess: function (userId) {
                    console.log("Connect successfully." + userId);
                },
                onTokenIncorrect: function () {
                    console.log('token无效');
                },
                onError: function (errorCode) {
                    console.log(errorCode);
                }
            });
        };
        return Client;
    }());
    Merda.Client = Client;
})(Merda || (Merda = {}));
