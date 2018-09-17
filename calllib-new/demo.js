var SubscribeType = RongCallLib.SubscribeType;
var CallMode = RongCallLib.CallMode;
var StreamType = RongCallLib.StreamType;
var RongCallLib = RongCallLib.init({
  // url: '',
  url: 'tcp://10.13.10.134:8080',
  // url: 'tcp://120.92.22.221:18080',
  RongIMLib: RongIMLib,
  currentUserId: params.userId,
  timeout: 10000
});

var ClassType = {
  MAX: 'rong-max-window',
  MIN: 'rong-min-window'
};

var containerNode = tools.getDom('.rong-container')[0];

var clearWindow = function () {
  containerNode.innerHTML = '';
};

var setMaxWindow = function (minNode) {
  var maxNode = tools.getDom('.' + ClassType.MAX)[0];
  if (maxNode) {
    tools.toggleClass(maxNode, ClassType.MIN);
  }
  tools.toggleClass(minNode, ClassType.MAX);
};

var createVideo = function (result) {
  // var video = document.createElement('video');
  // video.autoplay = true;
  // video.controls = false;
  // video.srcObject = result.data;
  var node = result.data;
  node.removeAttribute('height');
  node.removeAttribute('width');
  return node;
};
var videoItem = {
  added: function (result) {
    var node = createVideo(result);

    var win = tools.createDom('div', {
      className: ClassType.MIN
    });
    var isLocal = result.isLocal;

    win.onclick = function (event) {
      setMaxWindow(event.currentTarget);
    };
    win.appendChild(node);
    containerNode.appendChild(win);

    if (isLocal) {
      setMaxWindow(win);
    }
  },
  removed: function (result) {
    var videoId = result.data;
    var video = tools.getDom('#' + videoId);
    if (video) {
      var win = video.parentNode;
      containerNode.removeChild(win);
    }
  },
  leave: function () {
    clearWindow();
  }
};
// 注册视频节点监听
RongCallLib.videoWatch(function (result) {
  console.log(result);
  videoItem[result.type](result);
});

var tBarCallVideo = tools.getDom('.rong-callvideo')[0];
var tBarCallAudio = tools.getDom('.rong-callaudio')[0];

var tBarAccept = tools.getDom('.rong-accept')[0];
var tBarHungup = tools.getDom('.rong-hungup')[0];

var tBarMute = tools.getDom('.rong-mute')[0];
var tBarUnMute = tools.getDom('.rong-unmute')[0];

var tBarDisableVideo = tools.getDom('.rong-disable-video')[0];
var tbarDisableAudio = tools.getDom('.rong-disable-audio')[0];

var show = function (node) {
  node.style.display = 'block';
};
var hide = function (node) {
  node.style.display = 'none';
};

var Buttons = {
  showCall: function () {
    show(tBarCallVideo);
    show(tBarCallAudio);
  },
  hideCall: function () {
    hide(tBarCallVideo);
    hide(tBarCallAudio);
  },
  showAccept: function () {
    show(tBarAccept);
  },
  hideAccept: function () {
    hide(tBarAccept);
  },
  showMute: function () {
    show(tBarMute);
    hide(tBarUnMute);
  },
  showUnmute: function () {
    show(tBarUnMute);
    hide(tBarMute);
  },
  showDisableVideo: function () {
    show(tBarDisableVideo);
    hide(tbarDisableAudio);
  },
  showDisableAudio: function () {
    show(tbarDisableAudio);
    hide(tBarDisableVideo);
  },
  showCaller: function () {
    show(tBarHungup);
    show(tBarMute);
    show(tBarDisableVideo);
  },
  showCallee: function () {
    show(tBarAccept);
    show(tBarHungup);
    show(tBarMute);
    show(tBarDisableVideo);
  },
  hideOperate: function () {
    hide(tBarHungup);
    hide(tBarAccept);
    hide(tBarMute);
    hide(tBarUnMute);
    hide(tBarDisableVideo);
    hide(tbarDisableAudio);
  }
};
var globalSubInfo = [];
var invateMessage = {};
var commandMap = {
  InviteMessage: function (command) {
    Buttons.showCallee();
    Buttons.hideCall();
    globalSubInfo = command.content.subInfo;
    invateMessage = command;
  },
  MemberModifyMessage: function (command) {
    Buttons.showCallee();
    Buttons.hideCall();
    globalSubInfo = command.content.subInfo;
    invateMessage = command;
  }
};

// 注册命令监听
RongCallLib.commandWatch(function (command) {
  console.log(command);
  var cmd = commandMap[command.messageType] || tools.noop;
  cmd(command);
});

