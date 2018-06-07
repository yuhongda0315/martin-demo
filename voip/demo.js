var RongCallLib = RongCallLib.init({
  RongIMLib: RongIMLib
});

var tools = {
  //仅支持类选择器和 Id 选择器
  getDom: function(selector) {
    var selectorMap = {
      class: function(selector) {
        return document.getElementsByClassName(selector);
      },
      id: function(selector) {
        return document.getElementById(selector);
      }
    };
    var isClass = (selector.indexOf('.') == 0);
    var type = isClass ? 'class' : 'id';
    var name = selector.slice(1);
    return selectorMap[type](name);
  },
  toggleClass: function(node, name) {
    node.className = name;
  },
  createDom: function(name, attrs) {
    attrs = attrs || {};
    var node = document.createElement(name);
    for (var key in attrs) {
      node[key] = attrs[key];
    }
    return node;
  },
  noop: function(){}
};

var ClassType = {
  MAX: 'rong-max-window',
  MIN: 'rong-min-window'
};

var containerNode = tools.getDom('.rong-container')[0];

var clearWindow = function() {
  containerNode.innerHTML = '';
};

var setMaxWindow = function(minNode) {
  var maxNode = tools.getDom('.' + ClassType.MAX)[0];
  if (maxNode) {
    tools.toggleClass(maxNode, ClassType.MIN);
  }
  tools.toggleClass(minNode, ClassType.MAX);
};


var videoItem = {
  added: function(result) {
    var node = result.data;


    var win = tools.createDom('div', {
      className: ClassType.MIN
    });
    var isLocal = result.isLocal;

    win.onclick = function(event) {
      setMaxWindow(event.currentTarget);
    };
    win.appendChild(node);
    containerNode.appendChild(win);

    
    if (isLocal) {
      setMaxWindow(win);
    }
  },
  removed: function(result) {
    var videoId = result.data;
    var video = tools.getDom('#' + videoId);
    if (video) {
      var win = video.parentNode;
      containerNode.removeChild(win);
    }
  },
  leave: function() {
    clearWindow();
  }
};
// 注册视频节点监听
RongCallLib.videoWatch(function(result) {
  videoItem[result.type](result);
});

var tBarBasic = tools.getDom('.rong-toolbar-basic')[0];
var tBarOperation = tools.getDom('.rong-toolbar-operation')[0];
var show = function(node){
  node.style.display = 'block';
};
var hide = function(node){
  node.style.display = 'none';
};

var Buttons = {
  showOperation: function(){
    hide(tBarBasic);
    show(tBarOperation);
  },
  showBasic: function(){
    show(tBarBasic);
    hide(tBarOperation);
  }
};

var commandMap = {
  InviteMessage: function(){
    Buttons.showOperation();
  }
};
// 注册命令监听
RongCallLib.commandWatch(function(command) {
  var cmd = commandMap[command.messageType] || tools.noop;
  cmd();
  console.log(command);
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
  Buttons.showOperation();
  params.mediaType = mediaType;
  RongCallLib.call(params, function(error) {
    console.log(error);
  });
}

function hungup() {
  clearWindow();
  Buttons.showBasic();
  RongCallLib.hungup(params, function(error, summary) {
    console.log(summary);
  });
}

function acceptAudio() {
  params.mediaType = CallType.MEDIA_AUDIO;
  RongCallLib.accept(params);
}

function acceptVideo() {
  params.mediaType = CallType.MEDIA_VEDIO;
  RongCallLib.accept(params);
}

function reject() {
  Buttons.showBasic();
  RongCallLib.reject(params);
}

function mute() {
  RongCallLib.mute();
}

function unmute() {
  RongCallLib.unmute();
}

var isVideo = true;
function videoToAudio() {
  if (isVideo) {
    RongCallLib.videoToAudio();
    isVideo = false;
  }else{
    RongCallLib.audioToVideo();
    isVideo = true;
  }
}
