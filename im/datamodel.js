/**
 * 初始化数据模型可以得到如下模型：
 * @namespace RongDataModel
 * @property {object}  User         - {@link User} 
 * @property {object}  Group        - {@link Group} 
 * @property {object}  Friend       - {@link Friend} 
 * @property {object}  Conversation - {@link Conversation} 
 * @property {object}  Message      - {@link Message} 
 * @property {object}  Status       - {@link Status} 
 */

'use strict';
(function(win, RongIMLib, RongIMClient) {
    var currentUserId = '';
    var option = (function() {
        return {
            max_msg_count: 20,
            max_conversation_count: 50,
            get_historyMsg_count: 5,
            // 接口测试服务
            server_path: 'http://10.10.112.167:3587/',
            group_head_count: 9,
            data: [] //'User', 'Group', 'Friend', 'GroupHead'
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
            callback(arrs[i], i);
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
            if (isSuccess) {
                options.success && options.success(JSON.parse(responseText));
            } else {
                var error = {
                    code: status,
                    msg: responseText
                };
                options.error && options.error(responseText);
            }
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

    /**
       @namespace User
    */

    /**
        用户模型数据接口
        @namespace UserProvider
    */

    /**
     * 请求数据 url, 如果你用到用户模块，可以以根据下面的 url 进行重写服务。
     * @memberof UserProvider
     * @enum {string}
     */
    var userPath = {
        /** 获取全部用户信息 */
        all: 'user/all',
        /** 获取用户信息 */
        get: 'user/info/{userId}',
        /** 修改用户信息 */
        upate: 'user/{userId}/update',
        /** 登录 */
        login: 'user/login',
        /** 退出 */
        logout: 'user/logout',
        /** 修改密码 */
        change_pwd: 'user/change_password',
        /** 批量获取用户信息 */
        batch: 'user/batch',
        /** 修改自己的昵称 */
        set_nickname: 'user/set_nickname',
        /** 重置密码 */
        reset_pwd: 'user/reset_password',
        /** 发送验证码 */
        send_code: 'user/send_code',
        /** 校验验证码 */
        verify_code: 'user/verify_code',
        /** 检查手机号是否可用 */
        check_phone_available: 'user/check_phone_available',
        /** 注册 */
        register: 'user/register'
    };

    var fetchModelData = function(kinds, callback) {
        var count = 0,
            len = kinds.length;
        watcher('FetchEnd', function() {
            count++;
            if (count == len) {
                callback && callback();
            }
        });
        for (var i = 0; i < len; i++) {
            var key = 'Pull_' + kinds[i];
            emit(key);
        }
    };

    var genUrl = function(url) {
        return option.server_path + url;
    };
    var ingoreUser = {};
    /**
        @memberof User
     */
    var UserDataProvider = {
        /** 
         *   获取用户信息
         *   @memberof UserProvider 
         *   @param {string}     userId      - 用户 Id 
         *   @param {function}   callback    - 函数回调
         */
        get: function(userId, callback) {
            // TODO 需要调整 DemoServer 获取不存在用户信息返回的错误码 ，以下为临时代码(切换 DemoServer 时修改)
            if (userId == '__system__') {
                callback({
                    user: {}
                });
            } else {
                var url = genUrl(userPath.get.replace(/{userId}/, userId));
                request(url, {
                    success: function(data) {
                        callback(data.result);
                    }
                });

            }
            // 正式
            // if (userId in ingoreUser) {
            //     callback({});
            //     return;
            // }
            // request(userPath.get.replace(/{userId}/, userId), null, function(data){
            //     if (data.code == '用户不存在的 code') {
            //         ingoreUser[userId] = '';
            //     }else{
            //         callback(data.result);
            //     }
            // });
        },
        batch: function(userIds, callback) {
            // TODO 修改 Demo Server batch 接口
            var ids = userIds.join('&id=');
            var url = genUrl(userPath.batch + '?id=' + ids);
            request(url, {
                success: callback
            });
        },
        /** 
         *   获取全部用户信息
         *   @memberof UserProvider 
         *   @param {function}   callback    - 函数回调
         */
        getAll: function(callback) {
            var url = genUrl(userPath.all);
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        /** 
         * 修改用户信息
         * @memberof UserProvider 
         * @param {array|string}     users       - 用户或者用户数组
         * @param {function}         callback    - 函数回调
         */
        update: function(users, callback) {
            callback(users);
        },
        login: function(info, callback) {
            var url = genUrl(userPath.login);
            request(url, {
                method: 'POST',
                data: jsonStringify(info),
                success: callback,
                error: callback
            });
        },
        logout: function(callback) {
            var url = genUrl(userPath.logout);
            request(url, {
                method: 'POST',
                success: callback
            });
        },
        changePwd: function(pwd, callback) {
            var url = genUrl(userPath.change_pwd);
            request(url, {
                data: jsonStringify(pwd),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        resetPwd: function(pwd, callback) {
            var url = genUrl(userPath.reset_pwd);
            request(url, {
                data: jsonStringify(pwd),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        setNickname: function(name, callback) {
            var url = genUrl(userPath.set_nickname);
            var data = {
                nickname: name
            };
            request(url, {
                data: jsonStringify(data),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        sendCode: function(phone, callback) {
            var url = genUrl(userPath.send_code);
            request(url, {
                data: jsonStringify(phone),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        verifyCode: function(code, callback) {
            var url = genUrl(userPath.verify_code);
            request(url, {
                data: jsonStringify(code),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        checkPhone: function(phone, callback) {
            var url = genUrl(userPath.check_phone_available);
            request(url, {
                data: jsonStringify(phone),
                method: 'POST',
                success: callback,
                error: callback
            });
        },
        register: function(user, callback) {
            var url = genUrl(userPath.check_phone_available);
            request(url, {
                data: jsonStringify(user),
                method: 'POST',
                success: callback,
                error: callback
            });
        }
    };

    var User = {};

    User.login = function (params, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_login
    };

    User.logout = function (callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_logout
    };

    User.changePassword = function (oldPassword, newPassword, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_change_password
    };

    User.checkMobile = function (mobile, callback) {
        // 缺接口
    };

    User.sendCode = function (mobile, callback) {
        // 缺接口
    };

    User.verifyCode = function (params, callback) {
        // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_verify_code
    };

    User.resetPassword = function (params, callback) {
        // 接口未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_user_reset_password
    };

    User.get = function (userIds, callback) {
        // 1. Organization.getOneMember(userId, callback);
        // 2. 补充字段：是否星标 + 备注
    };

    var User = (function(userProvider, ObserverList) {
        var data = {};
        var observerList = new ObserverList();
        var notify = function(user) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(user);
            }
        };
        /** 
         * 监听
         * @memberof User 
         * @param {object}     obsever     - 监听回调
         * @param {string}     force - 是否覆盖其他对调
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           _instance.User.watch(function(user){
              
           },force);
         */
        var watch = function(observer, force) {
            observerList.add(observer, force);
        };
        /** 
         *   登录
         *   @memberof User 
         *   @param {object}     info     - 登录所需对象
         *   @param {string}     info.password - 密码
         *   @param {string}     info.phone - 手机号
         *   @param {string}     info.region - 号码区域标识
         *   @param {function}   callback - 登录结果在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var info = {
                password:'admin000', 
                phone:'13269772769', 
                region:'86'
             };
             _instance.User.login(info, function(result){
                // result => {code:200, resut:{id:'userId', token:'token'}}
             });
         */
        var login = function(info, callback) {
            userProvider.login(info, function(result) {
                callback(result);
            });
        };
        /** 
         * 登出
         * @memberof User 
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           _instance.User.logout(function(result){
              // result => {code:200}
           });
         */
        var logout = function(callback) {
            userProvider.logout(function(result) {
                var methods = option.data.concat(['Conversation', 'Message']);
                for (var i = 0, len = methods.length; i < len; i++) {
                    var key = 'Clear_' + methods[i];
                    emit(key);
                }
                callback && callback(result);
            });
        };
        /** 
         * 根据老密码修改密码
         * @memberof User 
         * @param {object}   pwd - 密码信息
         * @param {string}   pwd.newPassword - 新密码
         * @param {string}   pwd.oldPassword - 老密码
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var pwd = {
                newPassword:'',
                oldPassword:''
            };
           _instance.User.changePwd(pwd, function(result){
              // result => {code:200}
           });
         */
        var changePwd = function(pwd, callback) {
            userProvider.changePwd(pwd, callback);
        };
        /** 
         * 手机号重置密码
         * @memberof User 
         * @param {object}   pwd - 密码信息
         * @param {string}   pwd.password - 密码
         * @param {string}   pwd.verification_token - 验证码的返回值
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var pwd = {
                password:'',
                verification_token:''
            };
           _instance.User.resetPwd(pwd, function(result){
              // result => {code:200}
           });
         */
        var resetPwd = function(pwd, callback) {
            userProvider.resetPwd(pwd, callback);
        };
        /** 
         * 发送验证码
         * @memberof User 
         * @param {object}   phone - 手机号信息
         * @param {string}   phone.region - 区域标识
         * @param {string}   phone.phone - 手机号
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var phone = {
                region: 86
                phone: 13269772769
            };
           _instance.User.sendCode(phone, function(result){
              // result => {code:200}
           });
         */
        var sendCode = function(phone, callback) {
            userProvider.sendCode(phone, callback);
        };
        /** 
         * 校验验证码
         * @memberof User 
         * @param {object}   code - 验证码信息
         * @param {string}   code.region - 区域标识
         * @param {string}   code.phone - 手机号
         * @param {string}   code.code - 验证码
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var code = {
                code: 374871
                region: 86
                phone: 13269772769
            };
           _instance.User.verifyCode(code, function(result){
              // result => {code:200, result:{verification_token:'ae667280-df77-11e5-bf19-6a8969f914'}}
           });
         */
        var verifyCode = function(code, callback) {
            userProvider.verifyCode(code, callback);
        };
        /** 
         * 校验手机号
         * @memberof User 
         * @param {object}   phone - 手机号信息
         * @param {string}   phone.region - 区域标识
         * @param {string}   phone.phone - 手机号
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var phone = {
                region: 86
                phone: 13269772769
            };
           _instance.User.checkPhone(phone, function(result){
              // 手机号不可用 => {code:200, result:false, message: 'Phone number has already existed.'}
              // 手机号可用 => {code:200, result:true}
           });
         */
        var checkPhone = function(phone, callback) {
            userProvider.checkPhone(phone, callback);
        };
        /** 
         * 注册
         * @memberof User 
         * @param {object}   user - 用户注册信息
         * @param {string}   user.nickname - 名称
         * @param {string}   user.password - 密码
         * @param {string}   user.verificationToken - 验证码 token [校验验证码] 方法响应中获取
         * @param {function}   callback - 登录结果在 callback 中返回
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var user = {
                nickname: 'Martin'
                password: '808fk&893',
                verificationToken: 'ae667280-df77-11e5-bf19-6a8969f914'
            };
           _instance.User.checkPhone(user, function(result){
              // result => {code:200}
           });
         */
        var register = function(user, callback) {
            userProvider.register(user, callback);
        };
        /** 
         *   修改用户信息
         *   @memberof User 
         *   @param {array|string}     users   - 用户或者用户数组
         *   @see {@link UserProvider} 
         *   @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var user = {id:'userId', name:'username', portraitUri:'http://xxx.xxx.com/portait.png'};
             _instance.User.set(user);
         */
        var set = function(userIds) {
            userProvider.update(users, function(result) {
                forEach(result, function(userId, user) {
                    data[userId] = user;
                });
            });
        };
        /** 
         *   获取用户信息
         *   @memberof User 
         *   @param {string}     userId   - 用户 Id
         *   @param {function}   callback - 用户信息在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var userId = 'xxx';
             _instance.User.get(userId, function(user){
                // user: 用户信息
             });
         */
        var get = function(userId, callback) {
            if (userId in data) {
                callback && callback(data[userId]);
                return data[userId];
            } else {
                userProvider.get(userId, function(user) {
                    if (user) {
                        var userId = user.id;
                        data[userId] = data[userId] || {};
                        forEach(user, function(key, value) {
                            data[userId][key] = value;
                        });
                    }
                    callback && callback(user);
                });
            }
        };
        var batch = function(userIds, callback) {
            userProvider.batch(userIds, function(result) {
                var users = result.result;
                loop(users, function(user) {
                    data[user.id] = user;
                });
                callback(users);
            });
        };
        /** 
         *   获取全部用户, 此方不从服务器获取用户信息
         *   返回值数据格式 var users = {userId1:{id:'userId1',name:'name'}};
         *   @memberof User 
         *   @param {array}      userIds - 用户 Id 数组
         *   @param {function}   callback - 用户信息在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var userIds = ['userId1', 'userId2'];
             _instance.User.getUsers(userIds, function(users){
                // users 用户信息
                // 数据接口 {userId1:{id:'userId1',name:'name'}, userId2:{id:'userId2',name:'name'}}
             });
         */
        var getUsers = function(userIds, callback) {
            var users = {};
            for (var i = 0, len = userIds.length; i < len; i++) {
                var userId = userIds[i];
                if (userId in data) {
                    users[userId] = data[userId];
                }
            }
            callback(users);
        };
        /** 
         * 设置自己的昵称
         * @memberof User 
         * @param {name}       userIds - 昵称
         * @see {@link UserProvider}
           @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var nickname = 'Martin'
           _instance.User.setNickname(nickname, function(result){
                // result => {code: 200}
           });
         */
        var setNickname = function(name, callback) {
            userProvider.setNickname(name, function(result) {
                if (data[currentUserId]) {
                    data[currentUserId].nickname = name;
                }
                callback && callback(result);
                notify(data[currentUserId]);
            });
        };

        var _push = function(userId, user) {
            if (data[userId]) {
                forEach(user, function(key, value) {
                    data[userId][key] = value;
                });
            } else {
                data[userId] = user;
            }

        };
        watcher('User', function(data) {
            if(Array.isArray(data)) {
                data.forEach(function (user) {
                    _push(user.id, user);
                });
            } else {
                forEach(data, function(userId, user) {
                    _push(userId, user);
                });
            }
        });

        watcher('Pull_User', function() {
            UserDataProvider.getAll(function(data) {
                emit('User', data);
                emit('FetchEnd');
            });
        });

        watcher('Clear_User', function() {
            data = {};
        });

        return {
            login: login,
            logout: logout,
            changePwd: changePwd,
            set: set,
            get: get,
            getUsers: getUsers,
            batch: batch,
            setNickname: setNickname,
            resetPwd: resetPwd,
            sendCode: sendCode,
            verifyCode: verifyCode,
            checkPhone: checkPhone,
            register: register,
            watch: watch,
            data: data
        };
    })(UserDataProvider, ObserverList);
    /** User DataModel end region */

    /** Friend DataModel region */

    /**
     *  @namespace Friend
     */

    /**
     * 好友模型数据接口
     * @namespace FriendProvider
     */

    /**
     * 请求数据 url, 如果你用到好友模块，可以以根据下面的 url 进行重写服务。
     * @memberof FriendProvider
     * @enum {string}
     */
    var friendPath = {
        /** 获取好友列表 */
        all: 'friendship/all',
        /** 申请加好友 */
        invite: 'friendship/invite',
        /** 同意加好友 */
        agree: 'friendship/agree',
        /** 忽略加好友请求 */
        ignore: 'friendship/ignore',
        /** 删除好友 */
        remove: 'friendship/delete',
        /** 设置好友备注 */
        setDisplayName: 'friendship/set_display_name'
    };

    var FriendDataProvider = {
        /** 
         * 请求加要好友  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 邀请结果在 callback 中返回
         */
        invite: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            var url = genUrl(friendPath.invite);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 获取全部好友列表  
         * @memberof FriendProvider 
         * @param {function}   callback - 好友列表在 callback 中返回
         */
        getAll: function(callback) {
            var url = genUrl(friendPath.all);
            request(url, {
                success: callback
            });
        },
        /** 
         * 同意加好友  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 同意结果 callback 中返回
         */
        agree: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            var url = genUrl(friendPath.agree);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 忽略加好友请求  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 忽略 callback 中返回
         */
        ignore: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            var url = genUrl(friendPath.ignore);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 设置好友备注名称  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {string}     displayName - 备注名称
         * @param {function}   callback -  返回结果
         */
        setDisplayName: function(friendId, displayName, callback) {
            var data = {
                friendId: friendId,
                displayName: displayName
            };
            var url = genUrl(friendPath.setDisplayName);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 删除好友 
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 同意结果 callback 中返回
         */
        remove: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            var url = genUrl(friendPath.remove);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        }
    };

    var Friend = (function(friendDataProvider, ObserverList) {
        var observerList = new ObserverList();
        var notify = function(friends) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(friends);
            }
        };
        var data = [];
        /** 
          * 好友数据变化监控方法
          * @memberof Friend 
          * @param {string}     friend - 好友 
            @example
            var _instance = RongDataModel.init({appkey:'appkey'});\
            _instance.Friend.watch = function(friend){
                 // 所有好友数据发生变化会触发 watch 
            };
          */
        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };
        /** 
         * 申请加好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.invite(friendId, functon(result){
                // 申请加好友结果
            });
         */
        var invite = function(friendId, callback) {
            friendDataProvider.invite(friendId, callback);
        };
        /** 
         * 同意加好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.agree(friendId, function(result){
               // 同意加好友结果
            });
         */
        var agree = function(friendId, callback) {
            //TODO 加好友成功后修改本地数据
            friendDataProvider.agree(friendId, callback);
        };
        /** 
         * 忽略加好友请求
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.ignore(friendId, function(result){
                //忽略加好友请求结果
            });
         */
        var ignore = function(friendId, callback) {
            friendDataProvider.ignore(friendId, callback);
        };
        var _success = function(result, cb) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].user.id == result.user.id) {
                    cb(i);
                    notify(data);
                    break;
                }
            }
        };
        /** 
         * 删除好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.remove(friendId);
         */
        var remove = function(friendId) {
            friendDataProvider.remove(friendId, function(result) {
                _success(result, function(index) {
                    data.splice(i, 1);
                });
            });
        };
        /** 
         * 设置好友备注
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @param {string}     displayName - 备注名称
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx', displayName = 'name';
            _instance.Friend.setDisplayName(friendId, displayName);
         */
        var setDisplayName = function(friendId, displayName) {
            friendDataProvider.setDisplayName(friendId, displayName, function(result) {
                _success(result, function(index) {
                    data[i] = result;
                });
            });
        };
        /** 
         * 获取好友列表
         * @memberof Friend 
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friends = _instance.Friend.get();
            @returns {array}
         */
        var get = function() {
            return data;
        };
        var _push = function(friends) {
            data = friends;
        };
        watcher('Pull_Friend', function() {
            FriendDataProvider.getAll(function(data) {
                _push(data.result);
                userFormat(data.result, function(user) {
                    emit('User', user);
                });
                emit('FetchEnd');
            });
        });

        watcher('Clear_Friend', function() {
            data.length = 0;
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
    })(FriendDataProvider, ObserverList);
    /** Friend DataModel end region*/

    /** Group DataModel region*/

    /**
     *  @namespace Group
     */

    /**
     * 群组模型数据接口
     * @namespace GroupProvider
     */

    /**
     * 请求数据 url, 如果你用到群组模块，可以以根据下面的 url 进行重写服务。
     * @memberof GroupProvider
     * @enum {string}
     */
    var groupPath = {
        /** 获取全部群组 */
        all: 'user/groups',
        /** 获取群成员 */
        members: 'group/info/{groupId}/members',
        /** 创建群 */
        create: 'group/create',
        /** 加入群 */
        join: 'group/join',
        /** 退出群 */
        quit: 'group/quit',
        /** 解散群 */
        dismiss: 'group/dismiss',
        /** 转让群主角色 */
        transfer: 'group/transfer',
        /** 发布群公告 */
        notice: 'group/set_bulletin',
        /** 设置群头像 */
        set_portrait_uri: 'group/set_portrait_uri',
        /** 设置自己的群昵称 */
        set_display_name: 'group/set_display_name',
        /** 群组重命名 */
        rename: 'group/rename',
        /** 踢人 */
        kick: 'group/kick',
        /** 加人 */
        add: 'group/add',
        /** 获取群头像信息 */
        head_info: 'group/{count}/head_info',

        add_to_address: 'group/add_to_address'
    };

    var GroupDataProvider = {
        /** 
         * 获取群组列表  
         * @memberof GroupProvider 
         * @param {function}   callback - 返回群组列表
         */
        get: function(callback) {
            var url = genUrl(groupPath.all);
            request(url, {
                success: callback
            });
        },
        /** 
         * 创建群  
         * @memberof GroupProvider 
         * @param {string}   name - 群名称
         * @param {array}    memberIds - 群成员 Id 数组
         * @param {function} callback - 返回群组列表
         * @param {Function} fail
         */
        create: function(group, memberIds, callback, fail) {
            var data = {
                name: group.name,
                memberIds: memberIds
            };
            group.portraitUri && (data.portraitUri = group.portraitUri);
            var url = genUrl(groupPath.create);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback,
                error: fail
            });
        },
        /** 
         * 创建群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回加群结果
         */
        join: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            var url = genUrl(groupPath.join);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 退出群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回退群结果
         */
        quit: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            var url = genUrl(groupPath.quit);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 解散群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回解散群结果
         */
        dismiss: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            var url = genUrl(groupPath.dismiss);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 转让群主角色  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   userId - 新群主的 userId
         * @param {function} callback - 返回转让群主结果
         */
        transferManager: function(groupId, userId, callback) {
            var data = {
                groupId: groupId,
                userId: userId
            };
            var url = genUrl(groupPath.transfer);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 发布群公告  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   notice - 公告内容
         * @param {function} callback - 返回发布公告结果
         */
        setNotice: function(groupId, notice, callback) {
            var data = {
                groupId: groupId,
                bulletin: notice
            };
            var url = genUrl(groupPath.notice);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 设置群头像  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   portraitUri - 头像地址
         * @param {function} callback - 返回设置头像结果
         */
        setPortaitUri: function(groupId, portraitUri, callback) {
            var data = {
                groupId: groupId,
                portraitUri: portraitUri
            };
            var url = genUrl(groupPath.set_portrait_uri);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 设置群自己的群备注
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   portraitUri - 头像地址
         * @param {function} callback - 返回设置头像结果
         */
        setDisplayName: function(groupId, displayName, callback) {
            var data = {
                groupId: groupId,
                displayName: displayName
            };
            var url = genUrl(groupPath.set_display_name);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 群组重命名
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   name - 昵称
         * @param {function} callback - 返回重命名结果
         */
        rename: function(groupId, name, callback) {
            var data = {
                groupId: groupId,
                name: name
            };
            var url = genUrl(groupPath.rename);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 获取群成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回成员列表
         */
        getMembers: function(groupId, callback) {
            var url = genUrl(groupPath.members.replace(/{groupId}/, groupId));
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        /** 
         * 添加新成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {array}   memberIds - 成员 id 数组 
         * @param {function} callback - 返回添加成员结果
         */
        addMember: function(groupId, memberIds, callback) {
            var data = {
                groupId: groupId,
                memberIds: memberIds
            };
            var url = genUrl(groupPath.add);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        /** 
         * 添加新成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {array}   memberIds - 成员 id 数组 
         * @param {function} callback - 返回踢人结果
         */
        kickMember: function(groupId, memberIds, callback) {
            var data = {
                groupId: groupId,
                memberIds: memberIds
            };
            var url = genUrl(groupPath.kick);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        getHeadInfo: function(count, callback) {
            var url = genUrl(groupPath.head_info.replace(/{count}/, count));
            request(url, {
                success: callback
            });
        },
        addToAddress: function(groupId, show, callback) {
            var data = {
                groupId: groupId,
                show: show
            };
            var url = genUrl(groupPath.add_to_address);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        }
    };

    var Group = {};

    Group.getAll = function (callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_fav_group_list
    };

    Group.getOne = function (groupId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_group_info
    };

    Group.create = function (group, memberIdList, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_create_group
    };

    Group.rename = function (groupId, name, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_modify_group_name
    };

    Group.getMembers = function (groupId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_group_memeber_list
    };

    Group.addMembers = function (groupId, memberIds, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_invite_into_group
    };

    Group.removeMembers = function (groupId, memberIds, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_remove_from_group
    };

    Group.quit = function (groupId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_quit_group
    };

    Group.dismiss = function (groupId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_delete_group
    };

    var Group = (function(groupDatProvider, ObserverList) {
        var data = [],
            groupMembers = {},
            headInfo = {};
        var createMember = function(data) {
            var user = {
                displayName: '',
                role: 0,
                createdAt: +new Date,
                updatedAt: +new Date
            };
            forEach(data, function(key, value) {
                user[key] = value;
            });
            return user;
        };
        /** 
         * 创建群
         * @memberof Group 
         * @param {string}   name - 群名称
         * @param {string}   memberIds - 群成员 Id 数组
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var group = {name:'', portraitUri:''};
            var memberIds = ['userId1', 'userId2', 'userId3'];
            _instance.Group.create(name, memberIds, function(groupInfo){
                // 创建群成功 groupInfo 群组信息
            });
         */
        var create = function(group, memberIds, callback, fail) {
            groupDatProvider.create(group, memberIds, function(res) {
                var groupId = res.result.id;
                var groupInfo = {
                    role: 0,
                    show: 1,
                    group: {
                        id: groupId,
                        name: group.name,
                        portraitUri: group.portraitUri,
                        creatorId: currentUserId,
                        memberCount: memberIds.length,
                        maxMemberCount: 500
                    }
                };
                memberIds.length > option.group_head_count && (memberIds.length = option.group_head_count);
                User.getUsers(memberIds, function(users) {
                    headInfo[groupId] = {
                        title: [],
                        portait: []
                    };
                    forEach(users, function(userId, user) {
                        headInfo[groupId].title.push(user.displayName || user.nickname);
                        headInfo[groupId].portait.push(user.portraitUri);
                    });
                    groupInfo.info = headInfo[groupId];
                    data.push(groupInfo);
                    callback(groupInfo);
                });

            }, fail);
        };
        /** 
         * 获取群列表
         * @memberof Group 
         * @param {string} groupId - 群 Id, 可选参数, 不传返回群列表
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            // 获取群列表
            var groups = _instance.Group.get();
            // 获取群信息
            var groupId = 'xxx';
            var group = _instance.Group.get(groupId);
           @returns {array}
         */
        var get = function(groupId, callback) {
            if (typeof groupId == 'string') {
                var group = {
                    role: 1,
                    type: 0,
                    show: 0,
                    group: {
                        id: groupId,
                        name: '',
                        portraitUri: '',
                        creatorId: '',
                        memberCount: 0,
                        maxMemberCount: 0
                    }
                };
                for (var i = 0, len = data.length; i < len; i++) {
                    if (groupId == data[i].group.id) {
                        group = data[i];
                        break;
                    }
                }
                group.info = headInfo[groupId];
                callback && callback(group);
                return group;
            } else {
                loop(data, function(item, index) {
                    data[index].info = headInfo[item.group.id];
                });
                return data;
            }
        };

        var groupObServerList = new ObserverList();
        var groupNotify = function(group) {
            var count = groupObServerList.count(),
                groups = get();
            for (var i = 0; i < count; i++) {
                groupObServerList.get(i)(groups, group);
            }
        };
        /** 
         * 加入群
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回加入群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.join(groupId, function(){
                // join Successfully
            });
         */
        var join = function(groupId) {
            groupDatProvider.join(groupId, function() {
                User.get(currentUserId, function(user) {
                    groupMembers[groupId].push(createMember(user));
                    memberNotify(groupId);
                });
            });
        };

        var memberHandle = function(groupId, userId, callback) {
            var members = groupMembers[groupId];
            for (var i = 0, len = members.length; i < len; i++) {
                if (userId == members[i].id) {
                    callback(i);
                    break;
                }
            }
        };
        /** 
         * 退出群
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回退出群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.join(groupId, function(){
                // quit Successfully
            });
         */
        var quit = function(groupId, callback) {
            groupDatProvider.quit(groupId, function(result) {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId].splice(index, 1);
                });
                callback && callback(result);
                groupNotify();
            });
        };
        var memberObServerList = new ObserverList();
        var memberNotify = function(groupId) {
            var count = memberObServerList.count();
            for (var i = 0; i < count; i++) {
                memberObServerList.get(i)(groupId, groupMembers[groupId]);
            }
            groupNotify();
        };
        /** 
         * 添加成员
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   memberIds - 群成员 Id 数组
         * @param {function}   callback - 返回添加成员结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var memberIds = ['userId5', 'userId6'];
            _instance.Group.addMember(groupId, memberIds, function(members){
                //addMember Successfully
                // members 是新增的群成员
            });
         */
        var addMember = function(groupId, memberIds, callback) {
            groupDatProvider.addMember(groupId, memberIds, function() {
                User.getUsers(memberIds, function(users) {
                    groupMembers[groupId] = groupMembers[groupId] || [];
                    var members = [];
                    for (var i = 0, len = memberIds.length; i < len; i++) {
                        var memberId = memberIds[i];
                        if (memberId in users) {
                            var member = createMember(users[memberId]);
                            groupMembers[groupId].push(member);
                            members.push(member);
                        }
                    }
                    callback && callback(members);
                    memberNotify(groupId);
                });
            });
        };
        /** 
         * 踢人
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   memberIds - 群成员 Id 数组
         * @param {function}   callback - 返回踢人结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var memberIds = ['userId5', 'userId6'];
            _instance.Group.kickMember(groupId, memberIds, function(){
                //kickMember Successfully
            });
         */
        var kickMember = function(groupId, memberIds, callback) {
            var members = [];

            function removeMember(index) {
                // 删除本地群成员并添加到临时数组，返回给 IM
                var member = groupMembers[groupId].splice(index, 1);
                members.push(member[0]);
            }

            groupDatProvider.kickMember(groupId, memberIds, function() {
                for (var i = 0, len = memberIds.length; i < len; i++) {
                    memberHandle(groupId, memberIds[i], removeMember);
                }
                callback && callback(members);
                memberNotify(groupId);
            });
        };
        /** 
         * 设置自己的群昵称
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   displayName - 自己的群昵称
         * @param {function}   callback - 返回设置昵称结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var displayName = 'name';
            _instance.Group.setDisplayName(groupId, displayName, function(){
                //setDisplayName Successfully
            });
         */
        var setDisplayName = function(groupId, displayName, callback) {
            groupDatProvider.setDisplayName(groupId, displayName, function() {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].displayName = displayName;
                });
                callback && callback();
                memberNotify(groupId);
            });
        };
        /** 
         * 转让群主角色
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   userId - 新群主的 Id 
         * @param {function}   callback - 返回转让群主结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var userId = 'userId';
            _instance.Group.setDisplayName(groupId, userId, function(){
                //transfer Successfully
            });
         */
        var transferManager = function(groupId, userId, callback) {
            groupDatProvider.transferManager(groupId, userId, function() {
                // 取消自己是管理员身份
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].role = 1;
                });
                // 绑定指定用户为管理员
                memberHandle(groupId, userId, function(index) {
                    groupMembers[groupId][index].role = 0;
                });
                callback && callback();
                memberNotify(groupId);
            });
        };
        /** 
         * 获取成员
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回群成员列表
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.getMembers(groupId, function(members){
                //members:群成员列表
            });
         */
        var getMembers = function(groupId, callback) {
            if (groupId in groupMembers) {
                callback(groupMembers[groupId]);
            } else {
                var cacheMembers = function(members) {
                    groupMembers[groupId] = members;
                    callback(members);
                };
                groupDatProvider.getMembers(groupId, cacheMembers);
            }
        };

        var groupHandle = function(groupId, callback) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (groupId == data[i].group.id) {
                    callback(i);
                    break;
                }
            }
        };
        /** 
         * 解散群组
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function} callback - 返回解散群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.dismiss(groupId, function(){
                //dismiss Group Successfully
            });
         */
        var dismiss = function(groupId, callback) {
            groupDatProvider.dismiss(groupId, function(result) {
                groupHandle(groupId, function(index) {
                    data.splice(index, 1);
                    delete groupMembers[groupId];
                });
                callback(result);
            });
        };
        /** 
         * 设置群头像
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   portraitUri - 头像地址
         * @param {function}   callback - 返回设置头像结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var portraitUri = 'http://xxx.xxx.com/portraitUri.png';
            _instance.Group.setPortaitUri(groupId, portraitUri, function(){
                //setPortaitUri Successfully
            });
         */
        var setPortaitUri = function(groupId, portraitUri, callback) {
            groupDatProvider.setPortaitUri(groupId, portraitUri, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.portraitUri = portraitUri;
                    callback && callback();
                    groupNotify(data[index]);
                });
            });
        };
        /** 
         * 群名称重命名
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   name - 群新名称
         * @param {function}   callback - 返回群重命名结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var name = 'rename';
            _instance.Group.rename(groupId, name, function(){
                //rename Successfully
            });
         */
        var rename = function(groupId, name, callback) {
            groupDatProvider.rename(groupId, name, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.name = name;
                    callback && callback();
                    groupNotify(data[index]);
                });
            });
        };
        /** 
         * 发布群公告
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   notice - 公告内容
         * @param {function}   callback - 返回发布公告结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var notice = '公告内容';
            _instance.Group.setNotice(groupId, notice, function(){
                //setNotice Successfully
            });
         */
        var setNotice = function(groupId, notice, callback) {
            groupDatProvider.setNotice(groupId, notice, function() {
                callback();
            });
        };
        /**
         * 数据改变事件监听
         * @memberof Group
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            _instance.Group.watch = function(groups){
                
            };
         */
        var watch = function(obsever, force) {
            groupObServerList.add(obsever, force);
        };

        var memberWatch = function(obsever, force) {
            memberObServerList.add(obsever, force);
        };

        var _pushHeadInfo = function(result) {
            var _heads = result.result;
            loop(_heads, function(item) {
                var head = headInfo[item.groupId] || (headInfo[item.groupId] = {
                    title: [],
                    portait: []
                });
                head.title.push(item.nickname);
                head.portait.push(item.portraitUri);
            });
            emit('FetchEnd');
        };

        var _pushGrups = function(groups) {
            groups.reverse();
            data = [];
            loop(groups, function(item) {
                data.push(item);
            });
            emit('FetchEnd');
        };
        watcher('Pull_GroupHead', function() {
            groupDatProvider.getHeadInfo(option.group_head_count, function(result) {
                // headInfo = {};
                _pushHeadInfo(result);
            });
        });
        watcher('Pull_Group', function() {
            groupDatProvider.get(function(data) {
                _pushGrups(data.result);
            });
        });
        watcher('Clear_Group', function() {
            data.length = 0;
            groupMembers = {};
            headInfo = {};
        });

        var addToAddress = function(groupId, show, callback) {
            groupDatProvider.addToAddress(groupId, show, function(result) {
                if (show) {
                    emit('Pull_Group');
                } else {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (data[i].group.id == groupId) {
                            data.splice(i, 1);
                            break;
                        }
                    }
                }
                callback(result);
            });
        };

        return {
            watch: watch,
            memberWatch: memberWatch,
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
            kickMember: kickMember,
            addToAddress: addToAddress,
            groupMembers: groupMembers,
            headInfo: headInfo,
            data: data
        };
    })(GroupDataProvider, ObserverList);

    /** Group DataModel end region */

    /** Conversation DataModel region */

    /**
     *  @namespace Conversation
     */

    /**
     * 会话模型数据接口
     * @namespace ConversationProvider
     */
    var ConversationDataProvider = {
        /** 
         * 获取会话列表  
         * @memberof ConversationProvider 
         * @param {function}   callback - 返回会话列表
         */
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
        /** 
         * 清除未读消息数  
         * @memberof ConversationProvider 
         * @param {number} conversationType - 会话类型
         * @param {string} targetId - 目标 Id 
         */
        clearUnReadCount: function(conversationType, targetId) {
            RongIMLib.RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(count) {},
                onError: function() {}
            });
        },
        /** 
         * 删除会话  
         * @memberof ConversationProvider 
         * @param {number} conversationType - 会话类型
         * @param {string} targetId - 目标 Id 
         */
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

    var bindUser = function(item, callback) {
        var process = function(user) {
            item.user = user;
            callback && callback(item);
        };
        if (item.conversationType == RongIMLib.ConversationType.PRIVATE) {
            if(item.senderUserId && item.targetId) {
                User.get(item.targetId, function (user) {
                    item.targetUser = user;
                    User.get(item.senderUserId, process); 
                });
            } else {
                User.get(item.senderUserId || item.targetId, process);
            }
        } else if (item.conversationType == RongIMLib.ConversationType.GROUP) {
            if (item.latestMessage) {
                // 会话最后一条消息绑定用户信息
                var user = User.get(item.latestMessage.senderUserId);
                item.latestMessage.user = user;
                item.group = Group.get(item.targetId);
                if(item.group.info) {
                    callback && callback(item);
                } else {
                    fetchData(function () {
                        item.group = Group.get(item.targetId);
                        callback && callback(item);
                    });
                }
            } else if (item.senderUserId) {
                // 群消息绑定用户信息
                User.get(item.senderUserId, process);
            } else {
                var getGroupCb = function(group) {
                    if (group.info) {
                        item.group = group;
                        callback(item);
                    } else {
                        setTimeout(getGroup, 50);
                    }
                };
                // 会话列表刷新使用
                var getGroup = function() {
                    Group.get(item.targetId, getGroupCb);
                };
                getGroup();
            }
        } else {
            // TODO 扩展
            process({});
        }
    };

    var getUserIds = function(data) {
        var userIds = [];
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i],
                conversationType = item.conversationType,
                _private = RongIMLib.ConversationType.PRIVATE,
                _group = RongIMLib.ConversationType.GROUP;
            if (conversationType == _private) {
                userIds.push(item.senderUserId || item.targetId);
            } else if (conversationType == _group) {
                item.latestMessage && userIds.push(item.latestMessage.senderUserId);
            }
        }
        return userIds;
    };

    var composeUserInfo = function(data, callback) {
        if (getPrototype.call(data) == '[object Array]') {
            var userIds = getUserIds(data);
            User.batch(userIds, function() {
                for (var i = 0, len = data.length; i < len; i++) {
                    bindUser(data[i]);
                }
                callback && callback(data);
            });
        } else {
            bindUser(data, callback);
        }
    };

    var Conversation = (function(conDataProvider, ObserverList) {
        var data = [];
        var observerList = new ObserverList();
        var notify = function() {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(data);
            }
        };
        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };
        /** 
         * 获取列表
         * @memberof Conversation 
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            _instance.Conversation.get(function(list){
                // list 会话列表
            });
         */
        var get = function(callback) {
            conDataProvider.getConversationList(function(conversations) {
                composeUserInfo(conversations, function(items) {
                    var _list = conDataProvider.sortConversationList(conversations);
                    data.length = 0;
                    loop(_list, function(item) {
                        data.push(item);
                    });
                    callback(data);
                });
            });
        };
        var getOne = function(conversation, callback) {
            var result = null;
            var conversationType = conversation.conversationType,
                targetId = conversation.targetId;
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (conversationType == item.conversationType && targetId == item.targetId) {
                    result = data[i];
                }
            }
            // 本地没有在服务器取
            if (result) {
                callback && callback(result);
            } else {
                callback && composeUserInfo(conversation, callback);
            }
            return result;
        };

        var setConversationTop = function(conversation, callback) {
            data.unshift(conversation);
            callback && callback();
            notify();
        };
        /** 
         * 修改会话
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversation = {conversationType:'', targetId:''}; // 请获取完整的会话对象
            _instance.Conversation.set(conversation, function(){
                // 修改会话成功
            });
         */
        var set = function(conversation) {
            var isInsert = true;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversation.conversationType && data[i].targetId == conversation.targetId) {
                    var thisConversation = data.splice(i, 1)[0];
                    thisConversation.latestMessage = conversation.latestMessage;
                    if(conversation._isNewMessage) {
                        thisConversation.unreadMessageCount++;
                    }
                    setConversationTop(thisConversation);
                    isInsert = false;
                    break;
                }
            }
            //TODO  setTop
            if (isInsert) {
                composeUserInfo(conversation, function(result) {
                    setConversationTop(result);
                });
            } else {
                notify();
            }
        };
        /** 
         * 清除未读消息数
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversation = {conversationType:'', targetId:''}; // 请获取完整的会话对象
            _instance.Conversation.clearUnReadCount(conversationType, targetId);
         */
        var clearUnReadCount = function(conversationType, targetId) {
            //TODO 发送多端同步消息
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
        /** 
         * 总未读消息数
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationTypes = [_instance.Conversation.ConversationType.PRIVATE,_instance.Conversation.ConversationType.GROUP];
            _instance.Conversation.getTotalUnreadCount(conversationTypes, function(count){
                // count : 总未读消息数
            });
         */
        var getTotalUnreadCount = function(conversationTypes, callback) {
            conDataProvider.getTotalUnreadCount(conversationTypes, callback);
        };
        /** 
         * 设置草稿
         * @memberof Conversation 
         * @param {string}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = _instance.ConversationType.PRIVATE;
            var targetId = 'dkdadi90';
            var draft = 'hello';
            _instance.Conversation.setDraft(conversationType, targetId, draft);
         */
        var setDraft = function(conversationType, targetId, draft) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    data[i].draft = draft;
                    break;
                }
            }
        };
        /** 
         * 获取草稿
         * @memberof Conversation 
         * @param {string}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = _instance.ConversationType.PRIVATE;
            var targetId = 'dkdadi90';
            var draft = _instance.Conversation.getDraft(conversationType, targetId);
            console.log(draft);
         */
        var getDraft = function(conversationType, targetId) {
            var draft = '';
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    draft = data[i].draft;
                    break;
                }
            }
            return draft;
        };
        var removeConversation = function(index, conversationType, targetId) {
            data.splice(index, 1);
            clearUnReadCount(conversationType, targetId);
        };
        /** 
         * 隐藏
         * @memberof Conversation 
         * @param {number}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = 1;
            var targetId = ''; 
            _instance.Conversation.hidden(conversationType, targetId);
         */
        var hidden = function(conversationType, targetId) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    removeConversation(i, conversationType, targetId);
                    break;
                }
            }
        };
        /** 
         * 删除会话
         * @memberof Conversation 
         * @param {number}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = 1;
            var targetId = ''; 
            _instance.Conversation.remove(conversationType, targetId);
         */
        var remove = function(conversationType, targetId) {
            hidden(conversationType, targetId);
            conDataProvider.remove(conversationType, targetId, {
                onSuccess: function(isDel) {
                    notify();
                },
                onError: function(error) {}
            });
        };

        var create = function(message) {
            var conversation = new RongIMLib.Conversation();
            conversation.conversationType = message.conversationType;
            conversation.targetId = message.targetId;
            conversation.latestMessage = message;
            conversation.senderUserId = message.senderUserId;
            conversation.draft = '';
            conversation.sentTime = message.sentTime;
            var fromMySelf = message.messageDirection == 1;
            var unreadMessageCount;
            if(fromMySelf) {
                unreadMessageCount = 0;
            } else {
                unreadMessageCount = 1;
                conversation._isNewMessage = true;
            }
            conversation.unreadMessageCount = unreadMessageCount;
            return conversation;
        };
        watcher('Conversation', function(result) {
            if (result.latestMessage) {
                result = RongIMClient._memoryStore.conversationList.slice(0, 1)[0];
            } else {
                result = create(result);
            }
            set(result);
        });
        watcher('Clear_Conversation', function() {
            data.length = 0;
        });

        var conversationModel = {
            hidden: hidden,
            remove: remove,
            set: set,
            get: get,
            setDraft: setDraft,
            getDraft: getDraft,
            clearUnReadCount: clearUnReadCount,
            getTotalUnreadCount: getTotalUnreadCount,
            getOne: getOne,
            watch: watch
        };
        var bindings = ['PRIVATE', 'DISCUSSION', 'GROUP', 'CHATROOM', 'CUSTOMER_SERVICE', 'SYSTEM', 'APP_PUBLIC_SERVICE', 'PUBLIC_SERVICE'];
        loop(bindings, function(proto) {
            conversationModel[proto] = RongIMLib.ConversationType[proto];
        });
        return conversationModel;
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
        /**
            获取历史消息
            @param {object} params - 获取历史消息参数对象
            @param {number} params.conversationType - 会话类型
            @param {number} params.targetId - 目标 id
            @param {number} params.timestamp - 获取历史消息开始时间
            @param {number} params.count - 每次获取条数
            @param {object} callback - 返回历史消息
            @memberof MessageProvider
         */
        getHistoryMessages: function(params, callback) {
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(params.conversationType, params.targetId, params.timestamp, option.get_historyMsg_count, {
                onSuccess: function(list, hasMore) {
                    callback(list, hasMore);
                },
                onError: function(error) {}
            });
        },
        /**
            发送消息
            @param {object} params - 获取历史消息参数对象
            @param {number} params.conversationType - 会话类型
            @param {number} params.targetId - 目标 id
            @param {number} params.content - 消息内容
            @param {boolean} params.mentiondMsg - @ 消息标识
            @param {string} params.pushText - push 内容
            @param {string} params.appData - 对 pushText 内容的扩展
            @param {object} callback - 返回发送消息结果
            @memberof MessageProvider
         */
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
        var observerList = new ObserverList();
        var notify = function(message) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(message);
            }
        };
        var data = {};
        /**
         * 消息变化监听
         * @memberof Message
           @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            _instance.Message.watch = function(message){
            };
         */
        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };
        var genDataUId = function(conversationType, targetId) {
            return 'cm_' + conversationType + targetId;
        };
        var set = function(message) {
            if (message) {
                var key = genDataUId(conversationType, targetId);
                data[key] && data[key].push(message);
            }
        };
        /**
         * 获取历史消息
         * @param {object} params - 获取历史消息参数对象
         * @param {number} params.conversationType - 会话类型
         * @param {number} params.targetId - 目标 id
         * @param {number} params.timestamp - 获取历史消息开始时间
         * @param {object} callback - 返回历史消息
         * @see {@link MessageProvider}
         * @memberof Message
         * @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var params = {
                conversationType:1,
                targetId:'',
                timestamp:0
             };
             _instance.Message.get(params, function(result, hasMore){
                // result: 历史消息数组
                // hasMore : 是否有更多的历史消息
             });
         */
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
                emit('Conversation', message);
                notify(message);
            });

        };
        /**
         * 发送消息
         * @param {object} params - 获取历史消息参数对象
         * @param {number} params.conversationType - 会话类型
         * @param {number} params.targetId - 目标 id
         * @param {number} params.content - 消息内容
         * @param {boolean} params.mentiondMsg - @ 消息标识
         * @param {string} params.pushText - push 内容
         * @param {string} params.appData - 对 pushText 内容的扩展
         * @param {object} callback - 返回发送消息结果
         * @memberof Message
         * @see {@link MessageProvider}
         * @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var params = { 
                conversationType:1,
                targetId:'',
                content:_instance.Message.TextMessage.obtain('hello world')
             };
             _instance.Message.send(params);
         */
        var send = function(params) {
            messageDataProvider.sendMessage(params, function(message) {
                message && _push(message);
            });
        };
        // ids: {messageId, messageUId, conversationType, targetId}
        var setRecvivedStatus = function(msg, status, callback) {
            var key = genDataUId(message.conversationType, message.targetId);
            messageDataProvider.setRecvivedStatus(msg.messageId, status, function(isOk) {
                for (var i = 0, len = data[key].length; i < len; i++) {
                    if (data[key][i].messageUId == msg.messageUId) {
                        data[kye][i].receivedStatus = status;
                        break;
                    }
                }
                callback(isOk);
            });
        };
        watcher('Message', function(message) {
            _push(message);
        });
        watcher('Clear_Message', function() {
            data = {};
        });

        var userModel = {
            set: set,
            get: get,
            send: send,
            watch: watch,
            TextMessage: RongIMLib.TextMessage,
            setRecvivedStatus: setRecvivedStatus,
            MessageDataProvider: messageDataProvider
        };
        // 动态暴露 RongIMLib Message 相关属性。
        var bindings = ['TextMessage', 'FileMessage', 'ImageMessage'];
        loop(bindings, function(proto) {
            userModel[proto] = RongIMLib[proto];
        });
        return userModel;
    })(MessageDataProvider, ObserverList);
    /** Message DataModel end region */

    /** Status DataModel region */

    var starPath = {
        all: 'user/starlist',
        star: 'user/star',
        unstar: 'user/unstar',
        set_display_name: 'user/set_star_displayname'
    };

    var StarProvider = {
        getAll: function(callback) {
            var url = genUrl(starPath.all);
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        star: function(targetId, callback) {
            var data = {
                targetId: targetId
            };
            var url = genUrl(starPath.star);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        unstar: function(targetId, callback) {
            var data = {
                targetId: targetId
            };
            var url = genUrl(starPath.unstar);
            request(url, {
                method: 'POST',
                data: jsonStringify(data),
                success: callback
            });
        },
        setDisplayName: function(info, callback) {
            var url = genUrl(starPath.set_display_name);
            request(url, {
                method: 'POST',
                data: jsonStringify(info),
                success: callback
            });
        }
    };

    var Star = {};

    Star.getAll = function (callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_contact_list
    };

    Star.star = function (targetId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_add_contact
    };

    Star.unstar = function (targetId, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_delete_contact
    };

    Star.setDisplayName = function (info, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_modify_contact_alias
    };

    var Star = (function(starProvider, ObserverList) {
        var data = [];

        var observerList = new ObserverList();

        var notify = function(user) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(data, user);
            }
        };

        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };

        var getAll = function(callback) {
            if (data.length > 0) {
                callback(data);
            } else {
                starProvider.getAll(function(stars) {
                    data = stars;
                    userFormat(stars, function(user) {
                        emit('User', user); // fire User, cache userInfo.
                    });
                    callback(data);
                });
            }
        };
        var star = function(targetId, callback) {
            starProvider.star(targetId, function(result) {
                User.get(targetId, function(user) {
                    user.star = 1;
                    data.push(user);
                    callback && callback(result);
                    notify(user);
                });
            });
        };
        var unstar = function(targetId, callback) {
            starProvider.unstar(targetId, function(result) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].id == targetId) {
                        var user = data.splice(i, 1)[0];
                        user.star = 0;
                        notify(user);
                        break;
                    }
                }
                callback && callback(result);
            });
        };

        var setDisplayName = function(info, callback) {
            starProvider.setDisplayName(info, function(result) {
                var userData = {};
                userData[info.targetId] = {
                    displayName: info.displayName
                };
                emit('User', userData);
                callback && callback(result);
                for (var i = 0; i < data.length; i++) {
                    if (info.targetId == data[i].id) {
                        data[i].displayName = info.displayName;
                        notify(data[i]);
                    }
                }
            });
        };

        var _push = function(result) {
            data = result;
        };

        watcher('Star', function(result) {
            _push(result);
        });

        watcher('Pull_Star', function() {
            starProvider.getAll(function(result) {
                emit('Star', result);
                userFormat(result, function(user) {
                    emit('User', user); // fire User, cache userInfo.
                });
                emit('FetchEnd');
            });
        });
        watcher('Clear_Star', function() {
            data.length = 0;
        });

        return {
            getAll: getAll,
            star: star,
            unstar: unstar,
            setDisplayName: setDisplayName,
            starProvider: starProvider,
            watch: watch
        };
    })(StarProvider, ObserverList);

    var Organization = {};

    // 查询公司信息
    Organization.getCompany = function(callback) {
        // 1. 得到公司id http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_root_department_staff
        // 2. 从部门树里取得公司信息 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_depart_tree
    };

    // 根据部门id查询直属成员 + 直属部门
    Organization.getDept = function(id, callback) {
        // http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_department_branches
    };

    // 根据部门id数组查询部门名称
    Organization.getDeptNames = function(idList, callback) {
        // 从部门树里取得 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_depart_tree  
    };

    // 搜索企业通讯录，只匹配人名
    Organization.search = function(keyword, callback) {
        // 未找到相应接口
    };

    // 取得部门下的所有人
    Organization.getMembers = function(deptId, callback) {
        // 接口暂未实现 http://gitlab.rongcloud.net/RCE/RCE-Doc/wikis/rce_api_get_department_all
    };

    Organization.getOneMember = function(memberId, callback) {
        // http://dev.api.rce.rongcloud.net:8080/rce/api/staffs/QNCOdQHdyoQB
    };

    var OrganizationPath = {
        company: 'departs/new/company',

        get_dept: 'departs/new/{id}',

        get_dept_info: 'departs/new/info/{path}',

        search: 'departs/new/search/{keyword}',

        members: 'departs/new/{id}/members'
    };

    var OrganizationProvider = {
        getCompany: function(callback) {
            var url = genUrl(OrganizationPath.company);
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        getDept: function(id, callback) {
            var url = genUrl(OrganizationPath.get_dept.replace(/{id}/, id));
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        getDeptsInfo: function(path, callback) {
            path = path.join(',');
            var url = genUrl(OrganizationPath.get_dept_info.replace(/{path}/, path));
            request(url, {
                success: function(data) {
                    var result = data.result.sort(function (one, another) {
                        return one.sort - another.sort;
                    });
                    callback(result);
                }
            });
        },
        // 全员按 nickname 和 英文名或者拼音搜索
        search: function(keyword, callback) {
            var url = genUrl(OrganizationPath.search.replace(/{keyword}/, keyword));
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        },
        // 获取部门成员（包含下级部门中的成员）
        getMembers: function(deptId, callback) {
            var url = genUrl(OrganizationPath.members.replace(/{id}/, deptId));
            request(url, {
                success: function(data) {
                    callback(data.result);
                }
            });
        }
    };

    var Organization = (function(organProvider) {

        var getCompany = function(callback) {
            organProvider.getCompany(callback);
        };

        var getDept = function(id, callback) {
            organProvider.getDept(id, callback);
        };

        var getDeptNames = function(path, callback) {
            organProvider.getDeptsInfo(path, callback);
        };

        var search = function(keyword, callback) {
            organProvider.search(keyword, function(result){
                emit('User', result);
                callback(result);
            });
        };

        var getMembers = function(path, callback) {
            organProvider.getMembers(path, function(result){
                emit('User', result);
                callback(result);
            });
        };

        return {
            getCompany: getCompany,
            getDept: getDept,
            getDeptNames: getDeptNames,
            search: search,
            getMembers: getMembers
        };

    })(OrganizationProvider);
    /**
     * @namespace Status
     */
    var Status = (function(ObserverList) {
        var data = -2;

        var observerList = new ObserverList();

        var notify = function(status) {
            var count = observerList.count();
            for (var i = 0; i < count; i++) {
                observerList.get(i)(status);
            }
        };
        /**
         * 状态监听
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var connStatus = _instance.Status.ConnectionStatus;
           _instance.Status.watch(function(status){
                if(status == connStatus.CONNECTING){
                    // 连接中
                }elseif (status == connStatus.CONNECTED) {
                    // 连接成功
                } 
           },force);
         */
        var watch = function(obsever, force) {
            observerList.add(obsever, force);
        };
        /**
         * 获取当前连接状态
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var status = _instance.Status.get();
           console.log(status);
         * @returns {number}
         */
        var get = function() {
            return data;
        };
        /**
         * 连接服务器
         * @memberof Status
         * @param {string} token - 用户在融云的唯一身份标识
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var token = 'DsdfkDISk==';
           _instance.Status.connect(token);
         */
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
        /**
         * 断开与服务器连接
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           _instance.Status.disconnect();
         */
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
        loop(bindings, function(proto) {
            statusModel[proto] = RongIMLib[proto];
        });
        return statusModel;
    })(ObserverList);
    /** Status DataModel end region */

    var fetchData = function(callback) {
        fetchModelData(option.data, callback);
    };
    /**
     * 初始化
     * @memberof RongDataModel
     * @static
     * @example
        var config = {
            appkey:'',                              // 必传
            dataAccessProvider:null,                // 可选
            dm:{                                    // 可选
                max_msg_count:20,                   // 本地缓存消息条数上限
                max_conversation_count:50,          // 本地缓存会话个数上限
                get_historyMsg_count:5,             // 每次拉取历史消息个数
                server_path:'http://api.cn/',       // Server 地址,请以 '/' 结尾
                data:['User', 'Group', 'Friend']    // 可选 默认获取用户、群组、好友信息
            },                      
            sdk:{navi:''}                           // 可选
        };
        var _instance = RongDataModel.init(config);
     */
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
            Friend: Friend,
            Conversation: Conversation,
            Message: Message,
            Status: Status,
            Star: Star,
            Organization: Organization,
            option: option,
            fetchData: fetchData
        };
    };

    win.RongDataModel = {
        init: init
    };
})(window, RongIMLib, RongIMClient);