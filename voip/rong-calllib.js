/*
使用流程：
    1、引入第三方 SDK
    2、引入 RongIMCallLib

开发流程：
    1、获取 Agora 最新插件、SDK
    2、设计暴露方式、API
    3、伪代码、Demo
    4、实现
约定：
    1、所有依赖通过参数传入
    2、所有 callback 第一个参数是 error， 第二个是返回值
*/

"use strict";
(function(dependencies) {
    var global = dependencies.win;
    var RongCallUtil = dependencies.RongCallUtil;
    var MessageCtrl = dependencies.MessageCtrl;
    var util = global._;

    var RongVoIP = global.RongVoIP;
    var joinRoom = RongVoIP.joinRoom;
    var quitRoom = RongVoIP.quitRoom;
    var enableAudio = RongVoIP.enableAudio;
    var enableVideo = RongVoIP.enableVideo;


    var callUtil = RongCallUtil;

    var sendCommand = MessageCtrl.sendCommand;

    var cache = callUtil.cache();

    var ObserverList = callUtil.ObserverList;

    var videoWatcher = new ObserverList();
    var commandWatcher = new ObserverList();
    var msgWatcher = new ObserverList();

    MessageCtrl.watch(function(message) {
        msgWatcher.notify(message);
    });

    var watch = function(listener) {
        msgWatcher.add(listener);
    };

    function Timer() {
        this.timeout = 0;
        this.startTime = 0;
        this.start = function(callback, second) {
            second = second || 0;

            if (callback) {
                this.timeout = setTimeout(function() {
                    callback();
                }, second);
            }

            this.startTime = +new Date;
        };

        this.stop = function(callback) {

            clearTimeout(this.timeout);

            var endTime = +new Date;
            var startTime = this.startTime;
            var duration = endTime - startTime;

            return {
                start: startTime,
                end: endTime,
                duration: duration
            };
        };
    }

    var callTimer = {};

    var calcTimeout = function(params) {
        var userIds = params.userIds;
        var conversationType = params.conversationType;
        var targetId = params.targetId;

        var timeout = config.timeout + (params.timeout || 0);
        var currentUserId = config.currentUserId;

        util.forEach(userIds, function(userId) {
            var timer = callTimer[userId] = new Timer();
            var isCurrentUser = (userId == currentUserId);
            var status = params.status;
            timer.status = status;
            timer.mediaType = params.mediaType;

            timer.start(function() {
                var key = isCurrentUser ? 'NO_RESPONSE5' : 'REMOTE_NO_RESPONSE15';
                var sentItem = {
                    sent: function(callback) {
                        var params = {
                            conversationType: conversationType,
                            targetId: targetId,
                            from: 'call-timeout',
                            reasonKey: key
                        };
                        var inviteUsers = cache.get('inviteUsers');
                        sendHungup(params, function(error, message) {
                            var senderUserId = message.senderUserId;
                            delete inviteUsers[senderUserId];
                        });
                    },
                    local: function(callback) {
                        var reason = Reason.get(key);
                        var content = {
                            reason: reason.code
                        };
                        var message = {
                            messageType: 'HungupMessage',
                            conversationType: conversationType,
                            targetId: targetId,
                            senderUserId: userId,
                            content: content,
                            messageDirection: 2
                        };

                        var inviteUsers = cache.get('inviteUsers');
                        delete inviteUsers[userId];

                        var error = null;
                        commandWatcher.notify(message);
                    }
                };
                // 接收方为自己时发送 HungupMessage, 其他人则本地创建 HungupMessage，认为此人已忽略、或者不在线。
                var method = isCurrentUser ? 'sent' : 'local';
                sentItem[method]();

            }, timeout);
        });
    };

    var room = {
        isActive: false,
        init: function(params, callback) {
            if (this.isActive) {
                return;
            }
            params.url = config.url;
            joinRoom(params, callback);
            this.isActive = true;
        },
        reset: function() {
            this.isActive = false;
            cache.remove('session');
        }
    };

    var initRoom = function(params) {
        getToken(params, function(error, token) {
            if (error) {
                throw new Error(error);
            }

            params.token = token;

            var videoItem = {
                added: function(result) {
                    var stream = result.data;
                    var userId = stream.getAttribute('userid');
                    var session = cache.get('session');
                    userId = session[userId] || userId;
                    stream.setAttribute('userId', userId);
                }
            };
            room.init(params, function(error, result) {
                if (error) {
                    throw new Error(error);
                }
                var type = result.type;
                var handler = videoItem[type];
                handler && handler(result);

                videoWatcher.notify(result);
            });
        });
    };

    var config = {
        url: '',
        timeout: 10000,
    };

    var CallStatus = {
        //初始状态
        CallIdle: 0,

        //正在呼出
        Dialing: 1,

        //正在呼入
        Incoming: 2,

        //收到一个通话呼入后，正在振铃
        Ringing: 3,

        //正在通话
        Active: 4,

        //已经挂断
        Hangup: 5,
    };

    var Reason = (function() {
        // key ：用描述和错误码组成，方便通过错错误码或者描述获取
        var result = {
            CANCEL1: {
                code: 1,
                info: '己方取消已发出的通话请求'
            },
            REJECT2: {
                code: 2,
                info: '己方拒绝收到的通话请求'
            },
            HANGUP3: {
                code: 3,
                info: '己方挂断'
            },
            BUSYLINE4: {
                code: 4,
                info: '己方忙碌'
            },
            NO_RESPONSE5: {
                code: 5,
                info: '己方未接听'
            },
            ENGINE_UN_SUPPORTED6: {
                code: 6,
                info: '己方不支持当前引擎'
            },
            NETWORK_ERROR7: {
                code: 7,
                info: '己方网络出错'
            },
            REMOTE_CANCEL11: {
                code: 11,
                info: '对方取消已发出的通话请求'
            },
            REMOTE_REJECT12: {
                code: 12,
                info: '对方拒绝收到的通话请求'
            },
            REMOTE_HANGUP13: {
                code: 13,
                info: '通话过程对方挂断'
            },
            REMOTE_BUSYLINE14: {
                code: 14,
                info: '对方忙碌'
            },
            REMOTE_NO_RESPONSE15: {
                code: 15,
                info: '对方未接听'
            },
            REMOTE_ENGINE_UN_SUPPORTED16: {
                code: 16,
                info: '对方不支持当前引擎'
            },
            REMOTE_NETWORK_ERROR17: {
                code: 17,
                info: '对方网络错误'
            },
            VOIP_NOT_AVALIABLE18: {
                code: 18,
                info: 'VoIP 不可以用'
            }
        };

        var getKey = function(key) {
            if (util.isNumber(key)) {
                util.forEach(result, function(reason, reasonKey) {
                    reasonKey.indexOf(key) > -1 && (key = reasonKey);
                });
            }
            return key;
        };

        var get = function(key) {
            key = getKey(key);
            return result[key];
        };

        return {
            get: get
        };
    })();

    var getToken = function(params, callback) {
        var channelId = params.channelId;
        params = {
            command: 'getToken',
            data: {
                channelId: channelId
            }
        };
        sendCommand(params, callback);
    };

    var array2Obj = function(arrs) {
        var obj = {};
        util.forEach(arrs, function(item) {
            obj[item] = item;
        });
        return obj;
    };

    var isGroup = function(type){
        return type == 3;
    };

    var inviteItem = {
        busy: function(message) {
            var reasonKey = 'BUSYLINE4'
            var reason = Reason.get(reasonKey);
            var callId = message.content.callId;

            var content = {
                callId: callId,
                reason: reason.code
            };

            var conversationType = message.conversationType;
            var targetId = message.targetId;

            var data = {
                conversationType: conversationType,
                targetId: targetId,
                content: content
            };
            var params = {
                command: 'hungup',
                data: data
            };

            sendCommand(params);
        },
        free: function(message) {
            commandWatcher.notify(message);

            cache.set('session', message);

            var sentTime = message.sentTime;
            var senderUserId = message.senderUserId;
            addUserRelation({
                sentTime: sentTime,
                senderUserId: senderUserId
            });

            var content = message.content;

            var callId = content.callId;

            var conversationType = message.conversationType;
            var targetId = message.targetId;

            var userIds = content.inviteUserIds;

            cache.set('inviteUsers', array2Obj(userIds));

            var mediaType = content.mediaType;
            var params = {
                conversationType: conversationType,
                targetId: targetId,
                userIds: userIds,
                mediaType: mediaType,
                status: CallStatus.Incoming
            };
            calcTimeout(params);

            var data = {
                conversationType: conversationType,
                targetId: targetId,
                content: {
                    callId: callId
                }
            };
            var params = {
                command: 'ringing',
                data: data
            };

            sendCommand(params);
        }
    };

    var addUserRelation = function(params) {
        var sentTime = params.sentTime;
        var senderUserId = params.senderUserId;
        var session = cache.get('session');
        var userId = sentTime & 0x7fffffff;

        session[senderUserId] = senderUserId;
        session[userId] = senderUserId;

    };

    var summayTimer = new Timer();

    var MessgeDirection = {
        SENT: 1,
        RECEIVED: 2
    };

    var stopItem = {
        single: function(message) {
            var senderUserId = message.senderUserId;
            var timer = callTimer[senderUserId];
            timer && timer.stop();
        },
        multi: function() {
            util.forEach(callTimer, function(timer) {
                timer.stop();
            });
            cache.remove('inviteUsers');
        }
    };
    var stopTimer = function(message) {
        var method = message ? 'single' : 'multi';
        stopItem[method](message);
    };

    var messageHandler = {
        InviteMessage: function(message) {
            var session = cache.get('session');

            var method = session ? 'busy' : 'free';

            inviteItem[method](message);

        },
        RingingMessage: function(message) {
            commandWatcher.notify(message);
        },
        AcceptMessage: function(message) {

            var session = cache.get('session');

            var already = session.already;

            var senderUserId = message.senderUserId;
            // 存储用户信息标识
            var sentTime = message.sentTime;
            addUserRelation({
                sentTime: sentTime,
                senderUserId: senderUserId
            });

            if (already) {
                return;
            }

            var content = message.content;

            message.callInfo = {
                mediaType: content.mediaType,
                status: CallStatus.Active
            };
            stopTimer(message);

            var channel = session.content.channelInfo;
            var channelId = channel.Id;

            // 过滤其他端的发送消息
            var callInfo = session.callInfo || {};
            if (!callInfo[channelId]) {
                return;
            }

            session.already = true;
            summayTimer.start();

            commandWatcher.notify(message);
        },
        HungupMessage: function(message) {

            var inviteUsers = cache.get('inviteUsers') || {};

            var senderUserId = message.senderUserId;
            var conversationType = message.conversationType;

            var isRecover = (!(senderUserId in inviteUsers) && isGroup(conversationType));
            if (isRecover) {
                return;
            }

            var session = cache.get('session');
            if (!session) {
                return;
            }

            var content = session.content;

            message.callInfo = {
                mediaType: content.mediaType,
                status: CallStatus.Hangup
            };

            stopTimer(message);
            var inviteUsers = cache.get('inviteUsers');
            delete inviteUsers[senderUserId];

            var isReceived = (message.messageDirection == MessgeDirection.RECEIVED);

            if (isReceived) {
                var content = message.content;
                var reasonCode = content.reason;

                var reasonItem = {
                    1: function(){
                        return Reason.get('REMOTE_CANCEL11');
                    },
                    2: function() {
                        return Reason.get('REMOTE_REJECT12');
                    },
                    3: function() {
                        return Reason.get('REMOTE_HANGUP13');
                    },
                    4: function() {
                        return Reason.get('REMOTE_BUSYLINE14');
                    },
                    15: function() {
                        return Reason.get('NO_RESPONSE15');
                    }
                };

                var getReason = reasonItem[reasonCode] || util.noop;
                var reason = getReason();
                content.reason = reason && reason.code || reasonCode;
                cache.set('hungupReason', content.reason);

            }
            commandWatcher.notify(message);

        },
        MediaModifyMessage: function(message) {
            commandWatcher.notify(message);
        },
        MemberModifyMessage: function(message) {
            inviteItem['free'](message);
        },
        otherMessage: function(message) {
            commandWatcher.notify(message);
        }
    };

    watch(function(message) {
        var messageType = message.messageType;
        messageType = messageType in messageHandler ? messageType : 'otherMessage';

        var handler = messageHandler[messageType];
        handler(message);
    });

    var getRoomId = function(params) {
        var random = Math.floor(Math.random() * 1000);
        var info = [params.conversationType, params.targetId, random];
        return info.join('_');
    };

    var sendCall = function(data, callback) {
        var content = data.content;
        var callId = content.callId;
        var mediaType = content.mediaType;
        var isSharing = data.isSharing;
        var inviteUserIds = content.inviteUserIds;

        var conversationType = data.conversationType;
        var targetId = data.targetId;

        cache.set('inviteUsers', array2Obj(inviteUserIds));

        var params = {
            command: 'invite',
            data: data
        };

        sendCommand(params, function(error, result) {
            var callInfo = {};
            callInfo[callId] = true;

            result.callInfo = callInfo;
            result.isSharing = isSharing;

            //主叫方 userId 为 inviterMessage.sentTime
            //被叫方 userId 为 AcceptMessage.sentTime
            var sentTime = result.sentTime;
            var senderUserId = result.senderUserId;

            cache.update('session', result);

            addUserRelation({
                sentTime: sentTime,
                senderUserId: senderUserId
            });

            var errorInfo = {
                code: error
            };

            result.params = {
                channelId: callId,
                userId: senderUserId,
                sentTime: sentTime,
                mediaType: mediaType,
                isSharing: isSharing
            };

            callback(errorInfo, result);

            var params = {
                conversationType: conversationType,
                targetId: targetId,
                userIds: inviteUserIds,
                timer: 10,
                mediaType: mediaType,
                status: CallStatus.Dialing
            };
            calcTimeout(params);
        });
    };

    var call = function(params, callback) {

        var cacheKey = 'session';

        var session = cache.get(cacheKey);
        if (session) {
            var key = 'BUSYLINE4';
            callback(Reason.get(key));
            return;
        }

        var engineType = params.engineType;

        cache.set(callback, params);

        callback = callback || util.noop;

        var conversationType = params.conversationType;
        var targetId = params.targetId;
        var inviteUserIds = params.inviteUserIds;
        var mediaType = params.mediaType;
        var isSharing = params.isSharing;

        var callId = getRoomId(params);
        var channel = {
            Key: '',
            Id: callId
        };

        var data = {
            isSharing: isSharing,
            conversationType: conversationType,
            targetId: targetId,
            content: {
                engineType: 3,
                inviteUserIds: inviteUserIds,
                mediaType: mediaType,
                callId: callId,
                channelInfo: channel
            }
        };

        sendCall(data, function(error, result) {
            if (error.code) {
                callback(error);
                return;
            }
            var params = result.params;
            params.engineType = engineType;
            initRoom(params);
        });
    };

    var sendInvite = function(data, callback) {
        var content = data.content;
        var inviteUserIds = content.inviteUserIds;

        var inviteUsers = cache.get('inviteUsers');
        util.forEach(inviteUserIds, function(userId) {
            inviteUsers[userId] = userId;
        });

        var params = {
            command: 'memberModify',
            data: data
        };

        sendCommand(params, function(error, result) {
            var sentTime = result.sentTime;
            var senderUserId = result.senderUserId;

            addUserRelation({
                sentTime: sentTime,
                senderUserId: senderUserId
            });

            var error = {
                code: error
            };

            callback(error, result);

            var params = {
                conversationType: conversationType,
                targetId: targetId,
                userIds: inviteUserIds,
                timer: 10,
                mediaType: mediaType,
                status: CallStatus.Dialing
            };
            calcTimeout(params);
        });
    };

    var invite = function(params, callback) {
        var cacheKey = 'session';

        var session = cache.get(cacheKey);

        var info = 'Invite: Not call yet';
        checkSession({
            session: session,
            info: info
        });

        callback = callback || util.noop;

        var session = cache.get('session');
        var conversationType = params.conversationType;
        var targetId = params.targetId;

        var content = session.content;
        var callId = content.callId;

        var caller = session.senderUserId;
        var engineType = params.engineType;
        var channel = {
            Key: '',
            Id: callId
        };

        var mediaType = params.mediaType;
        var inviteUserIds = params.inviteUserIds;
        var isSharing = params.isSharing;

        var modifyMemType = 1;


        var existList = [];

        util.forEach(callTimer, function(timer, userId) {
            var member = {
                userId: userId,
                mediaId: '',
                mediaType: timer.mediaType,
                callStatus: timer.status
            };
            existList.push(member);
        });

        var data = {
            conversationType: conversationType,
            targetId: targetId,
            content: {
                modifyMemType: modifyMemType,
                callId: callId,
                caller: caller,
                engineType: engineType,
                channelInfo: channel,
                mediaType: mediaType,
                inviteUserIds: inviteUserIds,
                existedMemberStatusList: existList
            }
        };

        sendInvite(data, callback);
    };
    // params.info
    // params.position
    var errorHandler = function(params) {
        var info = params.info;
        throw new Error(info);
    };

    var checkSession = function(params) {
        if (!params.session) {
            errorHandler(params);
        }
    };

    var sendAccept = function(params) {
        var conversationType = params.conversationType;
        var targetId = params.targetId;

        var mediaType = params.mediaType;
        var isSharing = params.isSharing;

        var session = cache.get('session');

        var from = params.from;
        var info = from + ': Not call yet';
        checkSession({
            session: session,
            info: info
        });

        var engineType = params.engineType;

        var content = session.content;
        var callId = content.callId;

        params = {
            command: 'accept',
            data: {
                conversationType: conversationType,
                targetId: targetId,
                content: {
                    callId: callId,
                    mediaType: mediaType
                }
            }
        };

        sendCommand(params, function(error, command) {
            var sentTime = command.sentTime;
            var channelId = content.callId;
            var userId = command.senderUserId;

            command.callInfo = {
                mediaType: content.mediaType,
                status: CallStatus.Active
            };

            stopTimer(command);

            addUserRelation({
                sentTime: sentTime,
                senderUserId: userId
            });

            var params = {

                channelId: channelId,
                userId: userId,
                sentTime: sentTime,
                mediaType: mediaType,
                isSharing: isSharing,
                engineType: engineType
            };
            initRoom(params);
            summayTimer.start();
        });
    };

    var accept = function(params) {
        params.form = 'accept';
        sendAccept(params);
    };

    var join = function(params) {
        params.form = 'join';
        sendAccept(params);
    };

    var sendHungup = function(params, callback) {
        callback = callback || util.noop;

        var session = cache.get('session');

        var from = params.from;
        var info = from + ': Not call yet';
        checkSession({
            session: session,
            info: info
        });

        var callId = session.content.callId;
        var callId = callId;

        var conversationType = session.conversationType;
        var targetId = session.targetId;

        var reason = Reason.get(reasonKey);

        params = {
            command: 'hungup',
            data: {
                conversationType: conversationType,
                targetId: targetId,
                content: {
                    callId: callId,
                    reason: reason.code
                }
            }
        };

        sendCommand(params, function(error, result) {

            var timer = summayTimer.stop();

            var caller = session.senderUserId;

            var inviter = session.senderUserId;

            var content = session.content;
            var mediaType = content.mediaType;

            var inviteUserIds = content.inviteUserIds;

            var summary = {
                conversationType: conversationType,
                targetId: targetId,
                messageDirection: session.messageDirection,
                content: {
                    caller: caller,
                    inviter: inviter,
                    mediaType: mediaType,
                    startTime: timer.start,
                    duration: timer.duration,
                    status: reason.code,
                    memberIdList: inviteUserIds,
                },
                senderUserId: inviter,
                messageType: 'SummaryMessage'
            };

            commandWatcher.notify(summary);

            var error = null;

            callback(error, summary);

            room.reset();
        });

        quitRoom({
            roomId: callId
        });

        stopTimer();
    };

    var hungup = function(params, callback) {
        params.from = 'hungup';
        var key = 'CANCEL1';
        util.forEach(callTimer, function(timer){
            if (timer.status == CallStatus.Active) {
                key = 'HANGUP3';
            }
        });

        key = cache.get('hungupReason') || key;

        params.reasonKey = key;
        sendHungup(params, callback);
    };

    var reject = function(params) {
        params = params || {};
        params.from = 'reject';
        params.reasonKey = 'REJECT2';
        sendHungup(params);
    };

    var quit = function(params, callback) {
        params.reasonKey = 'HANGUP3';
        sendHungup(params, callback);
    };

    var mute = function() {
        var params = {
            isEnabled: false
        };
        enableAudio(params);
    };

    var unmute = function() {
        var params = {
            isEnabled: true
        };
        enableAudio(params);
    };

    var sendMediaModifyMessage = function(mediaType) {
        var session = cache.get('session');
        var content = session.content;
        var callId = content.callId;
        var mediaType = mediaType;
        var conversationType = session.conversationType;
        var targetId = session.targetId;

        var params = {
            command: 'mediaModify',
            data: {
                conversationType: conversationType,
                targetId: targetId,
                content: {
                    callId: callId,
                    mediaType: mediaType
                }
            }
        };

        sendCommand(params);
    };

    var videoToAudio = function() {
        var params = {
            isEnabled: false
        };
        enableVideo(params);
        // TODO
        var mediaType = 1;
        sendMediaModifyMessage(mediaType);
    };

    var audioToVideo = function() {
        var params = {
            isEnabled: true
        };
        enableVideo(params);
        // TODO
        var mediaType = 2;
        sendMediaModifyMessage(mediaType);
    };

    var setConfig = function(cfg) {
        util.extend(config, cfg);
    };

    var videoWatch = function(watcher) {
        videoWatcher.add(watcher);
    };

    var commandWatch = function(watcher) {
        commandWatcher.add(watcher);
    };

    global.RongCallLib = {
        setConfig: setConfig,
        videoWatch: videoWatch,
        commandWatch: commandWatch,

        call: call,
        invite: invite,
        hungup: hungup,
        reject: reject,
        join: join,
        mute: mute,
        unmute: unmute,
        videoToAudio: videoToAudio,
        audioToVideo: audioToVideo,
        accept: accept
    };
})({
    win: window,
    RongCallUtil: RongCallUtil,
    MessageCtrl: MessageCtrl
});