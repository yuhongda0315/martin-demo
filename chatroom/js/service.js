'use strict';
(function(dependencies) {
    var global = dependencies.win;
    var ChatUtil = dependencies.ChatUtil;
    var $ = dependencies.jQuery;
    var util = global._;

    var IMLib = dependencies.RongIMLib;
    var IMClient = IMLib.RongIMClient;

    var ConversationType = IMLib.ConversationType;
    var conversationType = ConversationType.CHATROOM;

    var ChatObserver = ChatUtil.ObserverList;

    var config = {
        url: '',
        msgCount: 20
    };
    var currentUser = null;

    var User = (function() {

        var getIndex = function(bound) {
            return Math.floor(Math.random() * bound);
        };

        var getName = function() {
            var bound = names.length;
            // 数据来源：data.js
            return names[getIndex(bound)] + names[getIndex(bound)];
        };

        var getPortrait = function() {
            var bound = portraits.length;
            // 数据来源：data.js
            return portraits[getIndex(bound)];
        };

        // 批量获取用户信息
        var batch = function(params, callback) {
            var users = params.users;
            util.each(users, function(user) {
                user.name = getName();
                user.portrait = getPortrait();
            });
            var error = null;
            callback(error, users);
        };

        var getToken = function(callback) {
            var bound = tokens.length;
            var index = getIndex(bound);
            // 数据来源：data.js
            var token = tokens[index];

            var users = [{
                token: token
            }];
            var params = {
                users: users
            };
            batch(params, function(error, users) {
                var user = currentUser = users[0];
                callback(error, user);
            });
        };

        return {
            batch: batch,
            getToken: getToken
        };

    })();

    var msgObserver = new ChatObserver();

    var Message = (function() {
        var data = [];
        var getFloatInfo = function(message){
            var content = message.content;
            var username = content.user.name;
            var data = content.content;
            var info = username + '说: ' + data;
            return info;
        };

        var getPos = function(){
            return Math.floor(Math.random() * 200) + 5;
        };

        var convertMsg = function(message) {
            var content = message.content;
            //currentUser 防止空数据，赋值假数据.
            message.user = content.user || currentUser;
            var sentTime = message.sentTime;
            message.sentTime = getDate(sentTime);

            var info = getFloatInfo(message);
            var pos = getPos();
            message.floatInfo = {
                content: info,
                pos: pos
            };

        };

        var _push = function(message) {
            convertMsg(message);
            data.push(message);
            msgObserver.notify(message);
        };
        var messageItem = {
            TextMessage: function(data) {
                var content = data.content;
                var extra = data.extra;
                var user = {
                    name: currentUser.name,
                    portrait: currentUser.portrait
                };
                var msgData = {
                    content: content,
                    user: user,
                    extra: extra
                };
                return new IMLib.TextMessage(msgData);
            }
        };
        var create = function(params) {
            var messageType = params.messageType;
            var data = params.data;
            var msgFactory = messageItem[messageType] || util.noop;
            return msgFactory(data);
        };
        /*
            params.messageType
            params.data
         */
        var send = function(params, callback) {
            var sendMessage = IMClient.getInstance().sendMessage;

            var targetId = config.chatRoomId;
            var msg = create(params);

            sendMessage(conversationType, targetId, msg, {
                onSuccess: function(message) {
                    var error = null;
                    callback(error, message);
                    _push(message);
                },
                onError: function(error) {
                    callback(error);
                }
            });
        };

        var get = function() {
            return data;
        };

        var watch = function(listener) {
            msgObserver.add(listener);
        };

        return {
            get: get,
            send: send,
            watch: watch,
            _push: _push
        };
    })();

    var ChatRoom = (function() {
        var users = [];

        var join = function(params, callback) {
            callback = callback || util.noop;

            var chatRoomId = params.chatRoomId || config.chatRoomId;
            var count = params.count || config.msgCount;

            var imInsatance = IMClient.getInstance();
            imInsatance.joinChatRoom(chatRoomId, count, {
                onSuccess: function() {
                    var error = null;
                    callback(error);
                },
                onError: function(error) {
                    callback(error);
                }
            });
        };

        var quit = function(params) {
            var chatRoomId = params.chatRoomId;
            var callbacks = {
                onSuccess: util.noop,
                onError: util.noop
            };

            var imInsatance = IMClient.getInstance();
            imInsatance.quitChatRoom(chatRoomId, callbacks);
        };

        var get = function(params, callback) {
            users.length = 0;
            var chatRoom = {
                userInfos: []
            }

            for (var i = 0; i < 50; i++) {
                var user = {id: i};
                users.push(user);
            }
            var params = {
                users: users
            };
            User.batch(params, function(error, users) {
                chatRoom.userInfos = users;
                callback(error, chatRoom);
            });
        };

        return {
            join: join,
            get: get,
            quit: quit
        };
    })();

    var statusObserver = new ChatObserver();

    var Status = (function() {

        var connect = function(token, callback) {
            IMClient.connect(token, {
                onSuccess: function(userId) {
                    var error = null;
                    callback(error, userId);
                },
                onTokenIncorrect: function() {
                    var error = 'invalid token';
                    callback(error);
                },
                onError: function(error) {
                    callback(error);
                }
            });
        };

        var watch = function(listener) {
            statusObserver.add(listener);
        };

        return {
            connect: connect,
            watch: watch
        };
    })();

    var getDate = function(timestamp) {
        var date = new Date(timestamp);
        var hours = date.getHours();
        var mins = date.getMinutes();
        var seconds = date.getSeconds();

        var result = [hours, mins, seconds];
        return result.join(':');
    }

    var setMessageListener = function() {
        RongIMClient.setOnReceiveMessageListener({
            onReceived: function(message) {
                Message._push(message);
            }
        });
    };

    var setConnectListener = function() {
        IMClient.setConnectionStatusListener({
            onChanged: function(status) {
                statusObserver.notify(status);
            }
        });

    };

    var init = function(_config) {

        util.extend(config, _config);

        var appkey = config.appkey;
        IMClient.init(appkey)

        setMessageListener();
        setConnectListener();

        return {
            User: User,
            Message: Message,
            ChatRoom: ChatRoom,
            Status: Status
        };
    };

    global.RongChatService = {
        init: init
    };

})({
    win: window,
    ChatUtil: ChatUtil,
    jQuery: jQuery,
    RongIMLib: RongIMLib
});