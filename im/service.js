'use strict';
(function(win, RongIMLib, RongIMClient) {
    var currentUserId = '';
    var option = (function() {
        return {
            max_msg_count: 20,
            max_conversation_count: 50,
            get_historyMsg_count: 5,
            server_path: 'http://dev.api.rce.rongcloud.net:8080/rce/api/',
            group_head_count: 9,
            data: [] //'User', 'Group'
        };
    })();

    /** 工具类 */
    function ObserverList() {

        var checkIndexOutBound = function(index, bound) {
            return index > -1 && index < bound;
        };

        this.observerList = [];

        this.add = function(observer, force) {
            force && (this.observerList.length = 0);
            this.observerList.push(observer);
        };

        this.get = function(index) {
            if (checkIndexOutBound(index, this.observerList.length)) {
                return this.observerList[index];
            }
        };

        this.count = function() {
            return this.observerList.length;
        };

        this.removeAt = function(index) {
            checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
        };

        this.indexOf = function(observer, startIndex) {
            var i = startIndex || 0,
                len = this.observerList.length;
            while (i < len) {
                if (this.observerList[i] === observer) {
                    return i;
                }
                i++;
            }
            return -1;
        };
    }

    var forEach = function(object, callback) {
        for (var key in object) {
            callback(key, object[key]);
        }
    };

    var loop = function(arrs, callback) {
        for (var i = 0, len = arrs.length; i < len; i++) {
            callback.process(arrs[i], i);
        }
        callback.completed && callback.completed();
    };

    /*
        var obj = {a: 1, b:2}
        var item = {a:'A' }
        convertProto(obj, item);
       => {A:1, b:2}
     */
    var convertProto = function(obj, item) {
        for (var key in obj) {
            if (key in item) {
                obj[item[key]] = obj[key];
                delete obj[key];
            }
        }
        return obj;
    };

    var getPrototype = Object.prototype.toString;

    var events = {}; // 事件存储格式:events.MessageWatcher : [fun1, fun2]
    var emit = function(name, data) {
        if (name in events) {
            for (var i = 0, len = events[name].length; i < len; i++) {
                events[name][i](data);
            }
        }
    };

    var destroy = function(name) {
        delete events[name];
    };

    var watcher = function(name, func, override) {
        if (typeof func != 'function' || typeof name != 'string') return;
        override && destroy(name);
        events[name] = events[name] || [];
        events[name].push(func);
    };



    /**
     * options.headers :{}
     * options.method :'POST'
     * options.data :{}  
     * options.success :{}
     * options.error :{}  
     */
    var request = function(url, options) {
        var method = options.method || 'GET';
        options.headers || (options.headers = {
            'Content-Type': 'application/json; charset=utf-8'
        });
        var done = function(status, responseText) {
            var isSuccess = status >= 200 && status < 300 || status === 304;
            var result = isSuccess ? JSON.parse(responseText) : {
                code: status,
                msg: responseText
            };
            options.success(result);
        };
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                done(xhr.status, xhr.responseText);
            }
        };
        xhr.open(method, url, true);
        xhr.withCredentials = true; //TODO
        forEach(options.headers, function(key, value) {
            xhr.setRequestHeader(key, value);
        });
        xhr.send(options.data);
    };

    var jsonStringify = function(obj) {
        return JSON.stringify(obj);
    };
    // 数据格式:var user = {zhangsan:{id:'zhangsan',name:'name'}};
    var userFormat = function(data, callback) {
        for (var i = 0, len = data.length; i < len; i++) {
            var user = data[i].user || data[i],
                obj = {};
            obj[user.id] = user;
            callback(obj);
        }
    };

    var deptTree = (function() {
        var data = {};

        var getPath = function(deptId) {
            var path = [];
            while (deptId in data) {
                if (data[deptId].parent_id == '') {
                    break;
                }
                var parentId = data[deptId].parent_id;
                path.unshift(parentId);
                deptId = parentId;
            }
            return path.join(',');
        };

        var getNames = function(ids, callback) {
            var depts = [];
            loop(ids, {
                process: function(id) {
                    depts.unshift(data[id]);
                },
                completed: function() {
                    callback(depts);
                }
            });
        };

        watcher('Fetch_DeptTree', function(callback) {
            var url = genUrl('departments/tree');
            request(url, {
                success: function(result) {
                    loop(result.result.data, {
                        process: function(item) {
                            data[item.id] = item;
                        },
                        completed: function() {
                            callback();
                        }
                    });
                }
            });
        });

        return {
            getPath: getPath,
            getNames: getNames
        }
    })();

    var genUrl = function(url) {
        return option.server_path + url;
    };

    var userPath = {
        login: 'user/login',
        logout: 'user/logout',
        changePassword: 'user/password/change',
        checkMobile: '',
        sendCode: 'user/verification/send',
        verifyCode: 'user/verification/verify',
        resetPassword: 'user/password/reset',
        get: 'staffs/batch'
    };

    var UserDataProvider = {
        login: function(params, callback) {
            var url = genUrl(userPath.login);
            request(url, {
                method: 'POST',
                data: jsonStringify(params),
                success: callback
            });
        },

        logout: function(callback) {
            var url = genUrl(userPath.logout);
            request(url, {
                method: 'POST',
                success: callback
            });
        },

        changePassword: function(oldPassword, newPassword, callback) {
            var url = genUrl(userPath.changePassword);
            var data = {
                password: oldPassword,
                new_password: newPassword
            };
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },

        checkMobile: function(mobile, callback) {
            // 缺接口
        },

        sendCode: function(mobile, callback) {
            // 缺接口
        },

        verifyCode: function(params, callback) {
            // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_verify_code
        },

        resetPassword: function(params, callback) {
            // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_reset_password
        },

        get: function(userIds, callback) {
           var data = { ids: userIds};
           var url = genUrl(userPath.get);
           request(url, {
                data: jsonStringify(data),
                success: callback
           });
        }

    };

    var User = (function(userProvider, ObserverList) {
        /*
         * war params = { username:"13671101652", password: "123456"}
         */
        var login = function(params, callback) {
            userProvider.login(params, function(result) {
                callback(result.code, result.result);
            });
        };

        var logout = function(callback) {
            userProvider.logout(function(result) {
                callback(result.code, result.result);
            });
        };

        var changePassword = function(oldPassword, newPassword, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_change_password
        };

        var checkMobile = function(mobile, callback) {
            // 缺接口
        };

        var sendCode = function(mobile, callback) {
            // 缺接口
        };

        var verifyCode = function(params, callback) {
            // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_verify_code
        };

        var resetPassword = function(params, callback) {
            // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_reset_password
        };

        var get = function(userIds, callback) {
            userProvider.get(userIds, function(result){
                callback(result.code, result.data);
            });
        };

        return {
            login: login,
            logout: logout,
            changePassword: changePassword,
            checkMobile: checkMobile,
            sendCode: sendCode,
            verifyCode: verifyCode,
            resetPassword: resetPassword,
            get: get
        };
    })(UserDataProvider, ObserverList);

    var groupPath = {
        getAll: 'favgroups',
        create: 'groups',
        rename: '',
        getMembers: '',
        addMembers: '',
        removeMembers: '',
        quit: '',
        dismiss: ''
    };

    var GroupDataProvider = {

        getAll: function(callback) {
            var url = genUrl(groupPath.getAll);
            request(url, {
                success: callback
            })
        },

        create: function(group, memberIdList, callback) {
           var url = genUrl(groupPath.create);
           var data = {};
           request(url, {
             method: 'POST',
             data: jsonStringify(data),
             success: callback
           });
        },

        rename: function(groupId, name, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_modify_group_name
        },

        getMembers: function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_group_memeber_list
        },

        addMembers: function(groupId, memberIds, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_invite_into_group
        },

        removeMembers: function(groupId, memberIds, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_remove_from_group
        },

        quit: function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_quit_group
        },

        dismiss: function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_delete_group
        }
    };

    var Group = (function(groupDataProvider, ObserverList) {
        var getAll = function(callback) {
            groupDataProvider.getAll(function(result){

            });
        };

        var create = function(group, memberIdList, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_create_group
        };

        var rename = function(groupId, name, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_modify_group_name
        };

        var getMembers = function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_group_memeber_list
        };

        var addMembers = function(groupId, memberIds, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_invite_into_group
        };

        var removeMembers = function(groupId, memberIds, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_remove_from_group
        };

        var quit = function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_quit_group
        };

        var dismiss = function(groupId, callback) {
            // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_delete_group
        };

        return {
            getAll: getAll,
            create: create,
            rename: rename,
            getMembers: getMembers,
            addMembers: addMembers,
            removeMembers: removeMembers,
            quit: quit,
            dismiss: dismiss
        };
    })(GroupDataProvider, ObserverList);

    /** Group DataModel end region */

    /** Conversation DataModel region */

    /**
     * 会话模型数据接口
     * @namespace ConversationProvider
     */
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
        getTotalUnreadCount: function(conversationTypes, callback) {
            RongIMClient.getInstance().getConversationUnreadCount(conversationTypes, {
                onSuccess: function(count) {
                    callback(count);
                },
                onError: function(error) {}
            });
        },
        clearUnReadCount: function(conversationType, targetId) {
            RongIMLib.RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(count) {},
                onError: function() {}
            });
        },
        remove: function(conversationType, targetId, callback) {
            RongIMClient.getInstance().removeConversation(conversationType, targetId, {
                onSuccess: function(bool) {
                    callback.onSuccess();
                },
                onError: function(error) {
                    callback.onError(error);
                }
            });
        }
    };

    var Conversation = (function(conDataProvider, ObserverList) {

    })(ConversationDataProvider, ObserverList);

    /** Conversation DataModel end region */

    /** Message DataModel region */

    /**
     *  @namespace Message
     */

    /**
     * 会话模型数据接口
     * @namespace MessageProvider
     */

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
        msg.messageDirection = RongIMLib.MessageDirection.SEND;
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
            }, params.mentiondMsg, params.pushText, params.appkey, params.methodType);
        },
        setRecvivedStatus: function(uId, status, callback) {
            RongIMLib.RongIMClient.getInstance().setMessageReceivedStatus(uId, status, {
                onSuccess: function(isOk) {
                    callback(isOk);
                },
                onError: function(error) {

                }
            });
        }
    };

    var Message = (function(messageDataProvider, ObserverList) {

    })(MessageDataProvider, ObserverList);
    /** Message DataModel end region */

    /** Status DataModel region */

    var starPath = {
        all: 'contacts',
        star: 'contacts',
        unstar: 'contacts',
        set_display_name: 'contacts/{cid}/alias'
    };

    var StarProvider = {
        getAll: function(callback) {
            var url = genUrl(starPath.all);
            request(url, {
                method: 'GET',
                success: callback
            });
        },
        star: function(info, callback) {
            var url = genUrl(starPath.star);
            request(url, {
                method: 'POST',
                data: jsonStringify(info),
                success: callback
            });
        },
        unstar: function(info, callback) {
            var url = genUrl(starPath.unstar);
            request(url, {
                method: 'DELETE',
                data: jsonStringify(info),
                success: callback
            });
        },
        setDisplayName: function(info, callback) {
            var url = genUrl(starPath.set_display_name.replace(/{cid}/, info.targetId));
            request(url, {
                method: 'PUT',
                data: jsonStringify(info),
                success: callback
            });
        }
    };

    var Star = (function(starProvider, ObserverList) {
        var data = [],
            map = {};
        var getAll = function(callback) {
            callback(null, data);
        };

        var _process = function(item) {
            item.path = deptTree.getPath(item.depart_id);
            item = convertProto(item, {
                'portrait_url': 'avatar'
            });
            item.star = true;
            map[item.id] = item;
        };

        var star = function(targetId, callback) {
            targetId = getPrototype.call(targetId) == '[object Array]' ? targetId : [targetId];
            var info = {
                ids: targetId
            };
            starProvider.star(info, function(result) {
                if (result.code == 1000) {
                    User.get(targetId, function(code, ret) {
                        loop(ret, {
                            process: _process
                        });
                    });
                }
                callback(result.code, result.result);
            });
        };

        var unstar = function(targetId, callback) {
            starProvider.unstar(targetId, function(result){
                delete map[targetId];
                callback(result.code, result.result);
            });
        };
        /*
         * var info =  { targetId:'', alias: 'alias' } 
         */
        var setDisplayName = function(info, callback) {
            starProvider.setDisplayName(info, function(result){
                // update local name
                loop(data, {
                    process: function(item){
                        if (item.id == info.targetId) {
                            item.alias = info.alias;
                        }
                    },
                    completed: function(){
                        callback(null, result.code);
                    }
                });
            });
        };


        watcher('Fetch_Star', function(callback) {
            starProvider.getAll(function(result) {
                var stars = result.result.data;
                loop(stars, {
                    process: _process,
                    completed: function() {
                        data = stars;
                        callback();
                    }
                });
            });
        });

        return {
            getAll: getAll,
            star: star,
            unstar: unstar,
            setDisplayName: setDisplayName,
            map: map
        };

    })(StarProvider, ObserverList);

    var OrganPath = {
        getCompany: 'company',

        getDept: 'departments/{did}/branches',

        search: 'departs/new/search/{keyword}',

        getMembers: 'departs/new/{id}/members'
    };

    var OrganizationProvider = {

        getCompany: function(callback) {
            var url = genUrl(OrganPath.getCompany);
            request(url, {
                success: callback
            });
        },

        getDept: function(id, callback) {
            var url = genUrl(OrganPath.getDept.replace(/{did}/, id));
            request(url, {
                success: callback
            });
        },

        search: function(keyword, callback) {

        },

        getMembers: function(deptId, callback) {

        }
    };

    var Organization = (function(organProvider) {

        var getCompany = function(callback) {
            organProvider.getCompany(function(result) {
                callback(result.code, result.result);
            });
        };

        // 根据部门id查询直属成员 + 直属部门
        var getDept = function(id, callback) {
            organProvider.getDept(id, function(result) {
                var dept = convertProto(result.result, {
                    id: 'deptId',
                    count: 'memberCount'
                });
                dept.path = deptTree.getPath(dept.id);

                var members = [],
                    depts = [];

                dept.data = dept.data || [];
                loop(dept.data, {
                    process: function(item) {
                        item.type ? depts.push(item) : members.push(item);
                    },
                    completed: function() {
                        delete dept.data;
                        dept.members = members;
                        dept.depts = depts;
                        callback(dept.code, dept);
                    }
                })
            });
        };

        // 根据部门id数组查询部门名称
        var getDeptNames = function(idList, callback) {
            deptTree.getNames(idList, function(result) {
                callback(null, result);
            });
        };

        // 搜索企业通讯录，只匹配人名
        var search = function(keyword, callback) {
            // 未找到相应接口
        };

        // 取得部门下的所有人
        var getMembers = function(deptId, callback) {
            // 接口暂未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_department_all
        };

        return {
            getCompany: getCompany,
            getDept: getDept,
            getDeptNames: getDeptNames,
            search: search,
            getMembers: getMembers
        };
    })(OrganizationProvider);

    var Status = (function(ObserverList) {
        var data = -2;

        var observerList = new ObserverList();

        var notify = function(status) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(status);
            }
        };

        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };

        var get = function() {
            return data;
        };

        var connect = function(token) {
            RongIMClient.connect(token, {
                onSuccess: function(userId) {
                    currentUserId = RongIMClient.getInstance().getCurrentUserId();
                },
                onTokenIncorrect: function() {
                    notify(RongIMLib.ConnectionState.TOKEN_INCORRECT);
                },
                onError: function(errorCode) {
                    notify(errorCode);
                }
            });
        };

        var disconnect = function() {
            RongIMClient._memoryStore.conversationList.length = 0; // SDK TODO 
            RongIMClient.getInstance().logout();
        };
        var _push = function(status) {
            data = status;
            notify(status);
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
        loop(bindings, {
            process: function(proto) {
                statusModel[proto] = RongIMLib[proto];
            }
        });
        return statusModel;
    })(ObserverList);

    var fetchData = function(callback) {
        var kinds = option.data,
            index = 0,
            len = kinds.length;

        var fetch = function(name) {
            // index >= len kinds 为空数组
            if (index >= len) {
                callback();
            }
            emit(name, function() {
                fetch('Fetch_' + kinds[index]);
            });
            index++;
        };

        fetch('Fetch_' + kinds[index]);
    };

    var init = function(config) {
        if (config && config.dm) {
            var imOpts = config.dm;
            forEach(imOpts, function(key, value) {
                option[key] = value;
            });
        }

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
            Conversation: Conversation,
            Message: Message,
            Status: Status,
            Star: Star,
            Organization: Organization,
            option: option,
            fetchData: fetchData,
            deptTree: deptTree
        };
    };

    win.RongDataModel = {
        init: init
    };

})(window, RongIMLib, RongIMClient);