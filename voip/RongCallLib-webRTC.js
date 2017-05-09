/*
使用流程：
    1、安装插件
    2、引入　Agora SDK
    3、引入 RongIMCallLib

开发流程：
    1、获取 Agora 最新插件、SDK
    2、设计暴露方式、API
    3、伪代码、Demo
    4、实现
约定：
    1、所有依赖通过参数传入
    2、所有 callback 第一个参数是 error， 第二个是返回值
    3、内部使用方法 “ _ ” 加以区分
*/

"use strict";

;(function(dependencies, factory, namespace) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        
        var KurentoRoom = require('KurentoRoom');
        
        module.exports = factory(KurentoRoom);

    } else if (typeof define === 'function' && define.amd) {
        define(['KurentoRoom'], factory);
    } else {
        var global = dependencies.global;
        var KurentoRoom = dependencies.KurentoRoom;
        global[namespace] = factory(RongIMLib, KurentoRoom);
    }
})({
    global: window,
    KurentoRoom: KurentoRoom
}, function() {
    var util = {
        merge: function(source, target) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        },
        forEach: function(obj, callback){
            for(var key in obj){
                callback(key, obj[key]);
            }
        },
        each: function(arr, callback){
            for(var i = 0, len = arr.length; i < len; i++){
                callback(arr[i], i);
            }
        },
        calc: function(a, b){
            return a & b;
        },
        noop: function() {

        },
        // TODO 扩展
        isExist: function(key, obj){
            return key in obj;
        },
        isNumberic: function(obj){
            var type = typeof obj;
            return ( type === "number" || type === "string" ) && !isNaN( obj - parseFloat( obj ) );
        },
        getPrototype: function(obj){
            return Object.prototype.toString.call(obj);
        },
        config: {
            messageTypes: {},
            send: null,
            userId: ''
        },
        cache: {
            store: {},
            set: function(key, value){
                this.store[key] = value;
            },
            get: function(key){
                return this.store[key];
            },
            remove: function(key){
                delete this.store[key];
            }
        },
        // 毫秒
        timeout: 1500000
    };

    function Timer(){
        this.timout = 0;
        this.startTime = 0;
        this.start = function(callback, second){
            second = second || 0;
            
            if (callback) {
                this.timeout = setTimeout(function(){
                    callback();
                }, second);
            }
            
           this.startTime = +new Date;
        };
        
        this.stop = function(callback){
            
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

    var Reason = (function(){
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
            REMOTE_ENGINE_UN_SUPPORTED16:{
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

        var getKey = function(key){
            if (util.isNumberic(key)) {
                util.forEach(result, function(reasonKey){
                    reasonKey.indexOf(key) > -1 && (key = reasonKey);
                });
            }
            return key;
        };

        var get = function(key){
            key = getKey(key);
            return result[key];
        };

        return {
            get: get   
        };
    })();
    // 前缀标识
    var getThubnailId = function(stream){
        return 'video-' + stream.getGlobalID();
    };

    var Participant = {
        parent: null,
        // 存放所有视频节点 {domId: video}
        children: { },
        streams: { },
        thubnailId:'',
        setMain: function(stream){
            var that = this;
            var getStream = function(stream){
                
                var streams = that.streams;
                
                var element = util.config.element;

                var streamItem = {
                    node: function(node){
                        var thubnailId = node.id;
                        
                        var isExist = util.isExist(thubnailId, streams);

                        if (isExist) {
                            element.innerHTML = '';
                            return streams[thubnailId];
                        }else{
                            throw new Error('element is not exist.');
                        }

                    },
                    stream: function(stream){
                        return stream;
                    }
                };

                var method = util.getPrototype(stream) == '[object HTMLDivElement]' ? 'node' : 'stream';

                return streamItem[method](stream);
            };

            stream = getStream(stream);

            var thubnailId = getThubnailId(stream);
            
            element.id = element.id || thubnailId;

            stream.playOnlyVideo(element, thubnailId);
        },
        add: function(stream){

            var element = util.config.element;
            var getElement = util.config.getElement;

            var node = getElement();

            var child = node.child;
            var parent = node.parent;

            var thubnailId = getThubnailId(stream);

            this.streams[thubnailId] = stream;

            child.id = thubnailId;
            parent.append(child);

            stream.playThumbnail(child);

            this.children[thubnailId] = child;
            this.parent = parent;
        },
        _clear: function(key){
            delete this.children[key];
            delete this.streams[key];
        },
        // 根据 Dom 节点删除所有视频
        removeAll: function(){
            var that = this;
            
            util.forEach(that.children, function(childId, child){
                that.parent.removeChild(child);
                that._clear(childId);
            });

            var element = util.config.element;
            // 主窗体的 Id 必须置空。
            element.id = '';
        },
        // 根据 stream 删除视频
        remove: function(stream){
            var thubnailId = getThubnailId(stream);
            var child = this.children[thubnailId];
            child && this.parent.removeChild(child);
            this._clear(thubnailId);
        }
    };

    var videoRoom, localStream;

    var initRoom = function(params){

        var url =  util.config.url;
        videoRoom = KurentoRoom(url, function (error, kurento) {

            if (error)
                return console.log(error);

            //TODO token should be generated by the server or a 3rd-party component  
            //kurento.setRpcParams({token : "securityToken"});
            
            var roomId = params.channelId;
            var userId = params.userId;

            var room = kurento.Room({
                room: roomId,
                user: userId
            });

            localStream = kurento.Stream(room, {
                audio: true,
                video: true,
                data: false
            });

            var eventFactory = {
                'room-connected': function (roomEvent) {
                    localStream.publish();
                    var streams = roomEvent.streams;
                    util.each(streams, function(stream){
                        Participant.add(stream);
                    });
                },
                'stream-published': function(streamEvent){
                    // Participant.add(localStream);
                    Participant.setMain(localStream);
                },
                'stream-added': function(streamEvent){
                    Participant.add(streamEvent.stream);
                },
                'stream-removed': function(streamEvent){
                    Participant.remove(streamEvent.stream);
                },
                'new-message': function(msg){

                },
                'error-room': function(error){

                },
                'error-media': function(msg){

                },
                'room-closed': function(msg){

                },
                'lost-connection': function(msg){
                    kurento.close(true);
                },
                'stream-stopped-speaking': function(participantId){

                },
                'stream-speaking': function(participantId){

                },
                'update-main-speaker': function(participantId){

                }
            };

            localStream.addEventListener("access-accepted", function () {
                
                util.forEach(eventFactory, function(eventName, event){
                     room.addEventListener(eventName, event);
                });

                room.connect();
            });

            localStream.addEventListener("access-denied", function(){

            });

            var config = util.config;

            var videoItem = {
                1: false, 
                2: {
                    width: {
                        ideal: 1280 || config.width
                    },
                    frameRate: {
                        ideal: 15 || config.rate
                    }
                }
            };

            var video = videoItem[params.mediaType];
            var constraints = {
                audio: true,
                video: video
            };
            localStream.init(constraints);
        });
    };

    var roomClient = {
        isActive: false,
        init : function(params){
            if (this.isActive) {
                return;
            }
            initRoom(params);
            this.isActive = true;
        },
        reset: function(){
            this.isActive = false;
        }
    };

    var cache = util.cache;

    /*
        根据 MessageType 返回 message 对象
        var params = {
            messageType:'TextMessage',
            content: { content: 'hello'}    // 消息体
        };
        var textMsg = messageFactory(params);

    */
    var messageFactory = function(params) {
        var content = params.content;
        var messageTypes = util.config.messageTypes;

        var message = messageTypes[params.messageType] || util.noop;
        return new message(content);
    };

    var sendMessage = function(params, callback){
        callback = callback || util.noop;

        var send = util.config.send;
        
        var session = cache.get('session') || params;

        var msg = messageFactory(params);
        params = {
            msg: msg,
            conversationType: session.conversationType,
            targetId: session.targetId
        };
        send(params, callback);
    };

    var callTimer = new Timer();

    var stopCallTimer = function(){
        callTimer.stop();
    };

    var getChannelId = function(params){
        var info = [params.conversationType, params.targetId];
        return info.join('_');
    };
    
    var clearSession = function(){
        cache.remove('session');
    };

    // params.info
    // params.position
    var errorHandler = function(params){
        var info = params.info;
        throw new Error(info);
    };

    var checkSession = function(params){
        if (!params.session) {
            errorHandler(params);
        }
    };
    /*
        params.conversationType
        params.targetId
        params.callId // 发起人 Id
        params.inviteUserIds
     */
    var call = function(params, callback) {
        params.engineType = 2;
        
        params.messageType = 'InviteMessage';

        var session = cache.get('session');

        if (session) {
            var reasonKey = 'BUSYLINE4';
            callback(Reason.get(reasonKey))
            return;
        }

        var channelId = getChannelId(params);

        var channel = {
            Key: '',           
            Id: channelId      
        };
        var callId = channelId;
        params.content = {
            engineType: params.engineType,
            callId: callId,
            channelInfo: channel,
            inviteUserIds: params.inviteUserIds,
            mediaType: params.mediaType
        };

        var timer = util.timer;

        var showResult = function(reason){
             clearSession();
             callback(reason);
        };

        sendMessage(params, function(error, result){
            if (error) {
                showResult(error);
                return;
            }
            cache.set('session', result);
            var timeout = util.timeout;
            callTimer.start(function(){
                var reasonKey = 'REMOTE_NO_RESPONSE15';
                showResult(Reason.get(reasonKey));
            }, timeout);

        });
    };

    var disconnect = function(){
        videoRoom && videoRoom.close();
        Participant && Participant.removeAll();
    };
    
    var sendHungup = function(from){
        var session = cache.get('session');

        var info = from + ': Not call yet';
        checkSession({
            session: session,
            info: info
        });

        var channel = session.content.channelInfo;

        var reasonKey = 'REMOTE_HANGUP13'
        var reason = Reason.get(reasonKey);

        var content = { callId: channel.Id, reason: reason.code };

        var params = {
            content: content,
            messageType: 'HungupMessage'
        };

        sendMessage(params, function(){
            clearSession();
            roomClient.reset();

            var caller = session.senderUserId;
            var inviter = session.senderUserId;
            var mediaType = session.content.mediaType;
            var reason = Reason.get('HANGUP3');
            var inviteUserIds = session.content.inviteUserIds;

            var params = {
                content: {
                    caller: caller,
                    inviter: inviter,
                    mediaType: mediaType,
                    startTime: +new Date,
                    duration: 0,
                    status: reason,
                    memberIdList: inviteUserIds
                },
                messageType: 'SummaryMessage'
            };

            var summaryMessage = messageFactory(params);
            watcher.notify(summaryMessage);
        });
    };

    var hungup = function() {
        disconnect();
        var from = 'hungup';
        sendHungup(from);   
    };

    var reject = function(){
         var from = 'reject';
        sendHungup(from); 
    };

    var summayTimer = new Timer();

    var sendAccept = function(params){

        var session = cache.get('session');

        var info = params.from + ': Not received InviteMessage yet';
        checkSession({
            session: session,
            info: info
        });

        var message = session.content;

        var mediaType = params.mediaType;
        var content = { callId: message.callId, mediaType: mediaType};
        var params = {
            content: content,
            messageType: 'AcceptMessage'
        };

        sendMessage(params, function(error, result){
            var channelId = message.channelInfo.Id;
            var userId = util.calc(result.sentTime, 0x7fffffff);
            params = {
                channelId: channelId,
                userId: userId,
                mediaType: mediaType
            };

            roomClient.init(params);
            
            summayTimer.start();
        });
    };
    /*
        params.mediaType
    */
    var accept = function(params){
        params.from = 'accept';
        sendAccept(params);
    };

    /*
        params.mediaType
     */   
    var join = function(params) {
        params.from = 'join';
        sendAccept(params);
    };

    var quit = function(){
        disconnect();
        var from = 'quit';
        sendHungup(from); 
    };

    var getRtcPeer = function(params){

        if (!localStream) {
            var info = params.info || 'Not call yet, please call first.';
            info = params.from + ': ' + info;
            errorHandler({ info: info});
        }
        
        return localStream.getWebRtcPeer();
    };

    var mute = function() {
        var params = {
            from: 'mute'
        };
        getRtcPeer(params).audioEnabled = false;
    };

    var unmute = function() {
        var params = {
            from: 'unmute'
        };
        getRtcPeer(params).audioEnabled = true;
    };

    var videoToAudio = function() {
        var params = {
            from: 'videoToAudio'
        };
        getRtcPeer(params).videoEnabled = false;
    };

    var audioToVideo = function() {
        var params = {
            from: 'audioToVideo'
        };
        getRtcPeer(params).videoEnabled = true; 
    };

    var watcher = {
        watchers: [],
        add: function(listener){
            this.watchers.push(listener);
        },
        notify: function(val){
            util.each(this.watchers, function(event){
                event(val);
            });
        }
    };

    var watch = function(listener){
        watcher.add(listener);
    };

    var movieItem = {
        1: function(message){
            videoToAudio();
        },
        2: function(message){
            audioToVideo();
        }
    };

    var inviteItem = {
        busy: function(message){
            var reasonKey = 'REMOTE_BUSYLINE14'
            var reason = Reason.get(reasonKey);
            var channel = message.content.channelInfo;

            var content = { callId: channel.Id, reason: reason.code };

            var params = {
                content: content,
                messageType: 'HungupMessage',
                conversationType: message.conversationType,
                targetId: message.targetId
            };
            sendMessage(params);
        },
        free: function(message){

            cache.set('session', message);

            var callId = message.content.callId;

            var params = {
                content: { callId: callId},
                messageType: 'RingingMessage',
                conversationType: message.conversationType,
                targetId: message.targetId
            };
            sendMessage(params);
        }
    };

    var messageHandler = {

        InviteMessage: function(message){

            var session = cache.get('session');

            var method = session ? 'busy' : 'free';

            inviteItem[method](message);
        },

        RingingMessage: function(message){
            
        },

        AcceptMessage: function(message){
            stopCallTimer();

            var session = cache.get('session');
            var content = session.content;

            var channelId = content.channelInfo.Id;
            var userId = util.calc(session.sentTime, 0x7fffffff);
            var mediaType = message.content.mediaType;

            var params = {
                channelId: channelId,
                userId: userId,
                mediaType: mediaType
            };
            roomClient.init(params);
            summayTimer.start();
        },

        HungupMessage: function(message){
            stopCallTimer();
            roomClient.reset();
            var summerTime = summayTimer.stop();

            var session = cache.get('session');

            if (session) {
                return;
            }

            var content = session.content;
            var mediaType = content.mediaType;
            var memberIdList = content.inviteUserIds;

            var caller = session.senderUserId;
            var duration = Math.floor(summerTime.duration / 1000);
            var reason = message.content.reason;

            var params = {
                content: {
                    caller: caller,
                    inviter: message.targetId,
                    mediaType: mediaType,
                    startTime: summerTime.start,
                    duration: duration,
                    status: Reason.get(reason),
                    memberIdList: memberIdList
                },
                messageType: 'SummaryMessage'
            };

            var summaryMessage = messageFactory(params);
            watcher.notify(summaryMessage);
        },

        MediaModifyMessage: function(message){
            var mediaType = message.content.mediaType;
            movieItem[mediaType](message);
        },

        MemberModifyMessage: function(message){

        }

    };

    var onMsgWatch = function(message) {
        var handler = messageHandler[message.messageType];
        handler && handler(message);
    };

    var setConfig = function(cfg){
        var config = util.config;
        util.merge(cfg, config);
        config.msgWatch && config.msgWatch(onMsgWatch);
    };

    var setDirective = function(opt){
        util.merge(opt, util.config);
    };

    var setMainWindow = function(node){
        Participant.setMain(node);
    };
    
    return {
        call: call,
        hungup: hungup,
        reject: reject,
        accept: accept,
        join: join,
        quit: quit,
        mute: mute,
        unmute: unmute,
        videoToAudio: videoToAudio,
        audioToVideo: audioToVideo,

        setConfig: setConfig,
        setDirective: setDirective,
        setMainWindow: setMainWindow,
        watch: watch
    };

}, 'RongCallLib');