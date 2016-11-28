(function(){

	var Util = {
		opts:{ 
			max_msg_count:20,
			max_conversation_count:50
		},
		getPrototype:Object.prototype.toString,
		composeConversation:function(data, callback){
			if (Util.getPrototype.call(data) == "[object Array]") {
				var index = 0, items = [];
				var invoke = function(){
					if (index == data.length) {
						callback(items);
						return;
					}
					var conversation = data[index];
					RongIM.User.get(conversation.targetId,function(user){
						conversation.userInfo = user;
						items[index] = conversation;
						index++;
						invoke();
					});
				};
				invoke();
			}else{
				//直接封装会话对象。
			}
		},
		addConversation:function(conversation, callback){
			// 置顶问题
			var isInsert = false;
			if (isInsert) {
				// 封装会话，并返回
			}else{
				// 修改最后一条消息，返回。
			}
		}
	};

	function RongIM(appkey, dataAccessProvider, options){ 
		RongIMLib.RongIMClient.init(appkey, dataAccessProvider, options);

		RongIMClient.setConnectionStatusListener({
		    onChanged: function (status) {
		    	RongIM.Status.set(status);
		    }
		});

		RongIMClient.setOnReceiveMessageListener({
		    onReceived: function (message) {
		        switch(message.messageType){
		            case RongIMClient.MessageType.TextMessage:
		                break;
		            case RongIMClient.MessageType.VoiceMessage:
		                break;
		            case RongIMClient.MessageType.ImageMessage:
		               break;
		            case RongIMClient.MessageType.DiscussionNotificationMessage:
		               break;
		            case RongIMClient.MessageType.LocationMessage:
		               break;
		            case RongIMClient.MessageType.RichContentMessage:
		               break;
		            case RongIMClient.MessageType.InformationNotificationMessage:
		               break;
		            case RongIMClient.MessageType.ContactNotificationMessage:
		               break;
		            case RongIMClient.MessageType.ProfileNotificationMessage:
		               break;
		            case RongIMClient.MessageType.CommandNotificationMessage:
		               break;
		            case RongIMClient.MessageType.CommandMessage:
		               break;
		            case RongIMClient.MessageType.UnknownMessage:
		               break;
		            default:
		        }
		    }
		});
	}

	RongIM.init = function(appkey, dataAccessProvider, options){
		if (RongIM._instance) {
			return RongIM._instance;
		}else{
			RongIM._instance = new RongIM(appkey, dataAccessProvider, options);
		}
		RongIM.API.getUsers(function(users){
    		User.set(users);
    	});
		RongIM.API.getFriendShip(function(data){
			FriendShip.set(data);
		});
		RongIM.API.getGroups(function(data){
			// 获取群组成员
			// 处理 UserRelation
			Group.set(data);
		});

	};

	RongIM.getInstance = function(){
		return RongIM._instance;
	};

	RongIM.prototype.sendMessage = function(conversationType, targetId, content){

	};

	RongIM.prototype.connect = function(token){
		RongIMClient.connect(token, {
	        onSuccess: function(userId) {
	        
	        },
	        onTokenIncorrect: function() {
	        	Status.set(RongIMLib.ConnectionState.TOKEN_INCORRECT);
	        },
	        onError:function(errorCode){
	        	Status.set(errorCode);
	        }
	    });
	}

	RongIM.prototype.disconnect = function(){
		RongIMClient.getInstance().disconnect();
	};
	//好友和陌生人
	RongIM.User = {
		data:{'userId':{name:'zhangsan'}},
		get:function(userId,callback){ 
			if (userId in this.data) {
				callback(this.data[userId]);
			}else{
				RongIM.API.getUserInfo(userId, function(user){
					callback(user);
				});
			}
		},
		set:function(users){

		}
	};
	
	RongIM.FriendShip = { 
		data:[],
		get:function(){
			return this.data;
		},
		set:function(friends){

		},
		remove:function(){ },
		onChange:function(friends){ }
	};

	RongIM.Discussion = { };

	RongIM.ChatRoom = {};	

	/**
		userGroup : 好友信息修改后添加到 userGroup 中，下次获取群成员时区分获取本地还是服务器。
		data : 存储好友所在群
	*/
	var UserRelation = {
		data:{
			user1:{ group:[], chatroom:[], discussion:[] }
		},
		userGroup:{ 
			user1:{ group:[], chatroom:[], discussion:[] }
		},
		set:function(userId, item){
			this.data[userId] = item;
		},
		setUserGroup:function(userId){

		},
		getUserGroup:function(userId){
			var relation = this.data[userId];
			return relation || { group:[], chatroom:[], discussion:[]}
		},
		clearUserGroup:function(userId){
			
		}
	};

	RongIM.GroupMembers = { 
		data : { 'groupId':[] },
		set:function(groupId, memebers){
			this.data[groupId] = memebers;
		},
		get:function(groupId, callback){
			if (UserRelation.getUserGroup(groupId).group.length > 0 ) {
				// 服务器获取。
			}else{
				callback(this.data[groupId]);
			}
		},
		onChange:function(data){ 
			//data.groupId
			//data.members
		}
	};

	RongIM.Group = {
		data:[],
		set:function(data){ },
		get:function(callback){
			return this.data;
		},
		remove:function(){},
		onChange:function(group){}
	};
	
	RongIM.API = { 
		getUserInfo:function(userId, callback){ 
			var users = [{id:'1001',name:'yangchaun',poritraidUri:''},
						 {id:'1002',name:'fuyun',poritraidUri:''},
						 {id:'1003',name:'zhengyi',poritraidUri:''},
						 {id:'1004',name:'martin',poritraidUri:''}]
			callback(users[Math.floor(Math.random() * 4 )]);
		},
		getUsers:function(callback){},
		getFriendShip : function(callback){ },
		getGroups:function(callback){ },
		getGroupMembers:function(callback){ },
		getConversationList : function(callback){ },
		getHistoryMessages : function(callback){ },
		sortConversationList : function(conversationList, callback){ 
			var convers = [];
	        for (var i = 0, len = conversationList.length; i < len; i++) {
	            if (!conversationList[i]) {
	                continue;
	            }
	            if (conversationList[i].isTop) {
	                convers.push(conversationList[i]);
	                conversationList.splice(i, 1);
	                continue;
	            }
	            for (var j = 0; j < len - i - 1; j++) {
	                if (conversationList[j].sentTime < conversationList[j + 1].sentTime) {
	                    var swap = conversationList[j];
	                    conversationList[j] = conversationList[j + 1];
	                    conversationList[j + 1] = swap;
	                }
	            }
	        }
	        return convers.concat(conversationList);
		}
	};
	/**
	1、值存储实时消息和补偿消息（更改 getHistoryMessages 时间戳），不存储历史消息,当前会话没有历史消息和补偿消息除外
	*/
	RongIM.Message = {
		data:{'conversationType_targetId' : [] },
		set:function(message){},
		get:function(conversationType, targetId, position, callback){ 
			//position 标志哪里获取的 1、会话点击 2、 调用历史消息
		},
		update:function(message){ },
		onChange:function(message){}
	};

	// callback.data : {newIdx:0, oldIdx:0, data:conversation}
	RongIM.Conversation = {
		data : [],
		get : function(callback){
			var me = this; 
			RongIMClient.getInstance().getConversationList({
			 onSuccess: function(result) {
			  	Util.composeConversation(result,function(items){
			  		var list = RongIM.API.sortConversationList(items);
			  		if (list.length > Util.opts.max_conversation_count) list.length = Util.opts.max_conversation_count;
					me.data.concat(list);
					callback(list);
				});
			  },
			  onError: function(error) {
			  }
			},null);
		},
		set : function(conversations){
			var me = this;
			Util.addConversation(conversations, function(index){
				me.onChange({newIdx:0, oldIdx:index, data:conversation});
			});
		},
		remove:function(){ },
		onChange : function(data){ }
	};

	RongIM.Status = { 
		set : function(status){
			this.onChange(status);
		},
		onChange:function(status){ }
	};

	window.RongIM = RongIM;
})();