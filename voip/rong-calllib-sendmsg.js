"use strict";;
(function(dependencies) {

    var global = dependencies.global;
    var util = global._;

    var callUtil = dependencies.RongCallUtil;
    var MsgObserverList = callUtil.ObserverList;

    var RongIMLib = dependencies.RongIMLib;
    var RongIMClient = RongIMLib.RongIMClient;

    var messageTypes = {
        AcceptMessage: RongIMLib.AcceptMessage,
        RingingMessage: RongIMLib.RingingMessage,
        SummaryMessage: RongIMLib.SummaryMessage,
        HungupMessage: RongIMLib.HungupMessage,
        InviteMessage: RongIMLib.InviteMessage,
        MediaModifyMessage: RongIMLib.MediaModifyMessage,
        MemberModifyMessage: RongIMLib.MemberModifyMessage
    };

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
        var message = messageTypes[params.messageType] || util.noop;
        return new message(content);
    };

    var sendMessage = function(params, callback) {
        callback = callback || util.noop;

        var msg = messageFactory(params);

        var conversationType = params.conversationType;
        var targetId = params.targetId;

        var im = RongIMClient.getInstance();
        im.sendMessage(conversationType, targetId, msg, {
            onSuccess: function(message) {
                var error = null;
                callback(error, message);
            },
            onError: function(code) {
                callback(code);
            }
        });
    };

    var commandItem = {
          /*
            params.conversationType
            params.targetId
            params.content
         */
        invite: function(params, callback) {
            params.messageType = 'InviteMessage';
            sendMessage(params, callback);
        },
        ringing: function(params, callback){
            params.messageType = 'RingingMessage';
            sendMessage(params, callback);
        },
        /*
            params.conversationType
            params.targetId
            params.content
         */
        accept: function(params, callback) {
            params.messageType = 'AcceptMessage';
            sendMessage(params, callback);
        },

         /*
            params.conversationType
            params.targetId
            params.content
         */
        hungup: function(params, callback) {
            params.messageType = 'HungupMessage';
            sendMessage(params, callback);
        },
        /*
            params.conversationType
            params.targetId
            params.content
         */
        mediaModify: function(params, callback) {
            params.messageType = 'MediaModifyMessage';
            sendMessage(params, callback);
        },
        memberModify: function(params, callback) {
            params.messageType = 'MediaModifyMessage';
            sendMessage(params, callback);
        }
    };
    /*
        var params = {
            command: 'invite' | 'ringing' | 'accept' | 'hungup' | 'mediaModify' | 'memberModify',
            data: {
                conversationType: 1,
                targetId: '',
                content: {}
            }
        };
     */
    var sendCommand = function(params, callback) {
        var command = params.command;
        var data = params.data;
        commandItem[command] && commandItem[command](data, callback);
    };

    var watcher = new MsgObserverList();

    var watch = function(listener) {
        watcher.add(listener);
    };

    // WebSDK VoIP message adapter.
    RongIMClient._voipProvider = {
        onReceived: function(message) {
            if (message.offLineMessage) {
                return;
            }
            watcher.notify(message);
        }
    };

    global.MessageCtrl = {
        sendCommand: sendCommand,
        watch: watch
    };

})({
    global: window,
    RongIMLib: RongIMLib,
    RongCallUtil: RongCallUtil
});