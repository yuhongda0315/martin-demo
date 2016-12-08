"use strict";
(function(win, RongIMLib, RongIMClient) {
    /** 配置项 */
    var option = {
        max_msg_count: 20,
        max_conversation_count: 50,
        get_historyMsg_count: 5,
        server_path: 'http://127.0.0.1:3587/'
    };
    /** 工具类 */
    var forEach = function(object, callback) {
        for (var key in object) {
            callback(key, object[key]);
        }
    };
    var getPrototype = Object.prototype.toString;
    var events = {}; // 事件存储格式:events.MessageWatcher : [fun1, fun2]
    var emit = function(name, data) {
        if (name in events) {
            for (var i = 0, len = events[name].length; i < len; i++) {
                events[name][i](data);
            }
        }
        return
    };
    var on = function(name, func) {
        if (typeof func != 'function' || typeof name != 'string') return;
        events[name] = events[name] || [];
        events[name].push(func);
    };
    var destroy = function(name) {
        if (name in events) {
            delete events[name];
        }
    };

    var request = function(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        };
        url = option.server_path + url;
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(data);
    };
    var generateData = function(obj) {
        return JSON.stringify(obj);
    };
    /** User DataModel region */
    var UserDataProvider = {
        get: function(userId, callback) {
            // eg : var user = {'zhagnsan': {name: 'zhangsan'}};
            callback(defaultUser);
        },
        getAll: function(callback) {
            callback(users);
        },
        update: function(users, callback) {
            // eg : var user = {'zhagnsan': {name: 'zhangsan'}};
            callback(users);
        },
        remove: function(userIds, callback) {
            // TODO remove users.
        }
    };

    var User = (function(userProvider) {
        var data = {};
        var set = function(users) {
            userProvider.update(users, function(result) {
                forEach(result, function(userId, user) {
                    data[userId] = user;
                });
            });
        };
        var get = function(userId, callback) {
            if (userId in data) {
                callback(data[userId]);
            } else {
                userProvider.get(userId, function(result) {
                    forEach(result, function(userId, user) {
                        data[userId] = user;
                        callback(user);
                    });
                });
            }
        };
        var _push = function(userId, user) {
            data[userId] = user;
        };
        on('onUserWatcher', function(data) {
            forEach(data, function(userId, user) {
                _push(userId, user);
            });
        });
        return {
            set: set,
            get: get,
            data: data,
            UserDataProvider: userProvider
        };
    })(UserDataProvider);

    UserDataProvider.getAll(function(data) {
        emit('onUserWatcher', data);
    });
    /** User DataModel end region */

    /** Friend DataModel region */
    var friendPath = {
        all: 'friendship/all'
    };
    var FriendDataProvider = {
        add: function(friend, callback) {
            callback({});
        },
        getAll: function(callback) {
            request(friendPath.all, null, callback);
        },
        update: function(friends, callback) {
            var friends = [];
            callback(friends);
        },
        remove: function(friendIds, callback) {
            var friendIds = [];
            callback(friendIds);
        }
    };

    var Friend = (function(friendDataProvider) {
        var data = [];
        var watch = function(friend) {

        };
        var add = function(friend) {
            friendDataProvider.add(friend, function(result) {
                data.push(result);
                Friend.watch(result);
            });
        };

        var _success = function(result, cb) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].user.id == result.user.id) {
                    cb(i);
                    Friend.watch(result);
                    break;
                }
            }
        };
        var remove = function(friend) {
            friendDataProvider.remove(friend, function(result) {
                _success(result, function(index) {
                    data.splice(i, 1);
                });
            });
        };
        var set = function(friend) {
            friendDataProvider.update(friend, function(result) {
                _success(result, function(index) {
                    data[i] = result;
                });
            });
        };
        var get = function() {
            return data;
        };
        var _push = function(friends) {
            data = friends;
        };
        return {
            add: add,
            remove: remove,
            set: set,
            get: get,
            watch: watch,
            FriendDataProvider: friendDataProvider,
            _push: _push
        };
    })(FriendDataProvider);
    var convertDataToUser = function(data, callback) {
        for (var i = 0, len = data.length; i < len; i++) {
            var user = data[i].user,
                obj = {};
            obj[user.id] = user;
            callback(obj);
        }
    };
    FriendDataProvider.getAll(function(data) {
        Friend._push(data.result);
        convertDataToUser(data.result, function(user) {
            emit('onUserWatcher', user);
        });
    });
    /** Friend DataModel end region*/

    /** Group DataModel region*/
    var groupPath = {
        all: 'user/groups',
        members: 'group/{groupId}/members',
        create: 'group/create',
        join: 'group/join',
        quit: 'group/quit',
        dismiss: 'group/dismiss',
        transfer: 'group/transfer',
        set_bulletin: 'group/set_bulletin',
        set_portrait_uri: 'group/set_portrait_uri',
        set_display_name: 'group/set_display_name',
        rename: 'group/rename',
        kick: 'group/kick',
        add: 'group/add'
    };

    var GroupDataProvider = {
        get: function(callback) {
            request(groupPath.all, null, callback);
        },
        create: function(name, memberIds, callback) {
            var data = {
                memberIds: memberIds
            };
            request(groupPath.create, generateData(data), callback);
        },
        join: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.join, generateData(data), callback);
        },
        quit: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.quit, generateData(data), callback);
        },
        dismiss: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, generateData(data), callback);
        },
        transfer: function(groupId, userId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, generateData(data), callback);
        },
        setBulletin: function(groupId, bulletin, callback) {
            var data = {
                groupId: groupId,
                bulletin: bulletin
            };
            request(groupPath.set_bulletin, generateData(data), callback);
        },
        setPortaitUri: function(groupId, portraiUri) {
            var data = {
                groupId: groupId
            };
            request(groupPath.set_portrait_uri, generateData(data), callback);
        },
        setDisplayName: function(groupId, displayName) {
            var data = {
                groupId: groupId,
                displayName: displayName
            };
            request(groupPath.set_display_name, generateData(data), callback);
        },
        groupRename: function(groupId, name) {
            var data = {
                groupId: groupId,
                name: name
            };
            request(groupPath.rename, generateData(data), callback);
        },
        getMembers: function(groupId, callback) {
            request(groupPath.members.replace(/{groupId}/, groupId), null, function(data) {
                callback(data.result);
            });
        },
        addMember: function(groupId, memberIds) {
            var data = {
                groupId: groupId
            };
            request(groupPath.add, generateData(data), callback);
        },
        kickMember: function(groupId, memberIds) {
            var data = {
                groupId: groupId,
                memberIds
            };
            request(groupPath.kick, generateData(data), callback);
        }
    };

    var Group = (function(groupDatProvider) {
        var data = [],
            members = {};
        var create = function(name, memberIds) {
            groupDatProvider.create(name, memberIds, function(data) {
                // data.groupId, data.members
            });
        };
        var join = function(groupId) {
            groupDatProvider.join(groupId, function() {
                // emit member change
            });
        };
        var quit = function(groupId) {
            groupDatProvider.quit(groupId, function() {
                // emit member change
            });
        };
        var get = function() {
            return data;
        };
        var dismiss = function(groupId) {
            groupDatProvider.dismiss(groupId, function() {
                // emit member change
            });
        };
        var transfer = function(groupId, userId) {
            groupDatProvider.transfer(groupId, userId, function() {
                // emit memberMananger change
            });
        };
        var setBulletin = function(groupId, bulletin, callback) {
            groupDatProvider.setBulletin(groupId, bulletin, function() {
                callback();
            });
        };
        var setPortaitUri = function(groupId, portraiUri) {
            groupDatProvider.setPortaitUri(groupId, bulletin, function() {
                // emit groupInfo change
            });
        };
        var setDisplayName = function(groupId, displayName) {
            groupDatProvider.setDisplayName(groupId, displayName, function() {
                // emit groupInfo change
            });
        };
        var groupRename = function(groupId, name) {
            groupDatProvider.groupRename(groupId, displayName, function() {
                // emit groupInfo change
            });
        };
        var getMembers = function(groupId, callback) {
            if (groupId in members) {
                callback(members[groupId]);
            } else {
                var cacheMembers = function(members) {
                    convertDataToUser(members, function(user) {
                        emit('onUserWatcher', user); // fire onUserWatcher, cache userInfo.
                    });
                    members[groupId] = members;
                    callback(members);
                };
                groupDatProvider.getMembers(groupId, cacheMembers);
            }
        };
        var addMember = function(groupId, memberIds) {
            groupDatProvider.addMember(groupId, memberIds, function() {
                // emit member change
            });
        };
        var kickMember = function(groupId, memberIds) {
            groupDatProvider.kickMember(groupId, memberIds, function() {
                // emit member change
            });
        };
        var _pushGrups = function(groups) {
            data = groups;
        };

        return {
            create: create,
            join: join,
            quit: quit,
            get: get,
            dismiss: dismiss,
            transfer: transfer,
            setBulletin: setBulletin,
            setPortaitUri: setPortaitUri,
            setDisplayName: setDisplayName,
            groupRename: groupRename,
            getMembers: getMembers,
            addMember: addMember,
            kickMember: kickMember,
            _pushGrups: _pushGrups
        };
    })(GroupDataProvider);
    GroupDataProvider.get(function(data) {
        Group._pushGrups(data.result);
    });
    /** Group DataModel end region */

    /** Conversation DataModel region */
    var ConDataProvider = {
        getConversationList: function(callback) {
            RongIMLib.RongIMClient.getInstance().getConversationList({
                onSuccess: function(result) {
                    callback(result);
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
        remove: function(conversationType, targetId) {
            RongIMClient.getInstance().removeConversation(conversationType, targetId, {
                onSuccess: function(bool) {},
                onError: function(error) {}
            });
        }
    };

    var bindUserProcess = function(data, callback) {
        var _cb = function(user) {
            data.user = user;
            callback && callback(data);
        };
        if (data.conversationType == RongIMLib.ConversationType.PRIVATE) {
            User.get(data.senderUserId || data.targetId, _cb);
        } else if (data.conversationType == RongIMLib.ConversationType.GROUP) {
            if (data.latestMessage) {
                Group.get(_cb, data.targetId);
            } else {
                User.get(data.senderUserId, _cb);
            }
        } else {
            _cb({});
        }
    };

    var composeUserInfo = function(data, callback) {
        if (getPrototype.call(data) == '[object Array]') {
            for (var i = 0, len = data.length; i < len; i++) {
                bindUserProcess(data[i]);
            }
            callback(data);
        } else {
            bindUserProcess(data, callback);
        }
    };
    var Conversation = (function(conDataProvider) {
        var data = [];
        var watch = function(conversation) {

        };

        var get = function(callback) {
            conDataProvider.getConversationList(function(conversations) {
                composeUserInfo(conversations, function(items) {
                    var _list = conDataProvider.sortConversationList(conversations);
                    data = _list;
                    callback(_list);
                });
            });
        };
        var setConversationTop = function(conversation) {
            data.unshift(conversation);
        };
        var set = function(conversation) {
            var isInsert = true;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversation.conversationType && data[i].targetId == conversation.targetId) {
                    setConversationTop(data.splice(i, 1)[0]);
                    isInsert = false;
                    break;
                }
            }
            //TODO  setTop
            if (isInsert) {
                composeUserInfo(conversation, function(result) {
                    setConversationTop(result);
                });
            }
            Conversation.watch(conversation);
        };

        var clearUnReadCount = function(conversationType, targetId) {
            conDataProvider.clearUnReadCount(conversationType, targetId);
            var clearUnread = function(conversation) {
                conversation.unreadMessageCount = 0;
            };
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    clearUnread(data[i]);
                    break;
                }
            }
        };

        var removeConversation = function(index, conversationType, targetId) {
            data.splice(index, 1);
            clearUnReadCount(conversationType, targetId);
        };
        // remote:是否删除服务器
        var remove = function(conversationType, targetId, remote) {
            remote && conDataProvider.remove(conversationType, targetId);
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    removeConversation(i, conversationType, targetId);
                    break;
                }
            }
        };
        on('onConversationWatcher', function(data) {
            data = data || RongIMClient._memoryStore.conversationList.slice(0, 1)[0];
            set(data);
        });

        return {
            remove: remove,
            set: set,
            get: get,
            clearUnReadCount: clearUnReadCount,
            watch: watch
        };
    })(ConDataProvider);

    /** Conversation DataModel end region */

    /** Message DataModel region */
    var MessageDataProvider = {
        getHistoryMessages: function(params, callback) {
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(params.conversationType, params.targetId, params.timestamp, option.get_historyMsg_count, {
                onSuccess: function(list, hasMore) {
                    callback(list, hasMore);
                },
                onError: function(error) {}
            });
        },
        sendMessage: function(params, callback) {
            var msg = new RongIMLib.Message();
            msg.content = params.content;
            msg.conversationType = params.conversationType;
            msg.targetId = params.targetId;
            msg.senderUserId = RongIMClient.getInstance().getCurrentUserId();
            msg.sentStatus = RongIMLib.SentStatus.SENDING;
            msg.messageId = RongIMLib.MessageIdHandler.messageId + 1;
            msg.messageType = params.content.messageName;
            callback(msg);
            RongIMLib.RongIMClient.getInstance().sendMessage(params.conversationType, params.targetId, params.content, {
                onSuccess: function(message) {
                    callback(message);
                },
                onError: function(errorCode, message) {
                    callback(message);
                }
            });
        }
    };
    var Message = (function(messageDataProvider) {
        var data = {};
        var watch = function(message) {};
        var genDataUId = function(conversationType, targetId) {
            return 'cm_' + conversationType + targetId;
        };
        var set = function(message) {};
        // params:conversationType, targetId, position, timestamp
        var get = function(params, callback) {
            var key = genDataUId(params.conversationType, params.targetId);
            var memoryMsgs = data[key];
            if (params.position == 2 || !memoryMsgs) {
                params.timestamp = params.timestamp || 0;
                messageDataProvider.getHistoryMessages(params, function(list, hasMore) {
                    composeUserInfo(list, function(result) {
                        if (!memoryMsgs) {
                            data[key] = result;
                        } else if (memoryMsgs.length < option.max_msg_count) {
                            data[key].concat(result);
                        }
                        callback(result, hasMore);
                    });
                });
            } else {
                callback(memoryMsgs, true);
            }
        };
        var _push = function(message) {
            var key = genDataUId(message.conversationType, message.targetId);
            var isInsert = true;
            composeUserInfo(message, function() {
                data[key] = data[key] || [];
                for (var i = 0, len = data[key].length; i < len; i++) {
                    if (data[key][i].messageId == message.messageId) {
                        data[key][i].sentStatus = message.sentStatus;
                        isInsert = false;
                        break;
                    }
                }
                isInsert && data[key].push(message);
                emit('onConversationWatcher');
                Message.watch(message);
            });

        };
        // params: conversationType, targetId, content, pushContent
        var send = function(params) {
            messageDataProvider.sendMessage(params, function(message) {
                _push(message);
            });
        };

        on('onMessageWatcher', function(message) {
            Message._push(message);
        });
        return {
            set: set,
            get: get,
            send: send,
            watch: watch,
            TextMessage: RongIMLib.TextMessage,
            MessageDataProvider: messageDataProvider
        };
    })(MessageDataProvider);


    /** Message DataModel end region */

    /** Status DataModel region */
    var Status = (function() {
        var data = -2;
        var watch = function(status) {};
        var get = function() {
            return data;
        };
        var connect = function(token) {
            RongIMClient.connect(token, {
                onSuccess: function(userId) {},
                onTokenIncorrect: function() {
                    Status.watch(RongIMLib.ConnectionState.TOKEN_INCORRECT);
                },
                onError: function(errorCode) {
                    Status.watch(errorCode);
                }
            });
        };
        var disconnect = function() {
            RongIMClient.getInstance().disconnect();
        };
        var _push = function(status) {
            data = status;
            Status.watch(status);
        };
        on('onStatusWatcher', function(status) {
            _push(status);
        });
        return {
            get: get,
            connect: connect,
            disconnect: disconnect,
            watch: watch
        };
    })();


    /** Status DataModel end region */

    var init = function(config) {
        RongIMClient.init(config.appkey, config.dataAccessProvider, config.option);
        RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
                emit('onStatusWatcher', status);
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            onReceived: function(message) {
                emit('onMessageWatcher', message);
            }
        });

        return {
            User: User,
            Group: Group,
            Friend: Friend,
            Conversation: Conversation,
            Message: Message,
            Status: Status
        };
    };

    win.RongDataModel = {
        init: init
    };
})(window, RongIMLib, RongIMClient);