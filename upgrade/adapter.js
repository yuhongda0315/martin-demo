let imAdapter = (function(RongIMLib){
  let RongIMClient = RongIMLib.RongIMClient;

  let init = (appkey) => {
    RongIMClient.init(appkey);
  };

  let setConnectionStatusListener = (listener) => {
    RongIMClient.setConnectionStatusListener({
      onChanged: (status) => {
        listener.onChanged({value: status})
      }
    });
  };

  let setOnReceiveMessageListener = (listener) => {
    RongIMClient.setOnReceiveMessageListener(listener);
  };

  let connect = (token, callbacks) => {
    RongIMClient.connect(token, {
      onSuccess: function(userId) {
        callbacks.onSuccess(userId);
      },
      onTokenIncorrect: function() {
        callbacks.onError(4);
      },
      onError:function(code){
        callbacks.onError(code);
      }
    });
  };

  return {
    init,
    connect,
    setConnectionStatusListener,
    setOnReceiveMessageListener
  };
})(RongIMLib);