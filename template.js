(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        var messageTypes = factory();
        global.RongMessageTypes = global.RongMessageTypes || {};
        global.RongMessageTypes.chatroom = RongMessageTypes;
    }
})(window, function(){

    return RongIMLib;
});