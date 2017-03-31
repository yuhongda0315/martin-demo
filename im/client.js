var Client = (function(win, IM) {
    var errorHandler = function(code, msg) {
        var template = 'Hi, friend your method is error, code: ' + code + ' error-message: ' + msg;
        return template;
    };

    var sendMessage = function(conversation, message, callback){
        
    };

    var _initClient = function(){
        return {
            sendMessage: sendMessage
        };
    };

    var statusWatch = function(status) {

    };

    var messageWatch = function(message) {
        
    };
    /**
     * config.token
     * config.opts: navi
     * callback.onSuccess callback.onError
     */
    var init = function(appkey, config, callback) {
        IM.init(appkey);
        IM.setConnectionStatusListener({
            onChanged: function(status) {
                statusWatch(status);
            }
        });
        IM.setOnReceiveMessageListener({
            onReceived: function(message) {
                messageWatch(message);
            }
        });
        IM.connect(config.token, {
            onSuccess: function(userId) {
                var _instance = _initClient();
                callback(_instance);
            },
            onTokenIncorrect: function() { },
            onError: function(code) { }
        });
    };

    return {
        init: init
    };
})(window, RongIMClient);