var CallType = RongIMLib.VoIPMediaType;
function callVideo() {
  var mediaType = CallType.MEDIA_VEDIO;
  call(mediaType);
}

function callAudio() {
  var mediaType = CallType.MEDIA_AUDIO;
  call(mediaType);
}

function call(mediaType) {

  Buttons.hideCall();
  Buttons.showCaller();

  params.mediaType = mediaType;
  params.subInfo = [{
    "userId": "member01",
    "defaultSub": SubscribeType.AUDIO_AND_VIDEO
  }, {
    "userId": "member02",
    "defaultSub": SubscribeType.AUDIO_AND_VIDEO
  }, {
    "userId": "member03",
    "defaultSub": SubscribeType.AUDIO_AND_VIDEO
  }];

  if(!params.inviteUserIds){
    var node = tools.getDom('pull');
    var userIds = node.value.split(',');
    params.inviteUserIds = userIds;
    params.targetId = userIds[0];
  }

  RongCallLib.call(params, function (error) {
    console.log(error);
  });
}

function pull(){
  Buttons.hideCall();
  Buttons.showCaller();

  var mediaType = CallType.MEDIA_AUDIO;

  
  if(!params.inviteUserIds){
    var node = tools.getDom('pull');
    var userIds = node.value.split(',');
    params.inviteUserIds = userIds;
    params.targetId = userIds[0];
  }
  var userId = RongIMLib.Bridge._client.userId;
  params.subInfo = [{
    "userId": userId,
    "defaultSub": SubscribeType.NONE,
    "specialSub": [{
      "uid": params.targetId,
      "subResource": SubscribeType.ONLY_VIDEO
    }]
  },{
    "userId": params.targetId,
    "defaultSub": SubscribeType.NONE
  }];
  RongCallLib.call(params, function (error) {
    console.log(error);
  });
}

function transfer(){
  
  var node = tools.getDom('transfer');
  var userIds = node.value.split(',');
  // a,b:  将 a 的视频转发给 b
  var sourceUserId = userIds[0];
  var toUserId = userIds[1];
  // if(!params.inviteUserIds){
  params.inviteUserIds = [toUserId];
  params.targetId = toUserId;
  // }
  params.subInfo = [{
    userId: toUserId,
    defaultSub: SubscribeType.NONE,
    specialSub: [{
      uid: sourceUserId,
      subResource: SubscribeType.ONLY_VIDEO
    }]
  }];
  
  RongCallLib.invite(params, function(error){
    console.log(error);
  });
}

function updateSubscription(){
  var node = tools.getDom('update_subscription');
  var userIds = node.value.split(',');
  // a,b:  修改 a 的关系，让 a 看到 b 的视频
  var toUserId = userIds[0];
  var sourceUserId = userIds[1];

  params.targetId = toUserId;

  params.subInfo = [{
    userId: toUserId,
    defaultSub: SubscribeType.NONE,
    specialSubs: [{
      uid: sourceUserId,
      subResource: SubscribeType.ONLY_VIDEO
    }]
  }];
  RongCallLib.Subscription.set(params);
}

function setMaxStream(){
  var user = {
    id: 'martin3',
    size: StreamType.MAX
  };
  RongCallLib.Stream.set(user);
}

function setMinStream(){
  var user = {
    id: 'martin3',
    size: StreamType.MIN
  };
  RongCallLib.Stream.set(user);
}

function hungup() {
  Buttons.showCall();
  Buttons.hideOperate();
  clearWindow();
  RongCallLib.hungup(params, function (error, summary) {
    console.log(summary);
  });
}

function acceptVideo() {
  Buttons.hideAccept();
  params.mediaType = CallType.MEDIA_VEDIO;
  params.subInfo = globalSubInfo;
  params.targetId = invateMessage.targetId;
  if(invateMessage.conversationType == 1){
    params.targetId = invateMessage.senderUserId;
  } 
  RongCallLib.accept(params);
}

function reject() {
  RongCallLib.reject(params);
}

function mute() {
  Buttons.showUnmute();
  RongCallLib.mute({
    conversationType: 3,
    targetId: config.groupId
  });
}

function unmute() {
  Buttons.showMute();
  RongCallLib.unmute({
    conversationType: 3,
    targetId: config.groupId
  });
}

function videoToAudio() {
  Buttons.showDisableAudio();
  RongCallLib.videoToAudio({
    conversationType: 3,
    targetId: config.groupId
  });
}

function audioToVideo() {
  Buttons.showDisableVideo();
  RongCallLib.audioToVideo({
    conversationType: 3,
    targetId: config.groupId
  });
}
