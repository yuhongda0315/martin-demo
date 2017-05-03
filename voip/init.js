function init(params,callbacks){	
	var appKey = params.appKey;
	var token = params.token;
	var navi = params.navi || "";

	if(navi !== ""){
		//私有云
		var config = {
			navi : navi
		}
		RongIMLib.RongIMClient.init(appKey,null,config);
	}else{
		//公有云
		RongIMLib.RongIMClient.init(appKey);
	}

	instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            callbacks.getInstance && callbacks.getInstance(instance);
		            break;
		        }
		}
	});


	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    // 判断消息类型
            callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
			console.log("链接成功");
		},
		onTokenIncorrect: function() {
			//console.log('token无效');
		},
		onError:function(errorCode){
		  console.log(info);
		}
	});
}