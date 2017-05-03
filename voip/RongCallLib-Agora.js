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
        
        var AgoraRTC = require('AgoraRTC');
        
        module.exports = factory(AgoraRTC);

    } else if (typeof define === 'function' && define.amd) {
        define(['AgoraRTC'], factory);
    } else {
        var global = dependencies.global;
        var AgoraRTC = dependencies.AgoraRTC;
        global[namespace] = factory(RongIMLib, AgoraRTC);
    }
})({
    global: window,
    AgoraRTC: AgoraRTC
}, function() {
    var _util = {
        merge: function(source, target) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        },
        noop: function() {

        },
        config: {
            localWindow: null,
            getRemoteWindow: function() {

            },
            message: {
                types: {},
                send: null
            }
        }
    };
    var _onReceived = function(message) {

    };

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
        var messageTypes = _util.config.message.types;

        var message = messageTypes[params.messageType] || _util.noop;
        return new message(content);
    };

    var client = _util.client = AgoraRTC.createRtcClient();

        client.on('stream-added', function(evt) {
            var stream = evt.stream;
            client.subscribe(stream);
        });

        client.on('peer-leave', function(evt) {
            
        });

        client.on('stream-subscribed', function(evt) {
            // play
            
        });


    var call = function(params, callback) {

    };

    var hungup = function(params) {

    };
    
    var reject = function(params){

    };

    var accept = function(params){

    };

    var join = function(params, callback) {

    };

    var quit = function(params){

    };

    var mute = function(params, callback) {

    };

    var unmute = function(params, callback) {

    };

    var videoToAudio = function(params, callback) {

    };

    var audioToVideo = function(params, callback) {

    };

    // 视频质量

    var config = function(cfg){
        _util.merge(cfg, _util.config);
    };

    var message = function(opt){
        _util.merge(opt, _util.config);
    };

    return {
        config: config,
        message: message,
        call: call,
        hungup: hungup,
        reject: reject,
        accept: accept,
        join: join,
        quit: quit,
        mute: mute,
        unmute: unmute,
        videoToAudio: videoToAudio,
        audioToVideo: audioToVideo
    };

}, 'RongCallLib');