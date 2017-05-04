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
    var _util = {
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
                callback(arr[i], index);
            }
        },
        noop: function() {

        },
        config: {
            localWindow: null,
            getRemoteWindow: function() {

            },
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
        timeoutMillis: 15000,
        timer: {
            timeout: 0,
            resumeTimer: function(callback, second){
                this.timeout = setTimeout(function(){
                    callback();
                }, second);
            },
            pauseTimer: function(){
                clearTimeout(this.timeout);
            }
        }
    };

    var Reason = {
        CANCEL: {
            code: 1,
            info: '己方取消已发出的通话请求'
        },
        REJECT: {
            code: 2,
            info: '己方拒绝收到的通话请求'
        },
        HANGUP: {
            code: 3,
            info: '己方挂断'
        },
        BUSYLINE: {
            code: 4,
            info: '己方忙碌'
        },
        NO_RESPONSE: {
            code: 5,
            info: '己方未接听'
        },
        ENGINE_UN_SUPPORTED: {
            code: 6,
            info: '己方不支持当前引擎'
        },
        NETWORK_ERROR: {
            code: 7,
            info: '己方网络出错'
        },
        REMOTE_CANCEL: {
            code: 11,
            info: '对方取消已发出的通话请求'
        },
        REMOTE_REJECT: {
            code: 12,
            info: '对方拒绝收到的通话请求'
        },
        REMOTE_HANGUP: {
            code: 13,
            info: '通话过程对方挂断'
        },
        REMOTE_BUSYLINE: {
            code: 14,
            info: '对方忙碌'
        },
        REMOTE_NO_RESPONSE: {
            code: 15,
            info: '对方未接听'
        },
        REMOTE_ENGINE_UN_SUPPORTED:{
            code: 16,
            info: '对方不支持当前引擎'
        },
        REMOTE_NETWORK_ERROR: {
            code: 17,
            info: '对方网络错误'
        },
        VOIP_NOT_AVALIABLE: {
            code: 18,
            info: 'VoIP 不可以用'
        }
    };

    var _getThubnailId = function(stream){
        return 'video-' + stream.getGlobalID();
    };

    var Participant = {
        parent: null,
        // 存放所有视频节点 {domId: video}
        children: { },
        thubnailId:'',
        setMain: function(stream){
            
            var element = _util.config.element;
            
            var thubnailId = _getThubnailId(stream);
            
            element.id = element.id || thubnailId;

            stream.playOnlyVideo(element.id, thubnailId);
        },
        add: function(stream){

            var element = _util.config.element;
            var getElement = _util.config.getElement;

            var node = getElement();

            var child = node.child;
            var parent = node.parent;

            var thubnailId = _getThubnailId(stream);

            child.id = thubnailId;
            parent.append(child);

            stream.playThumbnail(thubnailId);

            this.children[thubnailId] = child;
            this.parent = parent;
        },
        removeAll: function(){
            var that = this;
            
            _util.forEach(that.children, function(childId, child){
                delete that.children[childId];
                that.parent.removeChild(child);
            });

            var element = _util.config.element;
            // 主窗体的 Id 必须置空。
            element.id = '';
        },
        remove: function(stream){
            var thubnailId = _getThubnailId(stream);
            var child = this.children[thubnailId];
            this.parent.removeChild(child);
            delete this.children[thubnailId];
        }
    };

    var kurento, localStream;

    var _initRoom = function(params){

        var url =  _util.config.url;

        kurento = KurentoRoom(url, function (error, kurento) {

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
                    _util.each(streams, function(stream){
                         Participant.add(stream);
                    });
                },
                'stream-published': function(streamEvent){
                    Participant.add(localStream);
                    Participant.setMain(localStream);
                },
                'stream-added': function(streamEvent){
                    Participant.add(streamEvent.stream);
                },
                'stream-removed': function(streamEvent){
                    Participant.remove(streamEvent.stream);
                },
                'newMessage': function(msg){

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
                
                _util.forEach(eventFactory, function(eventName, event){
                     room.addEventListener(eventName, event);
                });

                room.connect();
            });

            localStream.addEventListener("access-denied", function(){

            });

            localStream.init();
        });
    };

    var roomTools = {
        isActive: false,
        init : function(params){
            if (this.isActive) {
                return;
            }
            _initRoom(params);
            this.isActive = true;
        },
        reset: function(){
            this.isActive = false;
        }
    };

    var cache = _util.cache;

    /*
        根据 MessageType 返回 message 对象
        var params = {
            messageType:'TextMessage',
            content: { content: 'hello'}    // 消息体
        };
        var textMsg = _messageFactory(params);

    */
    var _messageFactory = function(params) {
        var content = params.content;
        var messageTypes = _util.config.messageTypes;

        var message = messageTypes[params.messageType] || _util.noop;
        return new message(content);
    };

    var _sendMessage = function(params, callback){
        callback = callback || _util.noop;

        var send = _util.config.send;
        
        var session = cache.get('session');

        var msg = _messageFactory(params);
        params = {
            msg: msg,
            conversationType: session.conversationType,
            targetId: session.targetId
        };
        send(params, callback);
    };

    var _pauseTimer = function(){
        var timer = _util.timer;
        timer.pauseTimer();
    };

    var getChannelId = function(params){
        var info = [params.conversationType, params.targetId];
        return info.join('_');
    };
    
    var _clearSession = function(){
        cache.remove('session');
    };

    // params.info
    // params.position
    var _errorHandler = function(params){
        var info = params.info;
        throw new Error(info);
    };

    var _checkSession = function(params){
        if (!params.session) {
            _errorHandler(params);
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
            callback(Reason.BUSYLINE)
            return;
        }

        var channelId = getChannelId(params);

        var channel = {
            Key: '',           
            Id: channelId      
        };
        var userId = _util.config.userId;
        params.content = {
            engineType: params.engineType,
            callId: userId,
            channelInfo: channel,
            inviteUserIds: params.inviteUserIds
        };

        cache.set('session', params);
        var timer = _util.timer;

        var showResult = function(reason){
             _clearSession();
             callback(reason);
        };

        _sendMessage(params, function(error, result){
            if (error) {
                showResult(error);
                return;
            }
            var timeoutMillis = _util.timeoutMillis;
            timer.resumeTimer(function(){
                showResult(Reason.REMOTE_NO_RESPONSE);
            }, timeoutMillis);

        });
    };

    var _disconnect = function(){
        kurento && kurento.close();
        Participant && Participant.removeAll();
    };
    
    var _sendHungup = function(from){
        var session = cache.get('session');

        var info = from + ': Not call yet';
        _checkSession({
            session: session,
            info: info
        });

        var channel = session.content.channelInfo;

        var content = { callId: channel.Id, reason: Reason.REMOTE_HANGUP };

        var params = {
            content: content,
            messageType: 'HungupMessage'
        };

        _sendMessage(params, function(){
            _clearSession();
            roomTools.reset();
        });
    };

    var hungup = function() {
        _disconnect();
        var from = 'hungup';
        _sendHungup(from);   
    };

    var reject = function(){
         var from = 'reject';
        _sendHungup(from); 
    };

    var _sendAccept = function(params){

        var session = cache.get('session');

        var info = params.from + ': Not received InviteMessage yet';
        _checkSession({
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

        _sendMessage(params);
        
        var channelId = message.channelInfo.Id;
        var userId = _util.config.userId;
        params = {
            channelId: channelId,
            userId: userId,
            mediaType: mediaType
        };
        roomTools.init(params);
    };
    /*
        params.mediaType
    */
    var accept = function(params){
        params.from = 'accept';
        _sendAccept(params);
    };

    /*
        params.mediaType
     */   
    var join = function(params) {
        params.from = 'join';
        _sendAccept(params);
    };

    var quit = function(){
        _disconnect();
        var from = 'quit';
        _sendHungup(from); 
    };

    var _getRtcPeer = function(params){

        if (!localStream) {
            var info = params.info || 'Not call yet, please call first.';
            info = params.from + ': ' + info;
            _errorHandler({ info: info});
        }
        
        return localStream.getWebRtcPeer();
    };

    var mute = function() {
        var params = {
            from: 'mute'
        };
        _getRtcPeer(params).audioEnabled = false;
    };

    var unmute = function() {
        var params = {
            from: 'unmute'
        };
        _getRtcPeer(params).audioEnabled = true;
    };

    var videoToAudio = function() {
        var params = {
            from: 'videoToAudio'
        };
        _getRtcPeer(params).videoEnabled = false;
    };

    var audioToVideo = function() {
        var params = {
            from: 'audioToVideo'
        };
        _getRtcPeer(params).videoEnabled = true;
    };

    var _messageHandler = {

        InviteMessage: function(message){
            cache.set('session', message);

            var callId = message.content.callId;

            var params = {
                content: { callId: callId},
                messageType: 'RingingMessage',
                conversationType: message.conversationType,
                targetId: message.targetId
            };
            _sendMessage(params);

        },

        RingingMessage: function(message){
            // Ringing
        },

        AcceptMessage: function(message){
            _pauseTimer();

            var session = cache.get('session');
            var content = session.content;

            var channelId = content.channelInfo.Id;
            var userId = _util.config.userId;
            var mediaType = message.content.mediaType;

            var params = {
                channelId: channelId,
                userId: userId,
                mediaType: mediaType
            };
            roomTools.init(params);
        },

        HungupMessage: function(message){
            _pauseTimer();
            roomTools.reset();
        },

        MediaModifyMessage: function(message){
            
        },

        MemberModifyMessage: function(message){

        },

        SummaryMessage: function(message){

        }

    };

    var onMsgWatch = function(message) {
        var handler = _messageHandler[message.messageType];
        handler && handler(message);
    };

    var setConfig = function(cfg){
        var config = _util.config;
        _util.merge(cfg, config);
        config.msgWatch && config.msgWatch(onMsgWatch);
    };

    var setDirective = function(opt){
        _util.merge(opt, _util.config);
    };
    // TODO  SummaryMessage 广播
    var watcher = {
        watchers: [],
        add: function(listener){
            watchers.push(listener);
        },
        notify: function(val){
            _util.each(this.watchers, function(event){
                event(val);
            });
        }
    };

    var watch = function(listener){
        watcher.add(listener);
    };

    return {
        setConfig: setConfig,
        setDirective: setDirective,
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
        watch: watch
    };

}, 'RongCallLib');