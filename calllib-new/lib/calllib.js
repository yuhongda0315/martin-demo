"use strict";
(function (dependencies) {
  var win = dependencies.win;
  var MessageCtrl = dependencies.MessageCtrl;
  var sendCommand = MessageCtrl.sendCommand;

  var RongDesktop = win.RongDesktop || {};
  
  var RongRTC =  dependencies.RongRTCLib;
  var EventHandler = dependencies.RongRTCEventHandler;
  if(RongDesktop.RongRTC){
    RongRTC = RongDesktop.RongRTC;
    EventHandler = RongRTC.EventHandler;
  }

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
      origin = JSON.parse(JSON.stringify(origin));
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
    },
    filter: function(arrs, callback){
      if(utils.isObject(arrs)){
        arrs = [arrs];
      }
      var result = [];
      utils.forEach(arrs, function(item){
        callback(item) && result.push(item);
      });
      return result;
    }
  };

  var RongRTCProvider = (function () {
    var config = {
      width: 640,
      height: 480
    }

    var getProfile = function (type) {
      var profile = {
        "240P": {
          width: 640,
          height: 480
        },
        "480P": {
          width: 320,
          height: 240
        },
        "720P": {
          width: 1280,
          height: 720
        }
      }
      return profile[type];
    };

    var setProfile = function (profile) {
      profile = getProfile(profile.type);
      utils.copy(config, profile);
    }

    var videoRoom;
    /*
        var callback = function(error, result){
            // result => {type: 'added', data: stream, isLocal: true}
            // do something
        };
    */
    var initRoom = function (params, callback) {
      callback = callback || utils.noop;
      var url = params.url || '';
      videoRoom = RongRTC.init({
        url: url
      });
      videoRoom.userType = params.userType || '1';
      var roomHandler = new EventHandler();

      var errorInfo = null;

      var participant = {
        add: function (data) {
          utils.copy(data, {
            type: 'added'
          });
          callback(errorInfo, data);
        },
        remove: function (data) {
          utils.copy(data, {
            type: 'removed'
          });
          callback(errorInfo, data);
        },
        leave: function () {
          callback(errorInfo, {
            type: 'leave'
          });
        },
        disconnect: function () {
          callback(errorInfo, {
            type: 'disconnect'
          });
        },
        hostRemoved: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'hostRemoved'
          });
          callback(errorInfo, data);
        },
        onUserDown: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'userDown'
          });
          callback(errorInfo, data);
        },
        onBecomeUser: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'becomeUser'
          });
          callback(errorInfo, data);
        },
        onBeRequestToUser: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'beRequestToUser'
          });
          callback(errorInfo, data);
        },
        OnReciveRequestToUser: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'reciveRequestToUser'
          });
          callback(errorInfo, data);
        },
        OnHostRequestControlDevice: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'hostRequestControlDevice'
          });
          callback(errorInfo, data);
        },
        onShareComplete: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'shareComplete'
          });
          callback(errorInfo, data);
        }
        ,
        onWhiteBoardURL: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'whiteBoardURL'
          });
          callback(errorInfo, data);
        },
        onTurnTalkType: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'turnTalkType'
          });
          callback(errorInfo, data);
        },
        OnOtherUserBecomeHost: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'otherUserBecomeHost'
          });
          callback(errorInfo, data);
        },
        onUserAgreeOpen: function (data) {
          utils.copy(data, {
            index: 'meet',
            type: 'userAgreeOpen',
            mediaType: data.type
          });
          callback(errorInfo, data);
        }
      };
      var eventFactory = {
        onJoinComplete: function (data) {
          if (videoRoom.userType == 2) {
            return;
          }
          var joinedItem = {
            success: function (data) {
              var videoView = videoRoom.createLocalVideoView();

              participant.add({
                userId: data.userId,
                data: videoView,
                isLocal: true,
                talkType: data.talkType
              });
            },
            error: function () {
              callback('join error.');
            }
          };
          var method = data.isJoined ? 'success' : 'error';
          joinedItem[method](data);
        },
        onLeaveComplete: function (data) {
          var leftItem = {
            success: function () {
              participant.leave();
              //videoRoom.closeLocalStream();
              // callback(null, data);
            },
            error: function () {
              errorInfo = {
                msg: 'leave error'
              };
              // callback(errorInfo);
            }
          };

          var method = data.isLeft ? 'success' : 'error';
          leftItem[method]();
        },
        onaddstream: function (data) {
          setTimeout(function () {
            var userId = data.userId;
            var videoView = videoRoom.createRemoteVideoView(userId);
            participant.add({
              userId: userId,
              data: videoView,
              talkType: data.talkType,
              isLocal: data.isLocal
            });
          }, 1000)
        },
        onUserLeft: function (data) {
          participant.remove({
            data: data.userId,
            isLocal: false,
          });
        },
        onUserUpdatedTalkType: function (data) {
        },
        onConnectionStateChanged: function (status) {
          if (status.connectionState === 'DISCONNECTED') {
            participant.disconnect();
          }
        },
        onHostRemoved: function (data) {
          participant.hostRemoved(data);
        },
        onUserDown: function (data) {
          participant.onUserDown(data);
        },
        onBecomeUser: function (data) {
          participant.onBecomeUser(data);
        },
        onBeRequestToUser: function (data) {
          participant.onBeRequestToUser(data);
        },
        OnReciveRequestToUser: function (data) {
          participant.OnReciveRequestToUser(data);
        },
        OnHostRequestControlDevice: function (data) {
          participant.OnHostRequestControlDevice(data);
        },
        onShareComplete: function (data) {
          var userId = data.userId;
          var stream = data.stream;
          participant.add({
            userId: userId,
            data: stream,
            talkType: data.talkType,
            isLocal: data.isLocal
          });
        },
        // 返回本地数据流的丢包率
        onNetworkSentLost: function (data) {
        },
        onTurnTalkType: function (data) {
          participant.onTurnTalkType(data);
        },
        OnOtherUserBecomeHost: function (data) {
          participant.OnOtherUserBecomeHost(data);
        },
        onUserAgreeOpen: function (data) {
          participant.onUserAgreeOpen(data);
        }
      };

      utils.forEach(eventFactory, function (event, name) {
        roomHandler.on(name, event);
      });

      videoRoom.setRongRTCEventHandler(roomHandler);
      return videoRoom;
    };

    var joinRoom = function (params) {
      if (videoRoom) {
        var token = params.token;
        var userId = params.userId;
        var roomId = params.callId;
        var mediaType = params.mediaType;
        var constraints = {
          width: config.width,
          height: config.height,
          frameRate: config.frameRate
        };
  
        var closeVideoItem = {
          1: function () {
            return true;
          },
          2: function () {
            return false;
          }
        };
  
        videoRoom.setVideoParameters({
          VIDEO_PROFILE: constraints,
          VIDEO_MAX_RATE: config.maxRate,
          VIDEO_MIN_RATE: config.minRate,
          USER_TYPE: 1,
          IS_CLOSE_VIDEO: closeVideoItem[mediaType]()
        });
        var userName = 'username';
        var careType = 3;
        var subInfo = params.subInfo;
        var resourceType = subInfo.resourceType || 3;
        var defaultSub = subInfo.defaultSub;
        var specialSubs = subInfo.specialSub;
        videoRoom.joinChannel(roomId, userId, token, userName, careType, resourceType, defaultSub, specialSubs);
      }
    };

    var quitRoom = function () {
      videoRoom && videoRoom.leaveChannel();
    };

    var getRtcPeer = function (params) {
      if (!videoRoom) {
        throw new Error('Not call yet, please call first.');
      }
      return videoRoom;
    };

    var enableAudio = function (params) {
      var isMute = !params.isEnabled;
      getRtcPeer().muteMicrophone(isMute);
    };

    var enableVideo = function (params) {
      var isClosed = !params.isEnabled;
      getRtcPeer().closeLocalVideo(isClosed);
    };

    var openLocalVideo = function () {
      getRtcPeer().closeLocalVideo(false);
    };

    var closeLocalVideo = function () {
      getRtcPeer().closeLocalVideo(true);
    };

    var setConfig = function (cfg) {
      utils.copy(config, cfg);
    };
    var startScreenSharing = function (params) {
      videoRoom.startScreenShare(params);
    }
    var stopScreenSharing = function () {
      videoRoom.stopScreenShare();
    }
    var updateSubscribe = function(params){
      videoRoom.updateSubscribe(params);
    };

    var subscribeStream = function(users){
      videoRoom.subscribeStream(users);
    };

    return {
      setConfig: setConfig,
      setProfile: setProfile,

      init: initRoom,
      join: joinRoom,
      quit: quitRoom,
      enableAudio: enableAudio,
      enableVideo: enableVideo,

      openLocalVideo: openLocalVideo,
      closeLocalVideo: closeLocalVideo,

      updateSubscribe: updateSubscribe,
      subscribeStream: subscribeStream,

      startScreenSharing: startScreenSharing,
      stopScreenSharing: stopScreenSharing
    };

  })();

  var engineType = 3;

  var CallMode = {
    // 音视频 非紧急
    RTC_NORMAL: 10,
    // 音视频 紧急呼叫
    RTC_URGENT: 11,
    // 视频调度-上拉
    DISPATCH_PULL: 20,
    // 视频调度-强拉
    DISPATCH_PULL_FORCE: 21,
    // 视频调度-环境侦测
    DISPATCH_PULL_MONITOR: 22,
    // 视频调度-转发
    DISPATCH_TRANSFER: 30,
    // 视频调度-回传
    DISPATCH_PUSH: 40
  };
  var SubscribeType = {
    // 错误，不符合标准的值
    ERROR: -1,
    // 不订阅任何资源
    NONE: 0,
    // 只订阅音频
    ONLY_AUDIO: 1,
    // 只订阅视频
    ONLY_VIDEO: 2,
    // 订阅音频和视频
    AUDIO_AND_VIDEO: 3,
    // 订阅屏幕共享
    SCREEN_SHARING: 4,
    // 订阅音频和屏幕共享
    AUDIO_AND_SCREEN_SHARING: 5,
    // 订阅视频和屏幕共享
    VIDEO_AND_SCREEN_SHARING: 6,
    // 订阅音视频和屏幕共享
    AUDIO_VIDEO_AND_SCREEN_SHARING: 7
  };

  var StreamType = {
    MAX: 1,
    MIN: 2
  };
  /* 
    Reason[1] 结果: 
      {
      code: 1,
      msg: '己方取消已发出的通话请求'
    }
    Reason.CANCEL 结果: 1
  */
  var Reason = (function () {
    var statusList = [{
      code: 1,
      msg: '己方取消已发出的通话请求',
      name: 'CANCEL'
    }, {
      code: 2,
      msg: '己方拒绝收到的通话请求',
      name: 'REJECT'
    }, {
      code: 3,
      msg: '己方挂断',
      name: 'HANGUP'
    }, {
      code: 4,
      msg: '己方忙碌',
      name: 'BUSYLINE'
    }, {
      code: 5,
      msg: '己方未接听',
      name: 'NO_RESPONSE'
    }, {
      code: 6,
      msg: '己方不支持当前引擎',
      name: 'ENGINE_UN_SUPPORTED'
    }, {
      code: 7,
      msg: '己方网络出错',
      name: 'NETWORK_ERROR'
    }, {
      code: 8,
      msg: '其他设备已处理',
      name: 'OTHER_CLIENT_HANDLED'
    }, {
      code: 11,
      msg: '对方取消已发出的通话请求',
      name: 'REMOTE_CANCEL'
    }, {
      code: 12,
      msg: '对方拒绝收到的通话请求',
      name: 'REMOTE_REJECT'
    }, {
      code: 13,
      msg: '通话过程对方挂断',
      name: 'REMOTE_HANGUP'
    }, {
      code: 14,
      msg: '对方忙碌',
      name: 'REMOTE_BUSYLINE'
    }, {
      code: 15,
      msg: '对方未接听',
      name: 'REMOTE_NO_RESPONSE'
    }, {
      code: 16,
      msg: '对方不支持当前引擎',
      name: 'REMOTE_ENGINE_UN_SUPPORTED'
    }, {
      code: 17,
      msg: '对方网络错误',
      name: 'REMOTE_NETWORK_ERROR'
    }, {
      code: 18,
      msg: 'VoIP 不可以用',
      name: 'VOIP_NOT_AVALIABLE'
    }];
    var result = {
      swop: function (reason) {
        //发送 Reason 时只发送针对自己的状态的码
        var swopMap = {
          1: 11,
          2: 12,
          3: 13,
          4: 14,
          5: 15,
          6: 16,
          7: 17
        };
        return swopMap[reason] || reason;
      }
    };
    utils.forEach(statusList, function (status) {
      var info = {
        code: status.code,
        msg: status.msg
      };
      var code = status.code;
      result[code] = info;
      result[status.name] = code;
    });
    return result;
  })();

  function Timer(userId) {
    var timeout = 0;
    var startTime = 0;
    var _userId = userId;

    var getResult = function () {
      var endTime = Date.now();
      var duration = endTime - startTime;

      return {
        startTime: startTime,
        endTime: endTime,
        duration: duration
      };
    };

    // 超时候执行 callback 
    this.resume = function (callback, message, second) {
      callback = callback || utils.noop;
      second = second || config.timeout;
      timeout = setTimeout(function () {
        var result = getResult();
        utils.copy(result, {
          userId: userId
        })
        callback(result, message);
      }, second);
      startTime = Date.now();
    };

    this.stop = function () {
      clearTimeout(timeout);
      return getResult();
    };
  }

  var getSummary = function (content) {
    var existedMembers = ExistMember.get(content);
    var caller = Cache.get(CacheName.getCaller(content));
    var sender = caller.senderUserId;
    var mediaType = Cache.get(CacheName.getMediaType(content));

    var message = {
      content: {
        mediaType: mediaType,
        caller: sender,
        inviter: sender,
        status: content.reason,
        members: existedMembers
      },
      senderUserId: sender,
      messageDirection: caller.messageDirection,
      messageType: 'SummaryMessage'
    };
    return message;
  };

  function TimeCalculator(callback) {
    var timers = {};
    this.resume = function (userIds, message) {
      if (!utils.isArray(userIds)) {
        userIds = [userIds];
      }
      utils.forEach(userIds, function (userId) {
        var timer = new Timer(userId);
        timer.resume(callback, message);
        timers[userId] = timer;
      });
    };

    this.stop = function (userId) {
      var timer = timers[userId];
      timer && timer.stop();
    };
  }

  var sessionTimer = (function () {
    var timer = new Timer();
    var resume = function () {
      timer.resume();
    };

    var stop = function (content) {
      var result = timer.stop();
      var message = getSummary(content);
      utils.copy(message.content, result);
      return message;
    };

    return {
      resume: resume,
      stop: stop
    };
  })();

  var getCurrentUser = function () {
    var id = config.currentUserId;
    return {
      id: id
    };
  };

  var timerCalc = function (direction, timerInfo, message) {
    var summary = getSummary(message);
    utils.copy(summary.content, timerInfo);
    utils.copy(summary, {
      messageDirection: direction
    });
    commandWatcher.notify(summary);
  };

  // 对方发起时记录超时
  var callerTimerCalc = new TimeCalculator(function (timerInfo, message) {
    // 触发己方未接听
    utils.copy(timerInfo, {
      status: Reason.NO_RESPONSE
    })
    timerCalc(1, timerInfo, message);
  });

  // 自己发起时记录超时
  var calleeTimerCalc = new TimeCalculator(function (timerInfo, message) {
    // 触发对方未接听
    utils.copy(timerInfo, {
      status: Reason.REMOTE_NO_RESPONSE
    })
    timerCalc(2, timerInfo, message);
  });

  var Status = {
    //初始状态
    Initial: 0,
    //正在呼出
    Dialing: 1,
    //正在呼入
    Incoming: 2,
    //收到一个通话呼入后，正在振铃
    Ringing: 3,
    //正在通话
    Active: 4,
    //已经挂断
    Hangup: 5
  };

  var Cache = utils.Cache();

  var CacheName = {
    getName: function (message, suffix) {
      var tpl = '{conversationType}_{targetId}_{suffix}';
      return utils.tplEngine(tpl, {
        type: message.conversationType,
        targetId: message.targetId,
        suffix: suffix
      });
    },
    getTempCallId: function (message) {
      return this.getName(message, 'callId');
    },
    getCaller: function (message) {
      return this.getName(message, 'caller');
    },
    getExistMembers: function (message) {
      return this.getName(message, 'existMembers');
    },
    getMediaType: function (message) {
      return this.getName(message, 'mediaType');
    },
    getReason: function (message) {
      return this.getName(message, 'mediaType');
    },
    isCaller: 'isCalller',
    isJoined: 'isJoined',
    RoomId: 'roomid'
  };

  var check = function (opt) {
    var ErrorMap = {
      invite: 'Invite: Not call yet.',
      hungup: 'Hungup: Not call yet.',
      accept: 'Accept: Not call yet.',
      mute: 'Mute: Not call yet.',
      unmute: 'Unmute: Not call yet.',
      unknown: 'unknown error.',
      setStream: 'Stream.set: Not call yet.',
      setSubscription: 'Subscription.set: Not call yet.'
    };
    var RoomId = Cache.get(CacheName.RoomId);
    if (!RoomId) {
      var type = opt.type || 'unknown';
      throw new Error(ErrorMap[type]);
    }
  };

  var commandWatcher = new utils.ObserverList();
  var videoWatcher = new utils.ObserverList();
  // 内部分发消息使用
  var innerWatcher = new utils.ObserverList();

  MessageCtrl.watch(function (message) {
    innerWatcher.notify(message);
  });

  var innerWatch = function (watcher) {
    innerWatcher.add(watcher);
  };

  var ExistMember = {
    set: function (message, status) {
      var content = message.content;
      var inviteUserIds = content.inviteUserIds,
        mediaType = content.mediaType;
      var existedMembers = ExistMember.get(message);
      utils.forEach(inviteUserIds, function (id) {
        var member = {
          userId: id,
          mediaId: id,
          mediaType: mediaType,
          callStatus: status
        };
        existedMembers.push(member);
      });
      // 缓存成员状态，收到所有指令消息、超时都会更改已存在成员状态
      Cache.set(CacheName.getExistMembers(message), existedMembers);
    },
    get: function (message) {
      return Cache.get(CacheName.getExistMembers(message)) || [];
    },
    update: function (message, status, mediaType) {
      var existedMembers = Cache.get(CacheName.getExistMembers(message));
      utils.forEach(existedMembers, function (member) {
        var isSameUser = (message.senderUserId = member.userId);
        if (isSameUser) {
          mediaType = mediaType || member.mediaType;
          status = status || member.status;
          member.callStatus = status;
          member.mediaType = mediaType;
        }
      });
    },
    remove: function () {

    }
  };

  var handleByOtherClient = function (message) {
    var type = message.conversationType;
    var targetId = message.targetId;
    var direction = 2;

    var caller = Cache.get(CacheName.getCaller(message));
    var mediaType = Cache.get(CacheName.getMediaType(message));
    var inviteUserIds = Cache.get(CacheName.getExistMembers(message));

    var start = 0;
    var duration = 0;

    var summary = {
      conversationType: type,
      targetId: targetId,
      messageDirection: direction,
      content: {
        caller: caller,
        inviter: caller,
        mediaType: mediaType,
        startTime: start,
        duration: duration,
        status: Reason.OTHER_CLIENT_HANDLED,
        memberIdList: inviteUserIds,
      },
      senderUserId: caller,
      messageType: 'SummaryMessage'
    };

    commandWatcher.notify(summary);
  };

  var sendRing = function (message) {
    var content = message.content;
    var data = {
      command: 'ringing',
      data: {
        conversationType: message.conversationType,
        targetId: message.targetId,
        callId: content.callId
      }
    };
    sendCommand(data)
  };

  var updateSelfSubscription = function(subInfos){
    var user = getCurrentUser();
    var currentSub = utils.filter(subInfos, function(subInfo){
      return subInfo.userId == user.id;
    })[0];
    if(currentSub){
      Room.updateSubscribe(currentSub);
    }
  };

  var MessageHandler = {
    InviteMessage: function (message) {
      ExistMember.set(message, Status.Incoming);
      sendRing(message);
      // 开始计时
      var user = getCurrentUser();
      var userId = user.id;
      callerTimerCalc.resume(userId, message);

      var content = message.content;
      var callId =  Cache.get(CacheName.getTempCallId(message)) || content.callId;
      Cache.set(CacheName.getTempCallId(message), callId);
      Cache.set(CacheName.getCaller(message), message);

      commandWatcher.notify(message);
    },
    RingingMessage: function (message) {
      ExistMember.update(message, Status.Ringing);
      commandWatcher.notify(message);
    },
    AcceptMessage: function (message) {
      ExistMember.update(message, Status.Active);
      var user = getCurrentUser();
      var userId = user.id;

      var isSender = (message.messageDirection == 1);
      if (isSender) {
        handleByOtherClient(message);
        return;
      }

      var isCaller = Cache.get(CacheName.isCaller);
      // 群聊防止多次加入
      var isJoined = Cache.get(CacheName.isJoined);
      var content = message.content;
      var callId = content.callId || Cache.get(CacheName.RoomId);
      Cache.set(CacheName.RoomId, callId);
      
      if(isCaller && !isJoined){
        var subInfo = {};
        var subs = content.subInfo;
        utils.forEach(subs, function(sub){
          var isSameUser = (sub.userId == userId)
          if(isSameUser){
            subInfo = sub;
          }
        });
        var params = {
          callId: callId,
          userId: userId,
          engineType: 3,
          mediaType: content.mediaType,
          subInfo: subInfo
        };
        Room.join(params);
        Cache.set(CacheName.isJoined, true);
        sessionTimer.resume();
      }
      
      calleeTimerCalc.stop(message.senderUserId);
      callerTimerCalc.stop(message.senderUserId);
      commandWatcher.notify(message);
    },
    HungupMessage: function (message) {
      ExistMember.update(message, Status.Hangup);
      var callId = Cache.get(CacheName.getTempCallId(message));
      var content = message.content;
      var hungupCallId = content.callId;
      if (callId != hungupCallId) {
        return;
      }
      var reason = content.reason;
      reason = Reason.swop(reason);
      utils.copy(content, {
        reason: reason
      })
      Cache.set(CacheName.getReason(message), reason);
      callerTimerCalc.stop(message.senderUserId);
      commandWatcher.notify(message);
    },
    MemberModifyMessage: function (message) {
      // 优先更新完整状态列表
      var content = message.content;
      // 兼容移动端属性不一致
      var existedMembers = content.existedUserPofiles || content.existedMemberStatusList;
      Cache.set(CacheName.getExistMembers(message), existedMembers);
      
      ExistMember.set(message, Status.Incoming);
      sendRing(message);
      // 开始计时
      var user = getCurrentUser();
      var userId = user.id;
      callerTimerCalc.resume(userId, message);

      var content = message.content;
      var callIdKey = CacheName.getTempCallId(message);
      var callId =  Cache.get(callIdKey) || content.callId;
      Cache.set(callIdKey, callId);
      Cache.set(CacheName.getCaller(message), message);

      commandWatcher.notify(message);
    },
    MediaModifyMessage: function (message) {
      ExistMember.update(message, null, message.content.mediaType);
      commandWatcher.notify(message);
    },
    SubscribeModifyMessage: function (message) {
      var subInfo = message.content.subInfo;
      updateSelfSubscription(subInfo);
      commandWatcher.notify(message);
    }
  };

  innerWatch(function (message) {
    var messageHandler = MessageHandler[message.messageType] || utils.noop;
    messageHandler(message);
  });

  var config = {
    timeout: 30000,
    currentUserId: '',
    ices: []
  };
  var setConfig = function (_config) {
    utils.copy(config, _config);
  };

  var videoWatch = function (watcher) {
    videoWatcher.add(watcher);
  };

  var commandWatch = function (watcher) {
    commandWatcher.add(watcher);
  };

  var genCallId = function (content) {
    var random = Math.floor(Math.random() * 10000);
    utils.copy(content, {
      random: random
    });
    var tpl = '{conversationType}_{targetId}_{random}';
    return Cache.get(CacheName.getTempCallId(content)) || utils.tplEngine(tpl, content);
  };

  var getToken = function (params, callback) {
    var channelId = params.callId;
    var engineType = params.engineType || 3;
    params = {
      command: 'getToken',
      engineType: engineType,
      data: {
        channelId: channelId
      }
    };
    sendCommand(params, callback);
  };

  var Room = {
    // config = {height: 720, width: 480}
    init: function (config) {
      RongRTCProvider.init(config, function (error, result) {
        if (error) {
          throw new Error(error);
        }
        videoWatcher.notify(result);
      });
    },
    /* 
      var params = {
        callId: '',
        userId: '',
        token: '',
        engineType: 3
      };
    */
    join: function (params) {
      getToken(params, function (error, token) {
        if (error) {
          throw new Error(error);
        }
        params.token = token;
        RongRTCProvider.join(params, function (error, result) {
          if (error) {
            throw new Error(error);
          }
          videoWatcher.notify(result);
        });
      });
    },
    openLocalVideo: RongRTCProvider.openLocalVideo,
    closeLocalVideo: RongRTCProvider.closeLocalVideo,
    quit: RongRTCProvider.quit,
    enableAudio: RongRTCProvider.enableAudio,
    enableVideo: RongRTCProvider.enableVideo,
    updateSubscribe: RongRTCProvider.updateSubscribe,
    subscribeStream: RongRTCProvider.subscribeStream
  };

  var sendInvite = function (data, inviteUserIds, callback) {
    var message = data.data;
    ExistMember.set(message, Status.Dialing);
    sendCommand(data, function (error, message) {
      calleeTimerCalc.resume(inviteUserIds, message);
      Cache.set(CacheName.getCaller(message), message);
      callback(error, message);
    });
  };
  /* 
    var content = {
      conversationType: conversationType,
      targetId: targetId,
      inviteUserIds: inviteUserIds,
      mediaType: CallType.MEDIA_VEDIO,
      mode: CallMode.RTC,
      subInfo: [{
        userId: "userId01",
        defaultSub: SubscribeType.AUDIO_AND_VIDEO,
        specialSub: []
      }]
    };
  */
  var call = function (content, callback) {
    content = content || {};
    var callId = genCallId(content);
    Cache.set(CacheName.getTempCallId(content), callId);

    var basicInfo = {
      callId: callId,
      // 3: 百灵
      engineType: engineType,
      channelInfo: {
        Id: callId,
        Key: ''
      }
    };
    utils.copy(content, basicInfo);
    var data = {
      command: 'invite',
      data: {
        conversationType: content.conversationType,
        targetId: content.targetId,
        content: content
      }
    };
    Cache.set(CacheName.isCaller, true);
    sendInvite(data, content.inviteUserIds, function (error, message) {
      callback(error, message);
    });
  };
  /* 
  var content = {
    conversationType: conversationType,
    targetId: targetId,
    inviteUserIds: inviteUserIds,
    mediaType: mediaType
  };
  */
  var invite = function (content, callback) {
    check({ type: 'invite', content: content });

    var callId = Cache.get(CacheName.RoomId);
    var user = getCurrentUser();
    var existedMembers = Cache.get(CacheName.getExistMembers(content));
    utils.copy(content, {
      callId: callId,
      engineType: engineType,
      caller: user.id,
      channelInfo: {
        Id: callId,
        Key: ''
      },
      // existedUserPofiles 与 existedMemberStatusList 意义一致，为了兼容端上的属性名称不一致
      existedMemberStatusList: existedMembers,
      existedUserPofiles: existedMembers
    });

    var data = {
      command: 'memberModify',
      data: {
        conversationType: content.conversationType,
        targetId: content.targetId,
        content: content
      }
    };
    sendInvite(data, content.inviteUserIds, function (error, message) {
      callback(error, message);
    });
  };

  /* 
     var content = {
       conversationType: conversationType,
       targetId: targetId,
       mediaType: mediaType,
       subInfo: [{
        "userId": "userId01",
        "defaultSub": 0,
        "specialSub": [{
            "uid": "userId03",
            "subResource": 1
        }]
    }]
     };
   */
  var accept = function (content, callback) {
    callback = callback || utils.noop;
    var callId = Cache.get(CacheName.RoomId) || Cache.get(CacheName.getTempCallId(content));
    utils.copy(content, {
      callId: callId
    });
    var data = {
      command: 'accept',
      data: content
    };
    sendCommand(data, function (error, message) {
      Cache.set(CacheName.RoomId, callId)
      sessionTimer.resume();
      var user = getCurrentUser();
      callerTimerCalc.stop(user.id);
      var subs = content.subInfo || [];

      var subInfo = {};
      utils.forEach(subs, function(sub){
        var isSameUser = (sub.userId == user.id)
        if(isSameUser){
          subInfo = sub;
        }
      });

      var params = {
        callId: callId,
        userId: user.id,
        mediaId: user.id,
        engineType: 3,
        mediaType: content.mediaType,
        subInfo: subInfo
      };
      
      Room.join(params);
      callback(error, message);
    });
  };

  var sendHungup = function (reason, content) {
    var remoteReason = Cache.get(CacheName.getReason(content));
    var callId = Cache.get(CacheName.RoomId);
    if(!callId){
      return;
    }
    utils.copy(content, {
      callId: callId,
      reason: remoteReason
    });

    var isPrivate = function () {
      return content.conversationType == 1;
    };
    var isGroup = function () {
      return content.conversationType == 3;
    };
    var isRemoteHungup = (remoteReason);
    var isSendHungup = ((isPrivate() && !isRemoteHungup) || isGroup());
    if (isSendHungup) {
      utils.copy(content, {
        reason: reason
      });
      var data = {
        command: 'hungup',
        data: content
      };
      sendCommand(data);
    }
    var summary = sessionTimer.stop(content), error = null;
    var user = getCurrentUser();
    callerTimerCalc.stop(user.id);
    Cache.set(CacheName.isJoined, false);
    Cache.set(CacheName.isCaller, false);
    Cache.set(CacheName.RoomId, '');

    Room.quit(content);

    commandWatcher.notify(summary);
  };
  /* 
    var content = {
      conversationType: conversationType,
      targetId: targetId
    };
  */
  var hungup = function (content) {
    sendHungup(Reason.HANGUP, content);
  };
  /* 
   var content = {
     conversationType: conversationType,
     targetId: targetId
   };
 */
  var reject = function (content) {
    sendHungup(Reason.REJECT, content);
  };
  var mute = function (content) {
    check({ type: 'mute' });
    var params = {
      isEnabled: false
    };
    Room.enableAudio(params);
  };
  var unmute = function () {
    check({ type: 'unmute' });
    var params = {
      isEnabled: true
    };
    Room.enableAudio(params);
  };
  var sendModifyMedia = function (content, mediaType) {
    var callId = Cache.get(CacheName.RoomId) || Cache.get(CacheName.getTempCallId(content));
    var mediaType = mediaType;

    var params = {
      command: 'mediaModify',
      data: {
        conversationType: content.conversationType,
        targetId: content.targetId,
        content: {
          callId: callId,
          mediaType: mediaType
        }
      }
    };
    sendCommand(params);
  };
  var videoToAudio = function (content) {
    Room.enableVideo({
      isEnabled: false
    });
    var mediaType = 1;
    sendModifyMedia(content, mediaType);
  };
  var audioToVideo = function (content) {
    Room.enableVideo({
      isEnabled: true
    });
    var mediaType = 2;
    sendModifyMedia(content, mediaType);
  };
  var startSharing = function () {
  };
  var stopSharing = function () {
  };
  /* 
    var users = [{
        id: 'userId01' 
        size: StreamType.MAX | StreamType.MIN
      }]

    var user = {
      id: 'userId01' 
      size: StreamType.MAX | StreamType.MIN
    };
  */
  var setStream = function (users) {
    if(utils.isObject(users)){
      users = [users];
    }
    utils.forEach(users, function(user, i){
      users[i] = utils.rename(user, {
        id: 'uid',
        size: 'flowType'
      });
    });
    Room.subscribeStream(users);
  };
  /* 
    // 可增量更新
    var subInfo = [{
      userId: 'userId01',
      defaultSub: 0,
      specialSub: [{
          uid: "userId03",
          subResource: 1
        }]
    }];
    或
    var subInfo  = {
      userId: 'userId01',
      defaultSub: 0,
      specialSub: [{
          uid: "userId03",
          subResource: 1
        }]
    };

    var content = {
      conversationType: 1,
      targetId: '' | ['id1', 'id2'],
      mode: CallMode.RTC_NORMAL,
      subInfo: subInfo
    };
  */
  var setSubscription = function (content) {
    check({type: 'setSubscription'});
    var subInfo = content.subInfo || [];
    if(utils.isObject(subInfo)){
      subInfo = [subInfo];
    }
    updateSelfSubscription(subInfo);

    subInfo = utils.filter(subInfo, function(subInfo){
      return subInfo.userId != user.id;
    });
    utils.copy(content, {
      subInfo: subInfo
    });
    if(subInfo.length > 0){
      var data = {
        command: 'subscriptionModify',
        data: content
      };
      sendCommand(data);
    }
  };

  win.RongCallLib = {
    CallMode: CallMode,
    SubscribeType: SubscribeType,
    StreamType: StreamType,
    Reason: Reason,
    init: function (config) {
      setConfig(config);
      Room.init(config);
      return {
        RongRTCProvider: RongRTCProvider,
        videoWatch: videoWatch,
        commandWatch: commandWatch,

        call: call,
        invite: invite,
        hungup: hungup,
        accept: accept,
        reject: reject,
        mute: mute,
        unmute: unmute,

        videoToAudio: videoToAudio,
        audioToVideo: audioToVideo,

        Camera: {
          open: Room.openLocalVideo,
          close: Room.closeLocalVideo
        },

        Stream: {
          set: setStream
        },

        Subscription: {
          set: setSubscription
        },

        ScreenSharing: {
          start: startSharing,
          stop: stopSharing
        },
        videoWatcher: videoWatcher
      };
    }
  };
})({
  win: window,
  RongRTCLib: window.RongRTCLib || function(){},
  RongRTCEventHandler: window.RongRTCEventHandler || function(){},
  MessageCtrl: MessageCtrl
});