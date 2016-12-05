(function(win) {

	/**
		事件处理通用方法
		事件存储格式:_events.onMessage : [fun1, fun2]
	*/
	var _events = {};
	
	var fire = function(name, data) {
        if (name in _events) {
            for (var i = 0, len = _events[name].length; i < len; i++) {
                _events[name][i](data);
            }
        }
        return this;
    };

    var on = function(name, func){
    	if (typeof func != 'function' || typeof name !='string') return;
    	if (name in _events) {
    		_events[name].push(func);
    	}else{
    		_events[name] = [func];
    	}
    };

    var destroy = function(name){
    	if (name in _events) {
    		delete _events[name];
    	}
    };

    /**
		数据模型配置项
    */
    var opts = {
		max_msg_count: 20,
		max_conversation_count: 50,
		get_historyMsg_count: 5
	};
	
	var API = {
		getUserInfo: function(data, userId, callback) {
			if (userId in data) {
				callback(data[userId]);
			} else {
				callback(users[userId] || defaultUser);
			}
		},
		getUsers: function(callback) {},
		getFriendShip: function(callback) {
			callback(friends);
		},
		updateFriend: function(data, changeDatas, callback) {
			callback(data);
		},
		removeFriend:function(data, userId, callback){
			// 处理本地好友。
			// 删除服务端好友。
			callback();
		},
		getGroups: function(callback) {
			callback(groups);
		},
		getGroupMembers: function(groupIds, callback) {
			callback(groupMembers);
		},
		getGroupInfo: function(data, groupId, callback) {
			if (data.length > 0) {
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i].group.id == groupId) {
						callback(data[i]);
						break;
					}
				}
			} else {
				callback(group);
			}
		},
		quitGroup:function(data, groupId, callback){
			callback();
		},
		updateGroups: function(data, group, callback) {
			callback(data);
		},
		getConversationList: function(callback) {
			RongIMLib.RongIMClient.getInstance().getConversationList({
				onSuccess: function(result) {
					Util.composeObject(result, function(items) {
						var list = API.sortConversationList(items);
						if (list.length > opts.max_conversation_count) list.length = opts.max_conversation_count;
						callback(list);
					});
				},
				onError: function(error) {}
			}, [1, 3]);
		},

		sortConversationList: function(conversationList, callback) {
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
		clearUnReadCount: function(conversationType, targetId) {
			RongIMLib.RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
				onSuccess: function(count) {},
				onError: function() {}
			});
		},
		removeConversation: function(conversationType, targetId) {
			RongIMClient.getInstance().removeConversation(conversationType, targetId, {
				onSuccess: function(bool) {},
				onError: function(error) {}
			});
		},
		getHistoryMessages: function(conversationType, targetId, timestamp, callback) {
			RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestamp, opts.get_historyMsg_count, {
				onSuccess: function(list, hasMore) {
					callback(list, hasMore);
				},
				onError: function(error) {}
			});
		},
		sendMessage: function(conversationType, targetId, content) {
			RongIMLib.RongIMClient.getInstance().sendMessage(conversationType, targetId, content, {
				onSuccess: function(message) {
					fire('onMessage', message);
				},
				onError: function(errorCode, message) {
					
				}
			});
		}
	};

	/**
		data:{ }
		set: users 格式： { userId1 : {id:'', name:'', portraitUri:''}, userId2 : {id:'', name:'', portraitUri:''}  }
	*/
	var User = {
		data: {},
		get: function(userId, callback) {
			var me = this;
			API.getUserInfo(me.data, userId, function(user) {
				me.data[userId] = user;
				callback(user);
			});
		},
		set: function(users) {
			var me = this;
			Util.forEach(users, function(key, value) {
				// TODO 用户信息修改后全局联动
				me.data[key] = value;
			});
		}
	};

	var Util = {
		getPrototype: Object.prototype.toString,
		forEach: function(obj, callback) {
			for (var key in obj) {
				callback(key, obj[key]);
			}
		},
		composeObject: function(data, callback) {
			if (this.getPrototype.call(data) == "[object Array]") {
				var index = 0,
					items = [];
				var invoke = function() {
					if (index == data.length) {
						callback(items);
						return;
					}
					var obj = data[index];
					Util.composeUserInfo(obj, function(result) {
						items[index] = result;
						index++;
						invoke();
					});
				};
				invoke();
			} else {
				Util.composeUserInfo(data, function(result) {
					callback(result);
				});
			}
		},
		composeUserInfo: function(data, callback) {
			if (data.conversationType == RongIMLib.ConversationType.PRIVATE) {
				User.get(data.senderUserId || data.targetId, function(user) {
					data.senderUserInfo = user;
					callback(data);
				});
			} else if (data.conversationType == RongIMLib.ConversationType.GROUP) {
				if (data.latestMessage) {
					Group.get(function(group) {
						data.senderUserInfo = group;
						callback(data);
					}, data.targetId);
				} else {
					User.get(data.senderUserId, function(user) {
						data.senderUserInfo = user;
						callback(data);
					});
				}
			} else {
				data.senderUserInfo = {};
				callback(data);
			}
		}
	};

	var Discussion = {};

	var ChatRoom = {};
	
	/**
		userGroup : 好友信息修改后添加到 userGroup 中，下次获取群成员时区分获取本地还是服务器。
		data : 存储好友所在群
	*/
	var UserRelation = {
		data: {
			user1: {
				group: [],
				chatroom: [],
				discussion: []
			}
		},
		userGroup: {
			user1: {
				group: [],
				chatroom: [],
				discussion: []
			}
		},
		set: function(userId, item) {
			this.data[userId] = item;
		},
		setUserGroup: function(userId) {

		},
		getUserGroup: function(userId) {
			var relation = this.data[userId];
			return relation || {
				group: [],
				chatroom: [],
				discussion: []
			}
		},
		clearUserGroup: function(userId) {

		}
	};

	/**
		data: { 'groupId':[] }
		onChange: {groupId:'', memebers:[]}
	*/
	var GroupMembers = {
		data: {},
		set: function(groupId, memebers) {
			this.data[groupId] = memebers;
			this.onChange({
				groupId: groupId,
				memebers: memebers
			});
		},
		get: function(groupId, callback) {
			if (UserRelation.getUserGroup(groupId).group.length > 0) {
				API.getGroupInfo([], groupId, function(group) {
					callback(group);
				});
			} else {
				callback(this.data[groupId]);
			}
		},
		onChange: function(data) {

		}
	};

	var Group = {
		data: [],
		set: function(group) {
			var me = this;
			if (me.data.length == 0) {
				me.data = group;
			} else {
				// TODO 修改好友
				API.updateGroups(me.data, group, function(result) {
					me.data = result;
				});
			}
		},
		get: function(callback, groupId) {
			if (typeof groupId == 'undefined') {
				return this.data;
			} else {
				API.getGroupInfo(this.data, groupId, function(group) {
					callback(group);
				});
			}
		},
		quit:function(groupId, callback){ 
			API.quitGroup(this.data, groupId, callback);
		},
		dissolution: function(groupId, callback){
			API.dissolution(this.data, groupId, callback);
		},
		onChange: function(group) {}
	};

	var FriendShip = {
		data: [],
		get: function() {
			return this.data;
		},
		set: function(friend) {
			var me = this;
			if (me.data.length == 0) {
				me.data = friend;
			} else {
				API.updateFriend(me.data, friend, function(result) {
					me.data = result;
				});
			}
		},
		remove: function(userId, callback) {
			var me = this;
			API.removeFriend(me.data, userId, callback);
		},
		onChange: function(data) {}
	};

	// 注册 onMessage 事件用来接收 message
	on('onMessage', function(message){
		Message.set(message);
	});
	
	var Conversation = {
		data: [],
		get: function(callback) {
			var me = this;
			if (me.data.length == 0) {
				API.getConversationList(function(list) {
					me.data = list;
					callback(me.data);
				});
			} else {
				Util.composeObject(me.data, function(items) {
					var list = API.sortConversationList(items);
					callback(list);
				});
			}
		},
		set: function(conversation) {
			var me = this,
				topIndex = 0,
				isInsert = true;
			var oldIdx = 0;
			for (var i = 0, len = me.data.length; i < len; i++) {
				if (me.data[i].conversationType == conversation.conversationType && me.data[i].targetId == conversation.targetId) {
					me.data.unshift(me.data.splice(i, 1)[0])
					oldIdx = i;
					isInsert = false;
					break;
				}
			}
			//TODO  setTop
			if (isInsert) {
				Util.composeObject(conversation, function(result) {
					me.data.unshift(result);
				});
			}
			me.onChange(conversation);
		},
		clearUnReadCount: function(conversationType, targetId) {
			var me = this;
			API.clearUnReadCount(conversationType, targetId);
			for (var i = 0, len = me.data.length; i < len; i++) {
				if (me.data[i].conversationType == conversationType && me.data[i].targetId == targetId) {
					me.data[i].unreadMessageCount = 0;
					break;
				}
			}
		},
		remove: function(conversationType, targetId) {
			var me = this;
			for (var i = 0, len = me.data.length; i < len; i++) {
				if (me.data[i].conversationType == conversationType && me.data[i].targetId == targetId) {
					me.data.splice(i, 1);
					me.clearUnReadCount(conversationType, targetId);
					break;
				}
			}
			API.removeConversation(conversationType, targetId);
		},
		onChange: function(conversation) {}
	};

	/**
	1、值存储实时消息和补偿消息（更改 getHistoryMessages 时间戳），不存储历史消息,当前会话没有历史消息和补偿消息除外
	2、get.position 1、点击会话 2、调用历史消息接口
	3、get.callback(list,hasMore)
	*/
	var Message = {
		dataKey: 'conversation_',
		data: {},
		set: function(message) {
			var me = this;
			var key = me.dataKey + message.conversationType + message.targetId;
			Util.composeObject(message, function(result) {
				if (me.data[key]) {
					me.data[key].push(result);
				} else {
					me.data[key] = [message];
				}
				var conversation = RongIMClient._memoryStore.conversationList.slice(0, 1)[0];
				Conversation.set(conversation);
				me.onChange(message);
			});
		},
		get: function(conversationType, targetId, position, timestamp, callback) {
			var me = this;
			var key = me.dataKey + conversationType + targetId;
			var memoryMsgs = me.data[key];
			if (position == 2 || !memoryMsgs) {
				API.getHistoryMessages(conversationType, targetId, timestamp || 0, function(list, hasMore) {
					Util.composeObject(list, function(result) {
						if (!memoryMsgs) {
							me.data[key] = result;
						} else if (memoryMsgs.length < opts.max_msg_count) {
							me.data[key].concat(result);
						}
						callback(result, hasMore);
					});
				});
			} else {
				callback(memoryMsgs, true);
			}
		},
		sendMessage: function(conversationType, targetId, content) {
			// 发送消息状态
			// 显示消息逻辑
			API.sendMessage(conversationType, targetId, content);
		},
		onChange: function(message) {}
	};

	// 注册 onStatusChanged
	on('onStatusChanged', function(status){
		Status.set(status);
	});

	var Status = {
		set: function(status) {
			this.onChange(status);
		},
		connect: function(token) {
			RongIMClient.connect(token, {
				onSuccess: function(userId) {},
				onTokenIncorrect: function() {
					Listener.onStatusChange(RongIMLib.ConnectionState.TOKEN_INCORRECT);
				},
				onError: function(errorCode) {
					Listener.onStatusChange(errorCode);
				}
			});
		},
		disconnect: function() {
			RongIMClient.getInstance().disconnect();
		},
		onChange: function(status) {}
	};

	var init = function(appkey, dataAccessProvider, options) {

		API.getUsers(function(users) {
			User.set(users);
		});
		API.getFriendShip(function(data) {
			FriendShip.set(data);
		});
		API.getGroups(function(data) {
			Group.set(data);
		});
		API.getGroupMembers(groupIds, function(data){
			Util.forEach(data, function(key, value){
				GroupMembers.set(key, value);
			});
		});


		RongIMClient.init(appkey, dataAccessProvider, options);
		RongIMClient.setConnectionStatusListener({
			onChanged: function(status) {
				fire('onStatusChanged', status);
			}
		});
		RongIMClient.setOnReceiveMessageListener({
			onReceived: function(message) {
				fire('onMessage', message);
			}
		});

		return {
			User: User,
			Group: Group,
			GroupMembers: GroupMembers,
			FriendShip: FriendShip,
			Conversation: Conversation,
			Message: Message,
			Discussion: Discussion,
			ChatRoom: ChatRoom,
			Status: Status
		};
	};

	win.RongDataModel = {
		init:init
	};

})(window);