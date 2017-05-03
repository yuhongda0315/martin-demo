'use strict';

RongIMClient._voipProvider = {
    onReceived: function(message){
        if (message.offLineMessage) {
            return;
        }
        RongCallLib.onReceived(message);
        RongIMLib.Channel._ReceiveMessageListener.onReceived(message);
    }
};