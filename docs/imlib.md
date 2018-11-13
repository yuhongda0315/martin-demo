---
title: Web SDK 开发指南 - 融云 RongCloud
description: 提供融云 Web 端开发的相关帮助和指南。
keywords: 融云 Web，Web 开发文档，Web SDK，即时通讯，im云服务
template: doc.jade
---

# Web SDK development guide

## Introduction to features

The RongCloud Web IM SDK version has been improved in many aspects. Here are a few descriptions of the features of SDK product:

** Light and stable: **
* SDK is developed using the TypeScript language with clear structure and robustness
* The instant messaging library is small, only about 100 KB
* The extended function is loaded as demanded and supports voice playback and Emoji libraries

** Rich functions: **
* Support multiple page connection
* Support conversation list roaming
* Support chat history roaming

** Compatibility: **
* Compatible with various environments: IE6 - IE11, Chrome, Firefox, Safari, Edge, QQ browser, WeChat browser, Electron, Android browser 2.3.6 and above
* Support two types of connection: WebSocket and HTTP Long Polling
* Support AMD and CMD

** Expansibility:  **
* Support custom messages
* Support custom stickers
* Support custom saving modes

** Provide an open source chat interface: **
* Provide open source Web IM and Desktop Demo

## Preparation in early stage

### Application creation

Each app provides a production environment and a development environment whose functions of are completely consistent and whose data are completely isolated. They have their own App Key/Secret and App Key respectively, in which Secret is the identity necessary for the RongCloud SDK to connect to the server. Please do not leak it.

Before the App is finally launched, use the development environment for development testing. The App Key/Secret of the production environment can be obtained after the application for launching is passed and launching is available after replacement.

## Import SDK

** Latest version: **

```
<script src="http(s)://cdn.ronghub.com/RongIMLib-2.3.3.min.js"></script>
```

** Example： **

`Web SDK Demo`：`https://rongcloud.github.io/websdk-demo`

`Web SDK API`：`https://rongcloud.github.io/websdk-demo/api-test.html`

## TypeScript Support

Download RongIMLib-2.3.3.d.ts locally:`http://cdn.ronghub.com/RongIMLib-2.3.3.d.ts`

```
/// <reference path="path/RongIMLib-2.3.3.d.ts" />
module RongIM {
  export class Client {
    static init(params: any): void{
      var RongIMClient = RongIMLib.RongIMClient;
      RongIMClient.init('appkey');
      // For more reference, please refer to : http://www.rongcloud.cn/docs/web_api_demo.html
    }
  }
}
```

## SDK integration

### Obtain Token

Token is the identity of current user connected to RongCloud on your APP. Before you connect to RongCloud server, you need to request Token via your App Server. Your App Server obtains Token through RongCloud Server API and returns it to your client. The client get the Token to connect to RongCloud server.

### Initialize the SDK

Initialization requires the developer background to create a new application to acquire AppKey and Token. Initialization code:

```js
RongIMLib.RongIMClient.init(appkey,[dataAccessProvider],[options])
```

AppKey: the unique identity of the application.

Token: the unique identity of the user.

```js
RongIMLib.RongIMClient.init("appkey");
```

### Set Monitor

1、A state monitor must be set before connecting the RongCloud server. The sample code is as follows:

```js
// Set the connection state for monitoring
 // Connect state monitor
  RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
      switch (status) {
      case RongIMLib.ConnectionStatus.CONNECTED:
          console.log ('successfully')
          break;
      case RongIMLib.ConnectionStatus.CONNECTING:
          console.log ('connecting')
          break;
      case RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log ('disconnected')
          break;
      case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log ('log in on other devices')
          break;
      case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log ('incorrect domain name')
          break;
      case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log ('network unavailable')
          break;
      }
  }});

// Message monitor
  RongIMClient.setOnReceiveMessageListener({
     // messages received
      onReceived: function (message) {
     // Determine the message type
      switch(message.messageType){
          case RongIMClient.MessageType.TextMessage:
          // message.content.content => content of the message
          break;
      case RongIMClient.MessageType.VoiceMessage:
          //  Preload the sound
          // message.content.content base64 code with a format of AMR
          break;
      case RongIMClient.MessageType.ImageMessage:
          // message.content.content => thumbnail of an image base64.
          // message.content.imageUri => Original image URL.
          break;
      case RongIMClient.MessageType.DiscussionNotificationMessage:
          // message.content.extension => Members of the discussion group.
          break;
      case RongIMClient.MessageType.LocationMessage:
          // message.content.latiude => latitude.
          // message.content.longitude => longitude.
          // message.content.content => location image base64.
          break;
      case RongIMClient.MessageType.RichContentMessage:
          // message.content.content => content of the text message.
          // message.content.imageUri =>image base64.
          // message.content.url => Original image URL.
          break;
      case RongIMClient.MessageType.InformationNotificationMessage:
          // do something...
          break;
      case RongIMClient.MessageType.ContactNotificationMessage:
          // do something...
          break;
      case RongIMClient.MessageType.ProfileNotificationMessage:
          // do something...
          break;
      case RongIMClient.MessageType.CommandNotificationMessage:
          // do something...
          break;
      case RongIMClient.MessageType.CommandMessage:
          // do something...
          break;
      case RongIMClient.MessageType.UnknownMessage:
          // do something...
          break;
      default:
      // do something...
      }
      }
 });
```

### Connect to server

