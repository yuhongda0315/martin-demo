"use strict";
(function(win, RongIMLib, RongIMClient) {
    var option = (function() {
        return {
            max_msg_count: 20,
            max_conversation_count: 50,
            get_historyMsg_count: 5,
            server_path: 'http://127.0.0.1:3587/'
        };
    })();

    /** 工具类 */
    var forEach = function(object, callback) {
        for (var key in object) {
            callback(key, object[key]);
        }
    };
    var loop = function(arrs, callback) {
        for (var i = 0, len = arrs.length; i < len; i++) {
            callback(arrs[i]);
        }
    };
    var currentUserId = "";
    var getPrototype = Object.prototype.toString;
    var events = {}; // 事件存储格式:events.MessageWatcher : [fun1, fun2]
    var emit = function(name, data) {
        if (name in events) {
            for (var i = 0, len = events[name].length; i < len; i++) {
                events[name][i](data);
            }
        }
    };
    var watcher = function(name, func) {
        if (typeof func != 'function' || typeof name != 'string') return;
        events[name] = events[name] || [];
        events[name].push(func);
    };
    var destroy = function(name) {
        delete events[name];
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
    var jsonStringify = function(obj) {
        return JSON.stringify(obj);
    };
    // 数据格式:var user = {zhangsan:{id:'zhangsan',name:'name'}};
    var userFormat = function(data, callback) {
        for (var i = 0, len = data.length; i < len; i++) {
            var user = data[i].user,
                obj = {};
            obj[user.id] = user;
            callback(obj);
        }
    };

    /** User DataModel region */
    // 没有提供 User 接口，暂时使用假数据。
    var userPath = {
        all: 'user/all',
        get: 'user/{userId}',
        upate: 'user/{userId}/update'
    };
    var UserDataProvider = {
        get: function(userId, callback) {
            //TODO 
            var data = {
                name: '陌生人',
                portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1476068767254905029'
            };
            var user = {};
            user[userId] = user; 
            callback(user);
        },
        getAll: function(callback) {
            request(userPath.all, null, function(data) {
                callback(data.result);
            });
        },
        update: function(users, callback) {
            callback(users);
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
        // 此方不从服务器获取用户信息,返回值数据格式 var users = {zhangsan:{id:'zhagnsan',name:'name'}};
        var getUsers = function(userIds, callback) {
            var users = {};
            for (var i = 0, len = userIds.length; i < len; i++) {
                userIds[i] in data && (users[userIds[i]] = data[userIds]);
            }
            callback(users);
        };
        var _push = function(userId, user) {
            data[userId] = user;
        };
        watcher('User', function(data) {
            forEach(data, function(userId, user) {
                _push(userId, user);
            });
        });
        return {
            set: set,
            get: get,
            getUsers: getUsers,
            data: data,
            UserDataProvider: userProvider
        };
    })(UserDataProvider);

    UserDataProvider.getAll(function(data) {
        emit('User', data);
    });
    /** User DataModel end region */

    /** Friend DataModel region */
    var friendPath = {
        all: 'friendship/all',
        invite: 'friendship/invite',
        agree: 'friendship/agree',
        ignore: 'friendship/ignore',
        remove: 'friendship/delete',
        setDisplayName: 'friendship/set_display_name'
    };
    var FriendDataProvider = {
        invite: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.invite, jsonStringify(data), callback);
        },
        getAll: function(callback) {
            request(friendPath.all, null, callback);
        },
        agree: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.agree, jsonStringify(data), callback);
        },
        ignore: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.ignore, jsonStringify(data), callback);
        },
        setDisplayName: function(friendId, displayName, callback) {
            var data = {
                friendId: friendId,
                displayName: displayName
            };
            result(friendPath.setDisplayName, jsonStringify(data), callback);
        },
        remove: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.remove, jsonStringify(data), callback);
        }
    };

    var Friend = (function(friendDataProvider) {
        var data = [];
        var watch = function(friend) {};
        var invite = function(friendId) {
            friendDataProvider.invite(friendId, function(result) {
                data.push(result);
                Friend.watch(result);
            });
        };
        var agree = function(friendId, callback) {
            friendDataProvider.agree(friendId, callback);
        };
        var ignore = function(friendId, callback) {
            friendDataProvider.ignore(friendId, callback);
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
        var remove = function(friendId) {
            friendDataProvider.remove(friendId, function(result) {
                _success(result, function(index) {
                    data.splice(i, 1);
                });
            });
        };
        var setDisplayName = function(friendId, displayName) {
            friendDataProvider.set_display_name(friendId, displayName, function(result) {
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
        FriendDataProvider.getAll(function(data) {
            _push(data.result);
            userFormat(data.result, function(user) {
                emit('User', user);
            });
        });
        return {
            invite: invite,
            remove: remove,
            ignore: ignore,
            agree: agree,
            setDisplayName: setDisplayName,
            get: get,
            watch: watch,
            FriendDataProvider: friendDataProvider
        };
    })(FriendDataProvider);
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
        notice: 'group/set_bulletin',
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
            request(groupPath.create, jsonStringify(data), callback);
        },
        join: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.join, jsonStringify(data), callback);
        },
        quit: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.quit, jsonStringify(data), callback);
        },
        dismiss: function(groupId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, jsonStringify(data), callback);
        },
        transferManager: function(groupId, userId) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, jsonStringify(data), callback);
        },
        setNotice: function(groupId, bulletin, callback) {
            var data = {
                groupId: groupId,
                bulletin: bulletin
            };
            request(groupPath.notice, jsonStringify(data), callback);
        },
        setPortaitUri: function(groupId, portraiUri) {
            var data = {
                groupId: groupId
            };
            request(groupPath.set_portrait_uri, jsonStringify(data), callback);
        },
        setDisplayName: function(groupId, displayName) {
            var data = {
                groupId: groupId,
                displayName: displayName
            };
            request(groupPath.set_display_name, jsonStringify(data), callback);
        },
        rename: function(groupId, name) {
            var data = {
                groupId: groupId,
                name: name
            };
            request(groupPath.rename, jsonStringify(data), callback);
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
            request(groupPath.add, jsonStringify(data), callback);
        },
        kickMember: function(groupId, memberIds) {
            var data = {
                groupId: groupId,
                memberIds
            };
            request(groupPath.kick, jsonStringify(data), callback);
        }
    };

    var Group = (function(groupDatProvider) {
        var data = [],
            groupMembers = {};
        var createMember = function(user) {
            return {
                displayName: "",
                role: 0,
                createdAt: +new Date,
                updatedAt: +new Date,
                user: user
            };
        };
        var create = function(name, memberIds) {
            /**
                var group = {name:'', portraitUri:''}
             */
            groupDatProvider.create(group, memberIds, function(data) {
                var groupId = data.result.id;
                var groupInfo = {
                    role: 1,
                    group: {
                        id: groupId,
                        name: group.name,
                        portraitUri: group.portraitUri,
                        creatorId: currentUserId,
                        memberCount: memberIds.length,
                        maxMemberCount: 500
                    }
                };
                data.push(groupInfo);
                var members = [];
                User.getUsers(memberIds, function(users) {
                    for (var i = 0, len = memberIds.length; i < len; i++) {
                        var memberId = memberIds[i];
                        memberId in users && members.push(createMember(users[memberId]));
                    }
                    groupMembers[groupId].concat(members);
                });
            });
        };
        var get = function() {
            return data;
        };
        var join = function(groupId) {
            groupDatProvider.join(groupId, function() {
                User.get(currentUserId, function(user) {
                    groupMembers[groupId].push(createMember(user));
                });
            });
        };

        var memberHandle = function(groupId, userId, callback) {
            var members = groupMembers[groupId];
            for (var i = 0, len = members.length; i < len; i++) {
                if (userId == members[i].user.id) {
                    callback(i);
                    break;
                }
            }
        };
        var quit = function(groupId) {
            groupDatProvider.quit(groupId, function() {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId].splice(index, 1);
                });
            });
        };
        var addMember = function(groupId, memberIds) {
            groupDatProvider.addMember(groupId, memberIds, function() {
                User.getUsers(memberIds, function(users) {
                    for (var i = 0, len = memberIds.length; i < len; i++) {
                        var memberId = memberIds[i];
                        memberId in users && members.push(createMember(users[memberId]));
                    }
                    groupMembers[groupId].concat(members);
                });
            });
        };
        var kickMember = function(groupId, memberIds) {
            groupDatProvider.kickMember(groupId, memberIds, function() {
                for (var i = 0, len = memberIds.length; i < len; i++) {
                    memberHandle(groupId, memberIds[i], function(index) {
                        groupMembers[groupId].splice(index, 1);
                    });
                }
            });
        };
        var setDisplayName = function(groupId, displayName) {
            groupDatProvider.setDisplayName(groupId, displayName, function() {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].displayName = displayName;
                });
            });
        };
        var transferManager = function(groupId, userId) {
            groupDatProvider.transferManager(groupId, userId, function() {
                // 取消自己是管理员身份
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].role = 1;
                });
                // 绑定指定用户为管理员
                memberHandle(groupId, userId, function(index) {
                    groupMembers[groupId][index].role = 0;
                });
            });
        };
        var getMembers = function(groupId, callback) {
            if (groupId in groupMembers) {
                callback(groupMembers[groupId]);
            } else {
                var cacheMembers = function(members) {
                    userFormat(members, function(user) {
                        emit('User', user); // fire User, cache userInfo.
                    });
                    groupMembers[groupId] = members;
                    callback(members);
                };
                groupDatProvider.getMembers(groupId, cacheMembers);
            }
        };

        var groupHandle = function(grupId, callback) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (groupId == data[i].group.id) {
                    callback(i);
                    break;
                }
            }
        };
        var dismiss = function(groupId) {
            groupDatProvider.dismiss(groupId, function() {
                groupHandle(groupId, function(index) {
                    data.splice(i, 1);
                    delete groupMembers[groupId];
                });
            });
        };
        var setPortaitUri = function(groupId, portraitUri) {
            groupDatProvider.setPortaitUri(groupId, bulletin, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.portraitUri = portraitUri;
                });
            });
        };
        var rename = function(groupId, name) {
            groupDatProvider.rename(groupId, displayName, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.name = name;
                });
            });
        };
        var setNotice = function(groupId, bulletin, callback) {
            groupDatProvider.setNotice(groupId, bulletin, function() {
                callback();
            });
        };
        var _pushGrups = function(groups) {
            data = groups;
        };
        GroupDataProvider.get(function(data) {
            _pushGrups(data.result);
        });

        return {
            create: create,
            join: join,
            quit: quit,
            get: get,
            dismiss: dismiss,
            transferManager: transferManager,
            setNotice: setNotice,
            setPortaitUri: setPortaitUri,
            setDisplayName: setDisplayName,
            rename: rename,
            getMembers: getMembers,
            addMember: addMember,
            kickMember: kickMember
        };
    })(GroupDataProvider);

    /** Group DataModel end region */

    /** Conversation DataModel region */
    var ConversationDataProvider = {
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

    var bindUser = function(data, callback) {
        var process = function(user) {
            data.user = user;
            callback && callback(data);
        };
        if (data.conversationType == RongIMLib.ConversationType.PRIVATE) {
            User.get(data.senderUserId || data.targetId, process);
        } else if (data.conversationType == RongIMLib.ConversationType.GROUP) {
            if (data.latestMessage) {
                Group.get(process, data.targetId);
            } else {
                User.get(data.senderUserId, process);
            }
        } else {
            // TODO 扩展
            process({});
        }
    };

    var composeUserInfo = function(data, callback) {
        if (getPrototype.call(data) == '[object Array]') {
            for (var i = 0, len = data.length; i < len; i++) {
                bindUser(data[i]);
            }
            callback(data);
        } else {
            bindUser(data, callback);
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
        var hidden = function(conversationType, targetId) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    removeConversation(i, conversationType, targetId);
                    break;
                }
            }
        };
        var remove = function(conversationType, targetId, remote) {
            conDataProvider.remove(conversationType, targetId);
            hidden(conversationType, targetId);
        };

        watcher('Conversation', function(data) {
            data = data || RongIMClient._memoryStore.conversationList.slice(0, 1)[0];
            set(data);
        });

        return {
            hidden: hidden,
            remove: remove,
            set: set,
            get: get,
            clearUnReadCount: clearUnReadCount,
            watch: watch
        };
    })(ConversationDataProvider);

    /** Conversation DataModel end region */

    /** Message DataModel region */
    var getMessageId = function() {
        return RongIMLib.MessageIdHandler.messageId + 1;
    };
    var genLocalMsg = function(params) {
        var msg = new RongIMLib.Message();
        msg.content = params.content;
        msg.conversationType = params.conversationType;
        msg.targetId = params.targetId;
        msg.senderUserId = currentUserId;
        msg.sentStatus = RongIMLib.SentStatus.SENDING;
        msg.messageId = getMessageId();
        msg.messageType = params.content.messageName;
        return msg;
    };
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
            callback(genLocalMsg(params));
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
                emit('Conversation');
                Message.watch(message);
            });

        };
        // params: conversationType, targetId, content, pushContent
        var send = function(params) {
            messageDataProvider.sendMessage(params, function(message) {
                _push(message);
            });
        };
        watcher('Message', function(message) {
            Message._push(message);
        });
        var userModel = {
            set: set,
            get: get,
            send: send,
            watch: watch,
            TextMessage: RongIMLib.TextMessage,
            MessageDataProvider: messageDataProvider
        };
        // 动态暴露 RongIMLib Message 相关属性。
        var bindings = ['TextMessage', 'FileMessage', 'ImageMessage'];
        loop(bindings, function(proto) {
            userModel[proto] = RongIMLib[proto];
        });
        return userModel;
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
                onSuccess: function(userId) {
                    currentUserId = RongIMClient.getInstance().getCurrentUserId();
                },
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
        watcher('Status', function(status) {
            _push(status);
        });
        var statusModel = {
            get: get,
            connect: connect,
            disconnect: disconnect,
            watch: watch
        };
        // 动态暴露 RongIMLib 状态相关属性。
        var bindings = ['ConnectionStatus'];
        loop(bindings, function(proto) {
            statusModel[proto] = RongIMLib[proto];
        });
        return statusModel;
    })();
    /** Status DataModel end region */

    /**
        var config = {
            appkey:'',
            dataAccessProvider:null,
            im:{},
            sdk:{navi:''}
        };
    */
    var init = function(config) {
        RongIMClient.init(config.appkey, config.dataAccessProvider, config.sdk);
        RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
                emit('Status', status);
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            onReceived: function(message) {
                emit('Message', message);
            }
        });

        return {
            User: User,
            Group: Group,
            Friend: Friend,
            Conversation: Conversation,
            Message: Message,
            Status: Status,
            option: option
        };
    };

    win.RongDataModel = {
        init: init
    };
})(window, RongIMLib, RongIMClient);