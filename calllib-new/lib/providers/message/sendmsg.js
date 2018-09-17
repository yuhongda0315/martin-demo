"use strict";
(function (dependencies) {

  // patch c++ SDK 多端时发送一条消息，会再收到一条同样 messageUId 的消息这里记录一下做排除
  var cacheMessageUIdList = [];
  var MAXCACHE = 500;

  var global = dependencies.global;

  var utils = {
    ObserverList: function () {
      var checkIndexOutBound = function (index, bound) {
        return index > -1 && index < bound;
      };
      this.observerList = [];
      this.add = function (observer, force) {
        force && (this.observerList.length = 0);
        this.observerList.push(observer);
      };
      this.get = function (index) {
        if (checkIndexOutBound(index, this.observerList.length)) {
          return this.observerList[index];
        }
      };
      this.count = function () {
        return this.observerList.length;
      };
      this.removeAt = function (index) {
        checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
      };
      this.remove = function (observer) {
        if (!observer) {
          this.observerList.length = 0;
          return;
        }
        observer = Object.prototype.toString.call(observer) == '[object Function]' ? [observer] : observer;
        for (var i = 0, len = this.observerList.length; i < len; i++) {
          if (this.observerList[i] === observer[i]) {
            this.removeAt(i);
            break;
          }
        }
      };
      this.notify = function (val) {
        for (var i = 0, len = this.observerList.length; i < len; i++) {
          this.observerList[i](val);
        }
      };
      this.indexOf = function (observer, startIndex) {
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
    },
    Cache: function () {
      var cache = {};
      var set = function (key, value) {
        cache[key] = value;
      };
      var get = function (key) {
        return cache[key];
      };
      var remove = function (key) {
        delete cache[key];
      };
      var update = function (key, value) {
        set(key, value);
      };
      return {
        set: set,
        get: get,
        update: update,
        remove: remove
      };
    },
    tplEngine: function (temp, data, regexp) {
      if (!(Object.prototype.toString.call(data) === '[object Array]')) data = [data];
      var ret = [];
      for (var i = 0, j = data.length; i < j; i++) {
        ret.push(replaceAction(data[i]));
      }
      return ret.join('');

      function replaceAction(object) {
        return temp.replace(regexp || (/{([^}]+)}/g), function (match, name) {
          if (match.charAt(0) == '\\') return match.slice(1);
          return (object[name] != undefined) ? object[name] : '{' + name + '}';
        });
      }
    },
    copy: function (target, source) {
      for (var key in source) {
        target[key] = source[key];
      }
    },
    noop: function () { },
    getRandom: function (range) {
      return Math.floor(Math.random() * range);
    },
    getTimestamp: function (timestamp) {
      var date = new Date();
      if (timestamp > 0) {
        date = new Date(timestamp);
      }
      return date.getTime();
    },
    forEach: function (obj, callback) {
      callback = callback || utils.noop;
      var loopObj = function () {
        for (var key in obj) {
          callback(obj[key], key, obj);
        }
      };
      var loopArr = function () {
        for (var i = 0, len = obj.length; i < len; i++) {
          callback(obj[i], i);
        }
      };
      if (utils.isObject(obj)) {
        loopObj();
      }
      if (utils.isArray(obj)) {
        loopArr();
      }
    },
    rename: function (origin, newNames) {
      var isObject = utils.isObject(origin);
      if (isObject) {
        origin = [origin];
      }
      var utilJSON = utils.JSON;
      origin = utilJSON.parse(utilJSON.stringify(origin));
      var updateProperty = function (val, key, obj) {
        delete obj[key];
        key = newNames[key];
        obj[key] = val;
      };
      utils.forEach(origin, function (item) {
        utils.forEach(item, function (val, key, obj) {
          var isRename = (key in newNames);
          (isRename ? updateProperty : utils.noop)(val, key, obj);
        });
      });
      return isObject ? origin[0] : origin;
    },
    isObject: function (obj) {
      return (Object.prototype.toString.call(obj) == '[object Object]');
    },
    isArray: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Array]');
    },
    isFunction: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Function]');
    }
  };
  
  function MsgObserverList() {
    var checkIndexOutBound = function (index, bound) {
      return index > -1 && index < bound;
    };
    this.observerList = [];
    this.add = function (observer, force) {
      force && (this.observerList.length = 0);
      this.observerList.push(observer);
    };
    this.get = function (index) {
      if (checkIndexOutBound(index, this.observerList.length)) {
        return this.observerList[index];
      }
    };
    this.count = function () {
      return this.observerList.length;
    };
    this.removeAt = function (index) {
      checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
    };
    this.remove = function (observer) {
      if (!observer) {
        this.observerList.length = 0;
        return;
      }
      observer = Object.prototype.toString.call(observer) == '[object Function]' ? [observer] : observer;
      for (var i = 0, len = this.observerList.length; i < len; i++) {
        if (this.observerList[i] === observer[i]) {
          this.removeAt(i);
          break;
        }
      }
    };
    this.notify = function (val) {
      for (var i = 0, len = this.observerList.length; i < len; i++) {
        this.observerList[i](val);
      }
    };
    this.indexOf = function (observer, startIndex) {
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
  };

  var RongIMLib = dependencies.RongIMLib;
  var RongIMClient = RongIMLib.RongIMClient;

  var messageTypes = {
    AcceptMessage: RongIMLib.AcceptMessage,
    RingingMessage: RongIMLib.RingingMessage,
    SummaryMessage: RongIMLib.SummaryMessage,
    HungupMessage: RongIMLib.HungupMessage,
    InviteMessage: RongIMLib.InviteMessage,
    MediaModifyMessage: RongIMLib.MediaModifyMessage,
    MemberModifyMessage: RongIMLib.MemberModifyMessage,
    SubscribeModifyMessage: RongIMLib.SubscribeModifyMessage
  };

  /*
      根据 MessageType 返回 message 对象
      var msg = {
          messageType:'TextMessage'
      };
      var textMsg = messageFactory(params);
  */
  var messageFactory = function (msg) {
    var message = messageTypes[msg.messageType] || utils.noop;
    return new message(msg.content || msg);
  };

  var sendMessage = function (message, callback) {
    callback = callback || utils.noop;

    var msg = messageFactory(message);

    var conversationType = message.conversationType;
    var targetId = message.targetId;

    var im = RongIMClient.getInstance();

    var isMentioned = false;
    var pushText = message.pushText || '';
    var appData = message.appData || '';
    var methodType = null;

    im.sendMessage(conversationType, targetId, msg, {
      onSuccess: function (message) {
        cacheMessageUIdList.unshift(message.messageUId);
        if (cacheMessageUIdList.length > MAXCACHE) {
          cacheMessageUIdList.pop();
        }
        var error = null;
        callback(error, message);
      },
      onError: function (code) {
        callback(code);
      }
    }, isMentioned, pushText, appData, methodType, message);
  };

  var commandItem = {
    /*
        params.conversationType
        params.targetId
     */
    invite: function (params, callback) {
      params.messageType = 'InviteMessage';

      var content = params.content;

      var mediaType = content.mediaType;
      var inviteUserIds = content.inviteUserIds;
      var callId = content.callId;

      var appData = {
        mediaType: mediaType,
        userIdList: inviteUserIds,
        callId: callId
      };

      var pushItem = {
        1: '您有一条音频通话',
        2: '您有一条视频通话'
      };
      params.pushText = pushItem[mediaType];
      params.appData = JSON.stringify(appData);
      params.userIds = inviteUserIds;
      sendMessage(params, callback);
    },
    ringing: function (params, callback) {
      params.messageType = 'RingingMessage';
      sendMessage(params, callback);
    },
    /*
        params.conversationType
        params.targetId
     */
    accept: function (params, callback) {
      params.messageType = 'AcceptMessage';
      sendMessage(params, callback);
    },

    /*
       params.conversationType
       params.targetId
    */
    hungup: function (params, callback) {
      params.messageType = 'HungupMessage';
      sendMessage(params, callback);
    },
    /*
        params.conversationType
        params.targetId
     */
    mediaModify: function (params, callback) {
      params.messageType = 'MediaModifyMessage';
      sendMessage(params, callback);
    },
    memberModify: function (params, callback) {
      params.messageType = 'MemberModifyMessage';
      var content = params.content;
      var userIds = [];
      var inviteUserIds = content.inviteUserIds
      var existList = content.existedMemberStatusList;

      utils.forEach(inviteUserIds, function (userId) {
        userIds.push(userId);
      });
      utils.forEach(existList, function (user) {
        var userId = user.userId;
        userIds.push(userId);
      });
      params.userIds = userIds;
      sendMessage(params, callback);
    },
    // getToken: function (params, callback) {
    //   var im = RongIMClient.getInstance();
    //   var engineType = 3;
    //   var channelId = params.channelId;
    //   im.getAgoraDynamicKey(engineType, channelId, {
    //     onSuccess: function (data) {
    //       var error = null;
    //       callback(error, data.dynamicKey);
    //     },
    //     onError: function (error) {
    //       callback(error);
    //     }
    //   });
    // },
      getToken: function (params, callback) {
        var userId = RongIMLib.Bridge._client.userId;
        $.ajax({
          url : 'https://10.13.10.134:443/token',
          // url : 'https://rtcapi.ronghub.com/token',
          type : 'POST',
          data : 'uid=' + userId + '&appid=1234567890abcdefg',
          async : true,
          success : function(data) {
            callback(null, data);
          },
          error : function(er) {
          }
     });
      },
    subscriptionModify: function(content){
      params.messageType = 'SubscribeModifyMessage';
      sendMessage(content);
    }
  };
  /*
      var params = {
          command: 'invite' | 'ringing' | 'accept' | 'hungup' | 'mediaModify' | 'memberModify' | 'getToken' | 'subscriptionModify',
          data: {
              conversationType: 1,
              targetId: '',
              content: {}
          }
      };
   */
  var sendCommand = function (params, callback) {

    var command = params.command;
    var data = params.data;
    commandItem[command] && commandItem[command](data, callback);
  };

  var watcher = new MsgObserverList();

  var watch = function (listener) {
    watcher.add(listener);
  };

  // WebSDK VoIP message adapter.
  RongIMClient._voipProvider = {
    onReceived: function (message) {
      // patch 排除自己发的消息
      var isSelfClientSendMessage = cacheMessageUIdList.indexOf(message.messageUId) > -1;
      if (message.offLineMessage || isSelfClientSendMessage) {
        return;
      }
      watcher.notify(message);
    }
  };

  global.MessageCtrl = {
    sendCommand: sendCommand,
    watch: watch
  };

})({
  global: window,
  RongIMLib: RongIMLib
});