RongCloud must be connected after implementing `RongIMLib.RongIMClient.init(appkey);` and be called after all methods other than monitoring has been successfully connected.

By default, only one page connection is supported, and one page can only be init once. Turn on "multi-device message synchronization" to support multi-page connection.

```js
 RongIMClient.connect(token, {
    onSuccess: function(userId) {
        console.log("Connect successfully." + userId);
    },
    onTokenIncorrect: function() {
        console.log ('invalid Token');
    },
    onError:function(errorCode){
        var info = '';
        switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info ='timeout';
            break;
        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
            info ='unacceptable protocol version';
            break;
        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
            info = 'incorrect appkey';
            break;
        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
            info = 'unavailable server';
            break;
        }
        console.log(errorCode);
      }
  });
```

### Reconnect

```js
    var callback = {
        onSuccess: function(userId) {
            console.log("Reconnect successfully." + userId);
        },
        onTokenIncorrect: function() {
            console.log('invalid Token');
        },
        onError:function(errorCode){
            console.log(errorcode);
        }
    };
    var config = {
        // false by default, select true to enable automatic reconnection as a required parameter
        auto: true,
        // Retry frequency  [100, 1000, 3000, 6000, 10000, 18000] in milliseconds, optional
        url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
        // Network sniffing address [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js optional
        rate: [100, 1000, 3000, 6000, 10000]
    };
    RongIMClient.reconnect(callback, config);
```

## Massage API

### Send a message

Messages must be sent after a successful connection to the RongCloud server, with a maximum frequency of up to 5 messages per second.

RongCloud supports sending text messages, image messages, voice messages, file messages, geo-location messages and custom messages to the private chats, group chats and chat rooms. RongCloud Web SDK does not provide functions of audio recording and transcoding, and the developer need to record and transcode voice messages on their own and send them through the RongCloud's built-in voice messages.

1.Text message

```js
  var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"extra message"});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
    onSuccess: function (message) {
   //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
        console.log("Send successfully");
    },
    onError: function (errorCode,message) {
    var info = '';
    switch (errorCode) {
    case RongIMLib.ErrorCode.TIMEOUT:
        info ='timeout';
        break;
    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
        info = 'unknown error'
        break;
    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
        info = 'unable to send messages to others when in the blacklist';
        break;
    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
        info ='not in the discussion group';
        break;
    case RongIMLib.ErrorCode.NOT_IN_GROUP:
        info ='not in the group';
        break;
    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
        info = 'not in the chat room';
        break;
    default :
        info = x;
        break;
    }
        console.log ('fail to send'+info)
    }
  }
);
```

Send pushData[notification] to Android or iOS as follows:

```js
 var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"extra message"});
 var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
 var targetId = "xxx"; // target Id
 var pushData = "your pushInfo";
 RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
        onSuccess: function (message) {
            .......
        },
        onError: function (errorCode,message) {
            ......
        }
    }, false, pushData
);
```

The usages of all the following message types related to pushData are as follows and will not be repeated.

2.Image message

For the uploading of images, please refer to: Upload plug-ins

```js
 /*
 Convert the image into FileReader or canvas that has access to HTML5, or upload it to the background for conversion.

Precautions:
 1. The thumbnail must be a JPG of base64 code.
 2. Without prefix.
 3. The recommended size should not exceed 100 K.
    */
  var base64Str = "thumbnail of base64 format";
  var imageUri = "image URL";// Upload to the URL of file server.
  var msg = new RongIMLib.ImageMessage({content:base64Str,imageUri:imageUri});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
    var info = '';
    switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info ='timeout';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = 'unknown error'
            break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = 'unable to send messages to others when in the blacklist';
            break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info ='not in the discussion group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info ='not in the group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = 'not in the chat room';
            break;
        default :
            info = x;
            break;
        }
          console.log ('fail to send'+info)
    }
  }
);
```

3、Rich content message

For the uploading of images, please refer to: Upload plug-ins

```js
  var content = "description of rich text message";
  var imageUri = "image URL";// Upload to the URL of your own server.
  var title = "title of rich text message";
  var url = "URL opened after clicking rich text message ";
  var msg = new RongIMLib.RichContentMessage({title:title,content:content,imageUri:imageUri,url:url});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
    console.log("Send successfully");
  },
  onError: function (errorCode,message) {
  var info = '';
  switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='timeout';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info ='not in the discussion group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info ='not in the group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = 'not in the chat room';
          break;
      default :
          info = x;
          break;
      }
      console.log ('fail to send'+info)
      }
  }
);
```

4、Location message

```js
var latitude = "latitude";
  var longitude = "longitude";
  var poi = "description of the location";
 var content = "location thumbnail";
  var msg = new RongIMLib.LocationMessage({latitude: latitude, longitude: longitude, poi: poi, content: content});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
      var info = '';
      switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='timeout';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info ='not in the discussion group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info ='not in the group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = 'not in the chat room';
          break;
      default :
          info = x;
          break;
      }
          console.log ('fail to send'+info)
      }
  }
);
```

5.Command message

```js
  var data = "command instruction";//It could be an object, data = {cmd:update};
  var msg = new RongIMLib.CommandMessage({data:data});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
    var info = '';
    switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info ='timeout';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = 'unknown error'
            break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = 'unable to send messages to others when in the blacklist';
            break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info ='not in the discussion group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info ='not in the group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = 'not in the chat room';
            break;
        default :
            info = x;
            break;
        }
            console.log ('fail to send'+info)
        }
    }
);
```

