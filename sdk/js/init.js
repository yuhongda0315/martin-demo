function init(params, callbacks){	
	var appKey = params.appKey;
	var token = params.token;
	var navi = params.navi || "";
	var protobuf = params.protobuf || null;

	var RongIMClient = RongIMLib.RongIMClient;

	var config = {};

	//私有云切换navi导航
	if(navi !== ""){
		config.navi = navi;
	}

	//私有云切换api
	var api = params.api || "";
	if(api !== ""){
		config.api = api;
	}

	//support protobuf url + function
	if(protobuf != null){
		config.protobuf = protobuf;
	};


	// RongIMLib.RongIMClient.init(appKey, new RongIMLib.VCDataProvider(Electron.addon),config);
	RongIMLib.RongIMClient.init(appKey, null,config);

	var instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			console.log(status);
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            callbacks.connected && callbacks.connected(instance);
		            break;
		        }
		}
	});

	/*
	文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

	注意事项：
		1：为了看到接收效果，需要另外一个用户向本用户发消息
		2：判断会话唯一性 ：conversationType + targetId
		3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
		4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
	*/
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
            callbacks.received && callbacks.received(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			//console.log('token无效');
		},
		onError:function(errorCode){
		  console.log(errorCode);
		}
	}, '');
}