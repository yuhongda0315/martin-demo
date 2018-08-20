### 体验聊天室

使用 `聊天室消息库` 版聊天室示例，体验:

<img src="./chatroom/qr.png" height="320px" width="250px">

[Android 下载](http://downloads.rongcloud.cn/demo_chatroom.apk) | [iOS 下载](http://downloads.rongcloud.cn/demo_chatroom.ipa)

### 使用指南

> 下载消息类至本地

`消息类型`: [消息类型](./chatroom/messages.md)

`下载地址消息类`: [chatroom-1.0.0.zip](https://fsprodrcx.cn.ronghub.com/wFVzR8BXcnQucXNHwFVzR9CHu5TAVQ4i/chatroom-1.0.0.zip)

`chatroom-1.0.0.zip` 目录一览表: 

```json
.
├── chatroom 消息类根目录
    └── android Android 消息类目录
      └── *.java 消息类文件
    └── ios iOS 消息类目录
      └── *.h iOS 声明类
      └── *.m iOS 实现类
    └── web Web 消息类目录
      └── *.js Web 消息类文件，支持 ADM、CMD 引入
```

#### 使用说明

> Android

1. 集成融云 Android IMKit SDK，使用方式请参考：[Android SDK 开发指南](http://www.rongcloud.cn/docs/android.html)

2. 下载需要使用的消息类型至本地工程合适位置，比如新建的 RcMessage 目录内

3. 无论发送方还是接收方，都要在调用融云 init 之后，注册下载的消息。如：

```java
RongIM.registerMessageType(ChatRoomGift.class);
```

`消息发送`，以 `ChatroomGift` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md):

```java
ChatroomGift giftMsg = new ChatroomGift();
giftMsg.setId("G208");
giftMsg.setNumber(1);
giftMsg.setTotal(5);
Message msg = Message.obtain("User_D", Conversation.ConversationType.CHATROOM, giftMsg);
RongIM.getInstance().sendMessage(msg, null, null, new IRongCallback.ISendMessageCallback() {
  @Override
  public void onAttached(Message message) {
  }
  
  @Override
  public void onSuccess(Message message) {
  }
  
  @Override
  public void onError(Message message, RongIMClient.ErrorCode errorCode) {
  }
});
```

`消息接收`，以 `ChatroomGift` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md):

```java
RongIM.setOnReceiveMessageListener(new RongIMClient.OnReceiveMessageListener() {
  @Override
  public boolean onReceived(Message message, int i) {
    MessageContent content = message.getContent();
    if (content instanceof ChatroomGift) {
        ChatroomGift chatroomGift = (ChatroomGift) content;
        // 处理逻辑...
    }
    return false;
  }
});
```

> iOS

1. 集成融云 iOS IMKit SDK，使用方式请参考：[iOS SDK 开发指南](http://www.rongcloud.cn/docs/ios.html)

2. 下载需要使用的消息类型至本地工程合适位置，比如新建的 RcMessage 目录内

3. 无论发送方还是接收方，都要在调用融云 init 之后，注册下载的消息。如：

```c
[[RCIM sharedRCIM] registerMessageType:[RCChatroomGift class]];
```

`消息发送`，以 `ChatroomGift` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md)::

```c
RCChatroomGift *giftMsg = [[RCChatroomGift alloc] init];
giftMsg.id = @"G208";
giftMsg.number = 1;
giftMsg.total = 5;
[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                        targetId:@"UserA"
                         content:giftMsg
                     pushContent:nil
                        pushData:nil
                         success:^(long messageId) {
                         } error:^(RCErrorCode nErrorCode, long messageId) {
      }];
```

`消息接收`，以 `ChatroomGift` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md)::

```c
// 设置 Delegate 类。
[[RCIM sharedRCIM] setReceiveMessageDelegate:self];
...
// 实现 onRCIMReceiveMessage 方法。
- (void)onRCIMReceiveMessage:(RCMessage *)message left:(int)left {
    if ([message.content isMemberOfClass:[RCChatroomGift class]]) {
        RCChatroomGift *msg = (RCChatroomGift *) message.content;
        // 处理逻辑...
    }
}
```

> Web

1、引入 WebSDK，使用方式请移步 [Web 开发指南](http://www.rongcloud.cn/docs/web.html)

2、引入 `chatroom/web/chatroom-messagetyps.js` 

3、设置消息类型

```js
var appkey = "8iuikmnaldk7m";
// 初始化 SDK
RongIMClient.init(appkey);

// 引入 `chatroom-messagetyps.js` 可获取命名空间 `RongMessageTypes`
var chatroomMessages = RongMessageTypes.chatroom;

// 设置消息类型
var im = RongIMClient.getInstance();
im.registerMessageTypes(chatroomMessages);

// 连接
var token = "183RX8CR4UcXlV3cANZXnbrkPG6U...";

// 详细请参考 http://www.rongcloud.cn/docs/web_api_demo.html#init_connect
var callback = {};
RongIMClient.connect(token, callback);

```

`接收消息`，以 `ChatroomGift` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md):

```js
// 消息监听器
RongIMClient.setOnReceiveMessageListener({
  // 接收到的消息
  onReceived: function (message) {
    switch(message.messageType){
      case RongIMClient.MessageType.ChatroomBarrage:
        // console.log(message);
      break;
    }
  }
});
```

`发送消息`，以 `ChatroomBarrage` 为例，更多消息类型请参考 [消息类型](./chatroom/messages.md)::

```js
var ChatroomBarrage = RongIMClient.ChatroomBarrage;

var content = "唱的太好听了，赞赞赞";

var msg = new ChatroomBarrage({ 
  content: content, 
  senderName: senderName,
  senderPortrait: senderPortrait 
});

var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
var im = RongIMClient.getInstance();
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
```

### 开源项目

[Android](https://github.com/rongcloud/demo-chatroom)、[iOS](https://github.com/rongcloud/demo-chatroom)