6、Status message of inputting

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;// the status of "inputting"is only displayed in private chat
 var targetId = "xxx";
 var msgName = "TextMessage";// the type of the message the user is entering VoiceMessage, etc.
 RongIMClient.getInstance().sendTypingStatusMessage(conversationType, targetId, msgName, {
  onSuccess: function (message) {
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
      var info = '';
      switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='overtime';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      default :
          info = x;
          break;
      }
          console.log ('fail to send'+info)
      }
});
```

7、Read notification message

```js
  var messageUId ="the unique Id of the message";
  var lastMessageSendTime = "the time of sending the last message";
  var type = "1";// standby, assign a value of 1 by default.
  // The above 3 attributes are available in the last message of the conversation.
  var msg = new RongIMLib.ReadReceiptMessage({ messageUId: messageUId, lastMessageSendTime: lastMessageSendTime, type: type });
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
      var info = '';
      switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='timeout';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info ='not in the discussion group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info ='not in the group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = 'not in the chat room';
          break;
      default :
          info = x;
          break;
      }
          console.log ('fail to send'+info)
      }
  }
);
```

8、@ message

Support @ conversation message: RongIMLib.ConversationType.GROUP、RongIMLib.ConversationType.DISCUSSION.

Support @ information message: TextMessage、ImageMessage、VoiceMessage、RichContentMessage、LocationMessage.

Transmit mode: RongIMClient.getInstance().sendMessage(conversationType,targetId,msg,callback,true);, set the last parameter to true.

```js
// Group chat
 var conversationtype = RongIMLib.ConversationType.GROUP;
 // Target Id
 var targetId = "groupId";
 // @ message object
 var mentioneds = new RongIMLib.MentionedInfo();
 // All: RongIMLib.MentionedType.ALL; part: RongIMLib.MentionedType.PART
  mentioneds.type = RongIMLib.MentionedType.PART;
  // The one of @
  mentioneds.userIdList = [];
 var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"extra message", mentionedInfo:mentioneds});
 RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
      var info = '';
      switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='overtime';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info ='not in the discussion group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info ='not in the group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = 'not in the chat room';
          break;
      default :
          info = x;
          break;
      }
          console.log ('fail to send'+info)
      }
  },true);
```

9、File message

For the uploading of files, please refer to: Upload plug-ins

```js
 var name = 'RongIMLib.js',
      size = 1024,
      type = 'js',
      fileUrl = 'http://xxxx.xxx.xx/RongIMLib.js';
  var msg = new RongIMLib.FileMessage({ name: name, size: size, type: type, fileUrl: fileUrl});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
  var targetId = "xxx"; // target Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
      console.log("Send successfully");
  },
  onError: function (errorCode,message) {
      var info = '';
      switch (errorCode) {
      case RongIMLib.ErrorCode.TIMEOUT:
          info ='overtime';
          break;
      case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = 'unknown error'
          break;
      case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = 'unable to send messages to others when in the blacklist';
          break;
      case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info ='not in the discussion group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info ='not in the group';
          break;
      case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = 'not in the chat room';
          break;
      default :
          info = x;
          break;
      }
          console.log ('fail to send'+info)
      }
  }
);
```

### Send group directed message

This method is used to send a message to some users in a group, and other users will not receive this message. It is recommended to use this function when sending a receipt of message reading status to some users in the group.


```js
var isMentiondMsg = false;//whether it is an @message, true for an @ message and false for an ordinary message
 var pushText = '';//Push displayed content
 var appData = ''//Push extra message at the time of notification
 var methodType = null
 var opts = {
 userIds: ['userId1', 'userId2']//user that received the message ID list
 };
 var conversationtype = RongIMLib.ConversationType.GROUP; //var type of the group chat
  var targetId = "xxx"; // target Id

var msg = new RongIMLib.TextMessage({content:"I am a directional message available to only userId1 and userId2" extra:"extra message"});

RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
  onSuccess: function (message) {
 //message is the message object sent and contains a unique Id of the message returned by the server and the message sending timestamp
  console.log("Send successfully");
  },
  onError: function (errorCode,message) {
        var info = '';
        switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info ='overtime';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = 'unknown error'
            break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = 'unable to send messages to others when in the blacklist';
            break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info ='not in the discussion group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info ='not in the group';
            break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = 'not in the chat room';
            break;
        default :
            info = x;
            break;
    }
        console.log ('fail to send'+info)
    }
 },isMentiondMsg, pushText, appData, methodType, opts);
```

### Get the historical message of one group chat

Circular pulling of the historic message is supported (only when timestrap is null). The specific logic:

Condition: of 45 historical records, 20 are pulled for each time 

For the first time, the pulled list has a length of 20 and hasMsg is true. 

For the second time, the pulled list has a length of 20 and hasMsg is true. 

For the third time, the pulled list has a length of 5 and hasMsg is false. 

For the fourth time, the pulled list has a length of 0 and hasMsg is false.

```js
var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
var targetId = "xxx"; // Assign the Id of the one with whom the historic message you want to targetId.
var timestrap = null; //Upload null by default. Set the value to 0,timestrap = 0 if you want to acquire the historic message from the beginning.
var count = 20; // The number of historic messages retrieved per time, ranging from 0 to 20, can be retrieved multiple times
RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
    onSuccess: function(list, hasMsg) {
    // list => Message array.
    // hasMsg =>Are there any historic messages available.
    },
    onError: function(error) {
        console.log("getHistoryMessages:" + error);
    }
 });
