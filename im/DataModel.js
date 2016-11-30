(function(){

	var Util = {
		opts:{ 
			max_msg_count:20,
			max_conversation_count:50,
			get_historyMsg_count:20
		},
		getPrototype:Object.prototype.toString,
		forEach:function(obj,callback){
			for(var key in obj){
				callback(key,obj[key]);
			}
		},
		composeObject:function(data, callback){
			if (Util.getPrototype.call(data) == "[object Array]") {
				var index = 0, items = [];
				var invoke = function(){
					if (index == data.length) {
						callback(items);
						return;
					}
					var obj = data[index];
					Util.composeUserInfo(obj, function(result){
						items[index] = result;
						index++;
						invoke();
					});
				};
				invoke();
			}else{
				Util.composeUserInfo(data, function(result){
					callback(result);
				});
			}
		},
		composeUserInfo:function(data, callback){
			if (data.conversationType == RongIMLib.ConversationType.PRIVATE) {
				RongIM.User.get(data.targetId || data.senderUserId,function(user){
					data.senderUserInfo = user;
					callback(data);
				});
			}else if(data.conversationType == RongIMLib.ConversationType.GROUP){
				if (data.latestMessage) {
					RongIM.Group.get(function(group){
						data.senderUserInfo = group;
						callback(data);
					},data.targetId);
				}else{
					RongIM.Group.get(function(group){
						data.senderUserInfo = group;
						callback(data);
					},data.senderUserId);					
				}
			}else{
				data.senderUserInfo = {};
				callback(data);
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
	        	RongIM.Status.set(RongIMLib.ConnectionState.TOKEN_INCORRECT);
	        },
	        onError:function(errorCode){
	        	RongIM.Status.set(errorCode);
	        }
	    });
	}

	RongIM.prototype.disconnect = function(){
		RongIMClient.getInstance().disconnect();
	};
	/**
		data:{ }
		set: users 格式： { userId1 : {id:'', name:'', portraitUri:''}, userId2 : {id:'', name:'', portraitUri:''}  }
	*/
	RongIM.User = {
		data:{},
		get:function(userId,callback){
			var me = this;
			RongIM.API.getUserInfo(me.data, userId, function(user){
				me.data[userId] = user;
				callback(user);
			});
		},
		set:function(users){
			var me = this;
			Util.forEach(users, function(key, value){
				// TODO 用户信息修改后全局联动
				me.data[key] = value;
			});
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
	/**
		data: { 'groupId':[] }
		onChange: {groupId:'', memebers:[]}
	*/
	RongIM.GroupMembers = { 
		data : {  },
		set:function(groupId, memebers){
			this.data[groupId] = memebers;
			this.onChange({ groupId:groupId, memebers:memebers});
		},
		get:function(groupId, callback){
			if (UserRelation.getUserGroup(groupId).group.length > 0 ) {
				RongIM.API.getGroupInfo([], groupId, function(group){
					callback(group);
				});
			}else{
				callback(this.data[groupId]);
			}
		},
		onChange:function(data){ 
			
		}
	};

	/**
		data:数据格式:[]
		get: callback 必传参数, groupId 可选参数
	*/
	RongIM.Group = {
		data:[],
		set:function(data){ },
		get:function(callback, groupId){
			if (typeof groupId == 'undefined') {
				return this.data;
			}else{
				RongIM.API.getGroupInfo(this.data, groupId, function(group){
					callback(group);
				});
			}
		},
		remove:function(){},
		onChange:function(group){}
	};
	
	/**
	getUserInfo.data 数据模型中缓存的数据，自己决定在 data 中取或在服务取
	*/
	RongIM.API = { 
		getUserInfo:function(data, userId, callback){
			if (userId in data) {
				callback(data[userId]);
			}else{
				var defaultUser = {
					name:'陌生人',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1476068767254905029'
				};
				var users = {'1002':{id:'1002',name:'zhaoliu',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066'},
							'1003':{id:'1003',name:'wangwu',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_'},
							'1004':{id:'1004',name:'lisi',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041'},
							'1005':{id:'1005',name:'zhangsan',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/FsVw17aXIP2BnW02Eo27GiIKTSIF'},
							'1001':{id:'1001',name:'Martin',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984'}}
				callback(users[userId] || defaultUser);
			}
		},
		getUsers:function(callback){},
		getFriendShip : function(callback){ },
		getGroups:function(callback){ },
		getGroupMembers:function(callback){ },
		getGroupInfo:function(data, groupId, callback){ 
			if (data.length > 0) {
				for(var i=0,len = data.length; i<len; i++){
					if (data[i].group.id == groupId) {
						callback(data[i]);
						break;
					}
				}
			}else{
				callback({id:'"daGroup9901"',name:'RongCloud',portraitUri:'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570097727076172'});
			}
		},
		getConversationList : function(callback){ },
		
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
		},
		removeConversation:function(conversationType, targetId, callback){},
		getHistoryMessages : function(conversationType, targetId, timestamp, callback){ 
			RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestamp, Util.opts.get_historyMsg_count, {
			  onSuccess: function(list, hasMore) {
			  	callback(list, hasMore);
			  },
			  onError: function(error) { }
			});
		}
	};
	/**
	1、值存储实时消息和补偿消息（更改 getHistoryMessages 时间戳），不存储历史消息,当前会话没有历史消息和补偿消息除外
	2、get.position 1、点击会话 2、调用历史消息接口
	3、get.callback(list,hasMore)
	*/
	RongIM.Message = {
		dataKey:'conversation_',
		data:{},
		set:function(message){},
		get:function(conversationType, targetId, position, callback){ 
			var me = this;
			var	key = me.dataKey + conversationType + targetId;
			var memoryMsgs = me.data[key];
			if (position == 2 || !memoryMsgs) {
				var timestamp = memoryMsgs ? memoryMsgs[memoryMsgs.length - 1].sentTime : 0; 
				RongIM.API.getHistoryMessages(conversationType, targetId, timestamp, function(list, hasMore){
					Util.composeObject(list, function(result){
						if (!memoryMsgs) {
							me.data[key] = result;
						}else if(memoryMsgs.length < Util.opts.get_historyMsg_count){
							me.data[key].concat(result);
						}
						setTimeout(function(){
							callback(result, hasMore);
						});
					});
				});
			}else{
				setTimeout(function(){
					callback(me.data[key], true);
				});
			}
		},
		update:function(message){ },
		onChange:function(message){}
	};

	/**

	callback.data : {newIdx:0, oldIdx:0, data:conversation}
	*/
	RongIM.Conversation = {
		data : [],
		get : function(callback){
			var me = this; 
			if (me.data.length == 0) {
				RongIMClient.getInstance().getConversationList({
				 onSuccess: function(result) {
				  	Util.composeObject(result,function(items){
				  		var list = RongIM.API.sortConversationList(items);
				  		if (list.length > Util.opts.max_conversation_count) list.length = Util.opts.max_conversation_count;
						me.data.concat(list);
						callback(list);
					});
				  },
				  onError: function(error) {
				  }
				},[1,3]);
			}else{
				Util.composeObject(me.data,function(items){
			  		var list = RongIM.API.sortConversationList(items);
					callback(list);
				});
			}
		},
		set : function(conversation){
			var me = this, topIndex = 0;
			var oldIdx = 0;
			for(var i =0,len=me.data.length; i<len; i++){
				if (me.data[i].conversationType == conversation.conversationType && me.data[i].targetId == conversation.targetId) {
					me.data.splice(i,1);
					oldIdx = i;
					break;
				}
			}
			//TODO  setTop
			me.data.unshift(conversation);
			me.onChange({newIdx:0, oldIdx:oldIdx, data:conversation});
		},
		clearUnReadCount:function(conversationType, targetId){ },
		remove:function(conversationType, targetId, callback){
			var me = this;
			for(var i =0,len=me.data.length; i<len; i++){
				if (me.data[i].conversationType == conversation.conversationType && me.data[i].targetId == conversation.targetId) {
					RongIM.API.removeConversation(me.data[i], function(){
						me.data.splice(i,1);
						me.clearUnReadCount(conversationType, targetId);
					});
					break;
				}
			}
		},
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