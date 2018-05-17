
(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        var messageTypes = factory();
        global.RongMessageTypes = global.RongMessageTypes || {};
        global.RongMessageTypes.chatroom = messageTypes;
    }
})(window, function(){
    
return {
 "ChatroomBarrage": {
  "name": "RC:Chatroom:Barrage",
  "proto": {
   "content": "hellowrold"
  }
 },
 "ChatroomGift": {
  "name": "RC:Chatroom:Gift",
  "proto": {
   "id": "G008",
   "number": 530,
   "total": 900
  }
 },
 "ChatroomStart": {
  "name": "RC:Chatroom:Start",
  "proto": {
   "time": "1525415951135"
  }
 },
 "ChatroomEnd": {
  "name": "RC:Chatroom:End ",
  "proto": {
   "duration": "1 * 60 * 60"
  }
 },
 "ChatroomWelcome": {
  "name": "RC:Chatroom:Welcome",
  "proto": {
   "id": "u2018",
   "name": "martin",
   "portrait": "http://www.rongcloud.cn/portrait.jpg"
  }
 },
 "ChatroomFollow": {
  "name": "RC:Chatroom:Follow",
  "proto": {
   "id": "u2018",
   "name": "martin",
   "portrait": "http://www.rongcloud.cn/portrait.jpg"
  }
 },
 "ChatroomAddminAdd": {
  "name": "RC:Chatroom:Admin:Add",
  "proto": {
   "id": "u2018",
   "name": "martin",
   "portrait": "http://www.rongcloud.cn/portrait.jpg"
  }
 },
 "ChatroomAddminRemove": {
  "name": "RC:Chatroom:Admin:Remove",
  "proto": {
   "id": "u2018",
   "name": "martin",
   "portrait": "http://www.rongcloud.cn/portrait.jpg"
  }
 },
 "ChatroomUserBlock": {
  "name": "RC:Chatroom:User:Block",
  "proto": {
   "id": "u2018",
   "duration": 3600
  }
 },
 "ChatroomUserUnBlock": {
  "name": "RC:Chatroom:User:UnBlock",
  "proto": {
   "id": "u2018"
  }
 },
 "ChatroomUserQuit": {
  "name": "RC:Chatroom:User:Quit",
  "proto": {
   "id": "u2018"
  }
 },
 "ChatroomUserBan": {
  "name": "RC:Chatroom:User:Ban",
  "proto": {
   "id": "u2018"
  }
 },
 "ChatroomUserUnBan": {
  "name": "RC:Chatroom:User:UnBan",
  "proto": {
   "id": "u2018"
  }
 },
 "ChatroomSummary": {
  "name": "RC:Chatroom:Summary",
  "proto": {
   "online": 800
  }
 },
 "ChatroomLike": {
  "name": "RC:Chatroom:Like",
  "proto": {
   "count": 5
  }
 }
};
});