```

### Draft message

1.Save the draft

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
var draft = "draft message";
RongIMClient.getInstance().saveTextMessageDraft(conversationType,targetId,draft);
```

2.Acquire the draft

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
var draft = RongIMClient.getInstance().getTextMessageDraft(conversationType,targetId);
```

3.Delete the draft

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
RongIMClient.getInstance().clearTextMessageDraft(conversationType,targetId);
```

### Custom Message

The following example uses the WebSDK built-in message structure. For custom message structure, please refer to the development guide.

1.Define message type

```js
var messageName = "PersonMessage"; // message name.
var objectName = "s:person"; // Built-in name of the message, please follow this format to denominate.
var mesasgeTag = new RongIMLib.MessageTag(true,true);// whether to save the message and count, true true for saving and counting, and false false otherwise.
var prototypes = ["name","age"]; // attribute name in the message type.
RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes);
```

2.Send a message

```js
var conversationtype = RongIMLib.ConversationType.PRIVATE; // private chat, select the appropriate message type for the other sessions.
var targetId = "xxx"; // Assign the Id of the one with whom the historic message you want to targetId.
var msg = new RongIMClient.RegisterMessage.PersonMessage({name:"zhang",age:12});
RongIMClient.getInstance().sendMessage(conversationType,targetId, msg, {
    onSuccess: function (message) {
    },
    onError: function (errorCode) {
    }
});
```

3.Receive a message

Reception of a message is consistent with that of other built-in messages. Add a case to the setOnReceiveMessageListener mentioned above to display the message.

For example: case RongIMClient.MessageType.RegisterMessage : dosomething...

### Message recall

The server of the message recalling operation has no limit on the time range of recalling, which is determined by the client.


```js
//recallMessage is the message object that needs to be recalled
RongIMClient.getInstance().sendRecallMessage(recallMessage, {
onSuccess: function (message) {
    showResult("successfully recalled", message,start);
},
onError: function (errorCode,message) {
    showResult("failed to recall", message,start);
}});
```

### Clear the historic message of the server

```js
/**
 conversationType: type of the conversation

targetId: target Id

 timestamp: time point of deletion, message.sentTime <= message of the timestamp will be deleted (message: sentTime attribute in real-time or historic messages sent and received)
 Range of timestamp:  timestamp >=0 and timestamp <= the sentTime of the last message in the current conversation
 */
 var params = {
  conversationType: RongIMLib.ConversationType.PRIVATE, // type of the conversation
  targetId: 'dPd90Fkja', // target Id
  timestamp: 1513308018122 // time point of deletion
 };
 RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
  onSuccess: function() {
      // Successfully deleted
  },
  onError: function(error) {
      // Please check: is the cloud saving available for messages of a single group chat
      console.log(error);
  }
 });
```

## Conversation interface

### Conversation type

1.RongIMLib.ConversationType.PRIVATE :  two-person private chat with an enum value of 1.

2.RongIMLib.ConversationType.DISCUSSION: discussion group conversation with an enum value of 2.

3.RongIMLib.ConversationType.GROUP: group conversation with an enum value of 3.

4.RongIMLib.ConversationType.CHATROOM: chat room conversation with an enum value of 4.

5.RongIMLib.ConversationType.CUSTOMER_SERVICE: customer service conversation with an enum value of 5.

6.RongIMLib.ConversationType.SYSTEM: system message with an enum value of 6.

7.RongIMLib.ConversationType.APP_PUBLIC_SERVICE: public account (followed by default) conversation with an enum value of 7.

8.RongIMLib.ConversationType.PUBLIC_SERVICE: public account (followed privately) conversation with an enum value of 8.


### Get the conversation list

```js
RongIMClient.getInstance().getConversationList({
  onSuccess: function(list) {
    //  list => Collection of conversation list.
  },
  onError: function(error) {
     // do something...
  }
}, null);
```

In the conversation list, the data structure of each conversation is as follows:

Name     | Description
:--------------|:-------------------------------------------------------
conversationTitle     | Conversation title.
conversationType     | conversation type: 1-private chat, 3-group, 4-chat room, 5-customer service, 6-system, 7-public service of App, 8-common public service
latestMessageId     | The last message Id in the conversation.
notificationStatus     | Whether to enable Do Not Disturb (DND)
objectName     | Message identification for the last message in the conversation, with the RongCloud built-in message beginning with "RC:". Table for the Type of RongCloud Built-in Messages
sentStatus     | 10-sending, 20-fail to send, 30-sent, 40-received, 50-read, 60-destroyed.
sentTime     | Time of sending the last message in the conversation to RongCloud server side.
targetId     | It could be the user Id, 3-group Id, 4-chat room Id, 5-customer service Id, 6-system conversation Id, 7-pubic account of the App, 8-common public account Id
unreadMessageCount     | The number of unread messages in the current conversation.
latestMessage     | The last message in the conversation.

The structure of the latestMessage  in the conversation list is as follows:

