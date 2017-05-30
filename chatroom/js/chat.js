/*
思路：

App Server：
    1、token 和随机名称、头像
    2、批量查询用户信息
类库：
Vue 、Vue-Router 、JQuery、BlinkSDK


搭建：
1、整理项目结构
2、伪代码，实现思路
3、callback(error,result); 第一个参数为 error

功能点：
1、主播直播
2、游客观看直播
3、即使发送文本消息
4、查看最新的聊天室成员
*/
'use strict';
(function(RongChat, dependencies) {
    var $ = dependencies.jQuery;
    var Vue = dependencies.Vue;
    var VueRouter = dependencies.VueRouter;

    var components = RongChat.components;

    var global = dependencies.win;
    var RongChatService = global.RongChatService;
    var util = global._;

    var routers = RongChat.routers;

    var config = {
        live: {
            width: 700,
            height: 460,
            frameRate: 15,
            VIDEO_MAX_RATE: 600,
            VIDEO_MIN_RATE: 300,
            appId: '1234567890abcdefg',
            url: 'https://api.blinktalk.online:8800/token'
        }
    };

    var init = function(_config) {

        config = util.extend(_config, config);

        var router = new VueRouter({
            routes: routers
        });

        var el = config.el;
        var chat = new Vue({
            router: router,
            el: el,
            data: {
                videoTmpl: '',
                isBarrage: false,
                activeTab: 'message',
                floatMsgs: []
            },
            watch: {
                '$route': getRouterPath
            },
            created: function() {
                var route = this.$route;
                getRouterPath(route, this);

                var liveItem = {
                    add: function(result) {
                        chat.videoTmpl = result.data;
                    }
                };

                var isViewer = route.params.viewer;
                var roomId = config.chatRoomId;

                var live = config.live;
                var url = live.url;
                getToken(url, function(error, data) {
                    var params = {
                        roomId: roomId,
                        userId: data.userId,
                        token: data.token,
                        isViewer: isViewer
                    };
                    startLive(params, function(error, result) {
                        var type = result.type;
                        liveItem[type](result);
                    });
                });
            },
            methods: {
                isEqual: isEqual
            }
        });

        var dataService = RongChatService.init(config);

        var Message = dataService.Message;

        RongChat.dataService = dataService;
        RongChat.chat = chat;

        function isEqual(self, other) {
            return self == other;
        }

        function getRouterPath(route, self) {
            var path = route.name || 'message';
            chat = chat || self;
            chat.activeTab = path;
        }

        var joinChatRoom = function() {
            var ChatRoom = dataService.ChatRoom;
            var params = {
                count: 20
            };
            ChatRoom.join(params, function(error) {
                console.log('joinChatRoom', error);
                chat.$emit('pullUser');
            });
        };

        var Status = dataService.Status;
        Status.watch(function(status) {
            console.log(status);
        });

        var User = dataService.User;
        User.getToken(function(error, user) {
            var token = user.token;
            Status.connect(token, function(error, userId) {
                console.log('connect successfully.', userId);
                joinChatRoom();
            });
        });

        Message.watch(function(message) {
            var isBarrage = chat.isBarrage;
            isBarrage && chat.floatMsgs.push(message.floatInfo);
            chat.$emit('receivedMessage', message);
        });
    };

    function getToken(url, callback) {
        var live = config.live;
        var appId = live.appId;

        var userId = 'U' + (+new Date);
        var appId = appId;
        var data = 'uid=' + userId + '&appid=' + appId;
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            async: true,
            success: function(token) {
                var error = null;
                var user = {
                    userId: userId,
                    token: token
                };
                callback(error, user);
            },
            error: function(error) {
                callback(error);
            }
        });
    }

    function createVideo(stream, id) {
        var src = URL.createObjectURL(stream);
        return "<video src=" + src + " autoplay></video>";
    };

    function startLive(params, callback) {
        var isViewer = params.isViewer == 0 ? 1 : 2;

        var participant = {
            add: function(data) {
                var stream = data.data;
                var video = createVideo(stream);

                var result = {
                    type: 'add',
                    data: video,
                    isLocal: data.isLocal
                };
                var error = null;
                callback(error, result);
            }
        };

        var chatLive = new BlinkEngine();
        var chatLiveHandler = new BlinkEngineEventHandle();
        chatLiveHandler.on('onJoinComplete', function(data) {
            if (params.isViewer == 0) {
                var localStream = chatLive.getLocalVideoView();
                participant.add({
                    data: localStream,
                    isLocal: true
                });
            }
        });
        chatLiveHandler.on('onUserJoined', function(data) {
            var userType = data.userType;
            // 1 为普通模式 2 为观察者模式
            if (userType == UserType.NORMAL) {
                var userId = data.userId;
                var stream = chatLive.getRemoteVideoView(userId);
                participant.add({
                    data: stream,
                    isLocal: false
                });
            }
        });

        var live = config.live;

        chatLive.setBlinkEngineEventHandle(chatLiveHandler);
        var videoConstraints = {
            width: live.width,
            height: live.height,
            frameRate: live.frameRate
        };

        var isCloseAudio = isViewer == UserType.NORMAL ? false : true;
        chatLive.setVideoParameters({
            VIDEO_PROFILE: videoConstraints,
            VIDEO_MAX_RATE: live.VIDEO_MAX_RATE,
            VIDEO_MIN_RATE: live.VIDEO_MIN_RATE,
            USER_TYPE: isViewer,
            IS_CLOSE_VIDEO: false,
            IS_CLOSE_AUDIO: isCloseAudio
        });

        var roomId = params.roomId;
        var userId = params.userId;
        var token = params.token;

        chatLive.joinChannel(roomId, userId, token);
    }

    RongChat.init = init;
})(RongChat, {
    jQuery: jQuery,
    Vue: Vue,
    VueRouter: VueRouter,
    win: window
});