Name     | Description
:--------------|:-------------------------------------------------------
content     | Message content.
conversationType     | conversation type: 1-private chat, 3-group, 4-chat room, 5-customer service, 6-system, 7-public service of App, 8-common public service
objectName     | Message identification, with the RongCloud built-in message beginning with "RC:". Table for the Type of RongCloud Built-in Messages
messageDirection     | Message direction, 1 for the message sent, 2 for the message received.
messageId     | Locally generated message Id.
sentStatus     | 10-sending, 20-fail to send, 30-sent, 40-received, 50-read, 60-destroyed.
receivedTime     | The local time at which the message is received by the App
senderUserId     | Sender Id
sentTime     | Time of sending the message at RongCloud server side.
targetId     | Target Id
messageType     | For details of the message type, please refer to message type description.
messageUId     | The unique identification of the message at the RongCloud server side. The message could be recalled through messageUId.
offLineMessage     | Whether it is an offline message, true for an offline message and false otherwise.

### Modify the conversation

This method can modify the information in the conversation, and fill in the user information or conversation Title, etc.

1.If local storage is not used, you must first execute getConversationList and have this conversation to make this method effective.

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
RongIMLib.RongIMClient.getInstance().getConversation(conversationType,targetId,{
        onSuccess:function(con){
            if (con) {
              con.conversationTitle="Title of the conversation";
              RongIMLib.RongIMClient.getInstance().updateConversation(con);
              consoleInfo("updateConversation Success!");
            }
        }
    });
```

2. Get the Conversation

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
RongIMLib.RongIMClient.getInstance().getConversation(conversationType,targetId,{
        onSuccess:function(con){
           console.log(con);
        }
    });
```

3.Remove the conversation

```js
RongIMClient.getInstance().removeConversation(RongIMLib.ConversationType.PRIVATE,"1002",{
    onSuccess:function(bool){
       //Conversation is successfully deleted.
    },
	onError:function(error){
	     //error => Delete the error code of the conversation
	}
});
```

4.Clear conversations by conversation type:

```js
var conversationTypes = [RongIMLib.ConversationType.PRIVATE,RongIMLib.ConversationType.GROUP];
RongIMClient.getInstance().clearConversations({
    onSuccess:function(){
    //Conversation is successfully deleted
    },
    onError:function(error){
    // error => Delete the error code of the conversation.

    }
},conversationTypes);
```


5.Clear all conversations:

```js
RongIMClient.getInstance().clearConversations({
  onSuccess:function(){
      //Conversation is successfully deleted
  },
  onError:function(error){
      // error => Delete the error code of the conversation.
  }
});
```

### Unread message count

If the browser does not support WebStorage and you are not using local storage, the number of unread messages will not be saved, and the number of unread messages will be unavailable after the browser page refreshes.

1.Get the total number of unread messages for all conversations

```js
RongIMClient.getInstance().getTotalUnreadCount({
  onSuccess:function(count){
  // count => The total number of unread messages for all conversations
  },
  onError:function(error){
  // error => the error code of the total number of unread messages
  }
 });
```

2.Get the total number of unread messages for multiple conversations

```js
var conversationTypes = [RongIMLib.ConversationType.PRIVATE,RongIMLib.ConversationType.DISCUSSION];
RongIMClient.getInstance().getConversationUnreadCount(conversationTypes,{
  onSuccess:function(count){
      // count => The total number of unread messages for multiple conversations
  },
  onError:function(error){
      // error => the error code of the total number of unread messages for multiple conversations
  }
});
```

3.Get the total number of unread messages for specified conversations

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType,targetId,{
    onSuccess:function(count){
    // count => The total number of unread messages for specified conversations
    },
    onError:function(){
    // error => Acquire the error code of the total number of unread messages for specified conversations
    }
});
```

4.clear unread message count

```js
var conversationType = RongIMLib.ConversationType.PRIVATE;
var targetId = "xxx";
RongIMClient.getInstance().clearUnreadCount(conversationType,targetId,{
	onSuccess:function(){
  // Unread messages are successfully emptied.
  },
  onError:function(error){
  // error => Empty the error code of the unread message.

	}
});
```

## Group

The group relationship and group list will be maintained by you App. All group operations in the client need to request your App Server. Your App Server can conduct the management and control according to its own logic, and then perform the group operations through the Server API interface. The results will be returned to the client.

The flow for the group operation of the client is shown below.


** Create the group **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group creation request to its own application server.
  App Server -> RongCloud Server: after the authorization succeeds, synchronously create the group in the RongCloud server. \n /group/create
  RongCloud Server -> App Server: the creation is successful with returning the status.
  App Server -> App: the creation succeeds and the group information can be sent.
</canvas>

** Join the group **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group entering request to its own application server.
  App Server -> RongCloud Server: after the authorization succeeds, call the RongCloud server to enter the group interface. \n /group/join
  RongCloud Server -> App Server: the entering is successful with returning the status.
  App Server -> App: the entering succeeds and the user can send the information in the group.
</canvas>

** Quit the group **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group quit request to its own application server.
  App Server -> RongCloud Server: after the authorization succeeds, call the RongCloud server to quit the group interface. \n /group/quit
  RongCloud Server -> App Server: the quit is successful with returning the status.
  App Server -> App: quit the group and the user will not receive the information of such group.
</canvas>

** Dissmis the group **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group dissolution request to its own application server.
  App Server -> RongCloud Server: after the authorization succeeds, call the RongCloud server to dissolve the group interface. \n /group/dismiss
  RongCloud Server -> App Server: the dissolution is successful with returning the status.
  App Server -> App: the group is successfully dissolved.
</canvas>

** Set the group information **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group information setting request to its own application server.
  App Server -> RongCloud Server: after the authorization succeeds, call the RongCloud server to set the group interface. \n /group/refresh
  RongCloud Server -> App Server: the setting is successful with returning the status.
  App Server -> App: the group information has been set successfully.
</canvas>

** Get the group member list **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> App Server: App initiates a group member inquiry to its own application server.
  App Server -> App: it is successful with returning the member information.
</canvas>

** Get the group list **

<canvas id="canvasSequenced_sendImageMessage" width="800" sequenced>
  App -> RongCloud Server: connect the RongCloud server  connect
  RongCloud Server -> App: the connection is successful with returning the status information.
  App --> App Server: request to obtain the group list
  App Server -> RongCloud Server: in case of change, it is necessary to synchronize the group information to the RongCloud server.
  RongCloud Server -> App Server: it is successful with returning the status information.
  App Server --> App: it is successful with returning the group list.
</canvas>

## Chat Room

1.Join

```js
 var chatRoomId = "xxxx"; // chat room Id.
 var count = 10;// Pull up to 50 recent chats.
 RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
  onSuccess: function() {
      //Joined the chat room successfully.
  },
  onError: function(error) {
      //Failed to join the chat room
  }
 });
```

2.Quti

```js
 var chatRoomId = "xxxx"; // chat room Id.
 RongIMClient.getInstance().quitChatRoom(chatRoomId, {
  onSuccess: function() {
      // Exited the chat room successfully.
  },
  onError: function(error) {
      // Failed to exit the chat room.
  }
});
```

3.Get information

```js
 var chatRoomId = "xxxx"; // chat room Id.
 var count = 10; //Acquire the number of persons in the chat room (ranging from 0 to 20)
 var order = RongIMLib.GetChatRoomType.REVERSE;//Sort order
 RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
  onSuccess: function(chatRoom) {
      // chatRoom => Chat room information
      // chatRoom.userInfos => Return to the chat room member.
      // chatRoom.userTotalNums =>Current total number of members in the chat room.
  },
  onError: function(error) {
      // Failed to get chat room information.
  }
 });
```

4.Set the start time of the get historical message

```js
var chatRoomId = 'xxxx';
var timestamp = 0; //Time to start the retrieving of the historic message (millisecond)
RongIMClient.getInstance().setChatroomHisMessageTimestamp(chatRoomId, timestamp);
```

## Configuration

## Maintenance of information of users, groups and chat rooms

RongCloud provides instant messaging service and does not establish a parallel user system outside the App. The specific information of users and groups and details of the chat room all need to be maintained on the App Server and provided on the end with services such as inquiry and modification. Finally, they can be synchronized with RongCloud in time. The following is an integrated processing method.

** The logic associated with users, groups, and chat rooms when using the RongCloud service is as follows: **

1. RongCloud needs the information of users, groups and chat rooms associated with the message. Details are as follows

  The App Server maintains all user information and requests the registered users of RongCloud(provide id, name, and portrait). The id is used for messaging, and the name is used push. This interface also provides a refresh method.

  App Server maintains the information of groups and members. In other words, the creation of a group and maintenance of group members shall be synchronized to RongCloud after being completed in the App Server, limited to the information of the group (group Id) and group members (member id), both of which are available for messaging. The message is sent to the group id, and the group member can get the corresponding message.

2. The user creates and joins a chat room by calling the SDK corresponding methods on the end.

3. Through the link server, messaging, etc., RongCloud carries relevant ids (user id and group id) to each end which requests the App Server to obtain the detailed information (user name, portrait, group name, group portrait, group member information, and other business-related data such as position and rank required by the business) through id.

  The user uses Token to link RongCloud and return to the id of current user to obtain details of the logged in user.

  When the message is received, conversationType, targetId and senderUserId are available in the message body. Details of the sender of a private chat (conversationType = 1) can be obtained by userId = senderUserId, information of the group of a group chat (conversationType = 3) can be obtained by groupId = targetId. You may directly return to the group and member information or request access separately, depending on the interface design.

4. When a message of the chat room is received (conversationType = 4), you may obtain the sender id through senderUserId, the chatroom id through targetId, and then obtain the list of chatroom members to process the corresponding user information logic.

Finally, a code reference for a specific implementation is provided:`https://github.com/rongcloud/websdk-demo/blob/master/user-group.js`

## Sticker library

### Sticker library trackback address

Obtain the official sticker library (current version is 2.2.7) :

```
<script src="http(s)://cdn.ronghub.com/RongEmoji-2.2.7.min.js"></script>
```

Code example: `https://rongcloud.github.io/websdk-demo/emoji.html`


### How to use the sticker library

1. Compatible with sticker libraries of version 2.2.6 and below
2. By default, 128 Emoji stickers are supported and custom extension of Emoji is supported
3. Range of support:

  (1) Mainstream desktop browsers such as IE7+, Edge, Chrome 30+, Firefox 30+ and Safari 10+

  (2) Chrome browser and Wechat browser for Android 4.4+ systems

  (3) Safari browser and WeChat browser for iPhone iOS 8.0+


#### 1、Emoji initialization

** Initialize with default parameters **

```js
RongIMLib.RongIMEmoji.init();
```

** Initialize by configuration **

```js   
 // Refer to http://unicode.org/emoji/charts/full-emoji-list.html for sticker information
 var config = {
   Size: 24, // size, 24 by default, recommend 18 - 58
   url: "//f2e.cn.ronghub.com/sdk/emoji-48.png", // Emoji background image
   lang: "zh", // Emoji language corresponding to the name, default zh
    // expand the sticker
   extension: {
     dataSource: {
       u1F914: {
         en: "thinking face", // English name
         zh: "think", // Chinese name
         tag: "😀", // original Emoji
         position: "0 0" //  coordinates of position on the background image
       }
     },
     // new Emoji background image url
     url: "//cdn.ronghub.com/thinking-face.png"
   }
 };
 RongIMLib.RongIMEmoji.init(config);
```

#### 2、Obtain Emoji list

```js
var list = RongIMLib.RongIMEmoji.list;
/*
list => [
	{
		unicode: 'u1F600',
		emoji: "😀",
		node: span,
		symbol: "[smiling broadly]"
	},
	...
]
*/
```

#### 3、Transfer Emoji to name

When original Emoji rendering is not supported, corresponding names can be displayed for message input

```js
var message = "😀😁test Emoji";
// Convert the original Emoji in the message to its corresponding name
RongIMLib.RongIMEmoji.emojiToSymbol(message);
// => "[smiling broadly][grinning]test Emoji"
```

#### 4、Transfer name into Emoji

Original Emoji characters must be used in the message body when sending a message

```js
var message = "[smiling broadly][grinning]test Emoji"
// Convert the Emoji in the message to the original Emoji
RongIMLib.RongIMEmoji.symbolToEmoji(message);
// => "😀😁test Emoji"
```

#### 5、Transfer Emoji to HTML

When the Web SDK receives the message, the original Emoji characters in the message body will be decoded to the corresponding Unicode code, which requires the calling of a transformation mode for correct display

```js
var message = "\uf600test Emoji";
// Convert the original Emoji (including Unicode) in the message to HTML
RongIMLib.RongIMEmoji.emojiToHTML(message);
// => "<span class='rong-emoji-content' name='[smiling broadly]'>😀</span>test Emoji"
```

#### 6、Transfer name into HTML

```js
var message = "[grinning]test Emoji";
// Convert the Emoji in the message to HTML
RongIMLib.RongIMEmoji.symbolToHTML(message);
// => "<span class='rong-emoji-content' name='[grinning]'>😁</span>测试 Emoji"
```

#### 7、Support ADM and CMD
```js
// requirejs
require.config({
	paths: {
		'RongIMEmoji': 'http(s)://cdn.ronghub.com/RongEmoji-2.2.6.min'
	}
});
require(['RongIMEmoji'], function(RongIMEmoji) {
	var message = "\uf600test Emoji";
	RongIMEmoji.symbolToEmoji(message);
    // => "😀test Emoji"
});
```

## Dynamic sticker library

Sticker package: includes a group of stickers.  Multiple sticker packages can exist simultaneously

Sticker: a specific sticker that must belong to a certain sticker package

** Compatibility **: IE6+, Chrome, FireFox, Safari, iOS Safari, Android4.0+ browsers


### Imort SDK

```js
// Normal
<script src="http[s]://cdn.ronghub.com/rong-sticker-1.0.0[.min].js"></script>

// RequieJS
require.config({
  paths: {
    RongSticker: 'http[s]://cdn.ronghub.com/rong-sticker-1.0.0[.min]'
  }
});

require(['RongSticker'], function(RongSticker) {
  // Please refer to https: https://github.com/rongcloud/websdk-demo/sticker/sticker.html
});
```

### example

Dynamic sticker: `https://rongcloud.github.io/websdk-demo/sticker/sticker.html`

IM sticker reception and sending: `https://rongcloud.github.io/websdk-demo/sticker/message.html`

RequireJS：`https://rongcloud.github.io/websdk-demo/sticker/require.html`


### Interface

#### Initialization

** API **：`RongSticker.init(config);`

** config description **：

Property Name   | Type   | Mandatory   | Description   | Version
:-----    | :-----  | :----- |:-------------- | :-----
appkey    | String    | Yes    | The unique identity of an App. Please move to the developer backgroundto create the App    | 1.0.0
url    | String    | No    | Service address of the sticker package    | 1.0.0
extensions    | Array    | No    | Extended message package    | 1.0.0


** Example **：

```js
var config = {
  appkey: 'appkey'
};
var rongSticker = RongSticker.init(config);
```

** Example of the extension package: **

```js
  var extensions = [{
  // Sticker package Id
  id: "c60plBGwk2686yv4vmv4H9",
  name: "Haibaobao",
  desc: "sticker 'Haibaobao' made by RongCloud",
  icon: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/icon_c60plBGwk2686yv4vmv4H9.png",
  poster: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/cover_c60plBGwk2686yv4vmv4H9.png",
  order: 1,
  author: "rongcloud",
  copyright: "rongcloud",
  // Sticker list
  stickers: [{
      id: "c60plBGwk2686yv4vmv4H9",
      name: "Haibaobao",
      desc: "sticker 'Haibaobao' made by RongCloud",
      icon: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/icon_c60plBGwk2686yv4vmv4H9.png",
      poster: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/cover_c60plBGwk2686yv4vmv4H9.png",
      order: 1,
      author: "rongcloud",
      copyright: "rongcloud"
  }]
}];

var config = {
  appkey: 'appkey',
  extensions: extensions
};
var rongSticker = RongSticker.init(config);
```

#### Obtain the list pf sticker packages

** API **： `Package.getList(callback);`

** Parameter description **：

Property Name   | Type   | Mandatory   | Description   | Version
:--------|:--------- |:--------|:-------------- |:---------
callback   | Function   | Yes   | Callback the function to for receiving data   | 1.0.0

** Example **：

```js
var config = {
  appkey: 'appkey'
};
var rongSticker = RongSticker.init(config);
var Package = rongSticker.Package;
Package.getList(function(result, error){
  // result.packages => List of sticker packages
  // error => Error message, error is null in case of normal return
});
```

** packages structure **：

```js
[
  {
      id: "c60plBGwk2686yv4vmv4H9",
      name: "Haibaobao",
      desc: "sticker 'Haibaobao' made by RongCloud",
      icon: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/icon_c60plBGwk2686yv4vmv4H9.png",
      poster: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/cover_c60plBGwk2686yv4vmv4H9.png",
      order: 1,
      author: "rongcloud",
      copyright: "rongcloud"
  }
]
```

#### Obtain the list pf stickers

** API **： `Sticker.getList(package, callback);`

** package **：

Property Name   | Type   | Mandatory   | Description   | Version
:--------- |:--------- |:--------|:-------------- |:-----
id   | String   | Yes   | Sticker package Id   | 1.0.0

** callback **：

Property Name   | Type   | Mandatory   | Description   | Version
:-----|:-----|:--- |:-------------- |:-----
callback   | Function   | Yes   | Callback the function to for receiving data | 1.0.0

** Example **：

```js
var config = {
  appkey: 'appkey'
};
var rongSticker = RongSticker.init(config);
var Sticker = rongSticker.Sticker;

var package = {
  id: 'c60plBGwk2686yv4vmv4H9'
};
Sticker.getList(function(result, error){
  // result.stickers => List of stickers
  // error => Error message, error is null in case of normal return
});
```

** stickers structure **：

```js
[
  {
    packageId: "c60plBGwk2686yv4vmv4H9"
    stickerId: "d1PN1xTZ47p9nfMNWfGpyH",
    desc: "no problem",
    url: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/image_d1PN1xTZ47p9nfMNWfGpyH.gif",
    thumbUrl: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/thumb_d1PN1xTZ47p9nfMNWfGpyH.png",
    height: 240,
    width: 240,
    order: 1
  }
]
```

#### Get a sticker

** API **： `Sticker.get(stciker, callback);`

** stciker **：

Property Name    | Type    | Mandatory    | Description    | Version
:---------|:---------|:----- |:-------------- |:-----
packageId    | String    | Yes    | Sticker package Id    | 1.0.0
stickerId    | String    | Yes    | Sticker Id    | 1.0.0


** callback **：

Property Name   | Type   | Mandatory   | Description   | Version
:-----|:-----|:--- |:-------------- |:-----
callback   | Function   | Yes   | Callback the function to for receiving data   | 1.0.0

** Example **：

```js
var config = {
  appkey: 'appkey'
};
var rongSticker = RongSticker.init(config);
var Sticker = rongSticker.Sticker;

var sticker = {
  packageId: 'c60plBGwk2686yv4vmv4H9',
  stickerId: 'd1PN1xTZ47p9nfMNWfGpyH'
};
Sticker.get(function(sticker, error){
  // sticker => sticker
  // error => Error message, error is null in case of normal return
});
```

** sticker structure **：

```js
{
  packageId: "c60plBGwk2686yv4vmv4H9"
  stickerId: "d1PN1xTZ47p9nfMNWfGpyH",
  desc: "no problem",
  url: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/image_d1PN1xTZ47p9nfMNWfGpyH.gif",
  thumbUrl: "http://sticker.ronghub.com/c60plBGwk2686yv4vmv4H9/thumb_d1PN1xTZ47p9nfMNWfGpyH.png",
  height: 240,
  width: 240,
  order: 1
}
```


## Voice library

### Voice library trackback address

Obtain the official voice library (current version is 2.2.5) :

```
<script src="http(s)://cdn.ronghub.com/Libamr-2.2.5.min.js"></script>
```

```
<script src="http(s)://cdn.ronghub.com/RongIMVoice-2.2.5.min.js"></script>
```

Code example: `https://rongcloud.github.io/websdk-demo/voice.html`

### How to use the voice library

Range of support:

(1) Mainstream desktop browsers such as IE9+, Edge, Chrome 49+, Firefox 52+ and Safari

(2) Default  browser and Wechat browser for Android 4.4+ systems

(3) iOS Safari browser and Wechat browser

#### 1.Initialization

```js
RongIMLib.RongIMVoice.init();
```

#### 2.Play audio

```js
 /*
    Audio format: AMR in base64 format
    Complete audio sample : https://cdn.ronghub.com/voice-amr-base64.json
 */
 var audioFile = "IyFBTVIKLNEafAAeef/hgmeAH8AD...";
 // Audio file length
 var duration = audioFile.length / 1024;
 // Preload
 RongIMLib.RongIMVoice.preLoaded(audioFile, function(){
    //Play sound
    RongIMLib.RongIMVoice.play(audioFile, duration);
 });
```

#### 3.Stop playing

```js
RongIMLib.RongIMVoice.stop(audioFile);
```

## Upload plug-ins

Service of private file uploading

The service of private file accounting needs to expose uploadProcess, and the upload service in upload.js calls the global uploadProcess method.

See details in uploading Demo:

`https://github.com/rongcloud/rongcloud-web-im-upload/tree/master/qiniu`
