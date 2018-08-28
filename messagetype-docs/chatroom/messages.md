
### 消息类型

>发送渠道: 由 [App Server](http://rongcloud.github.io/server-sdk-nodejs/docs/v1/) 渠道发送的消息, [SDK](http://www.rongcloud.cn/docs/quick_start.html) 只接收, 不可发送

|    名称                                    |      标识             |     描述                  |  发送渠道                    | 消息库版本           
| :--------------------------------------- | :--------------------  |:--------------------  | :----------------------------|:--------------
| [ChatroomStart](#chatroomstart) | RC:Chatroom:Start  | 开播通知| App Server | 1.0.0
| [ChatroomEnd](#chatroomend) | RC:Chatroom:End   | 结束通知| App Server | 1.0.0
| [ChatroomSummary](#chatroomsummary) | RC:Chatroom:Summary  | 信息汇总| App Server | 1.0.0
| [ChatroomFollow](#chatroomfollow) | RC:Chatroom:Follow  | 关注主播| SDK | 1.0.0
| [ChatroomLike](#chatroomlike) | RC:Chatroom:Like  | 点赞| SDK | 1.0.0
| [ChatroomGift](#chatroomgift) | RC:Chatroom:Gift  | 礼物| SDK | 1.0.0
| [ChatroomBarrage](#chatroombarrage) | RC:Chatroom:Barrage  | 弹幕| SDK | 1.0.0
| [ChatroomWelcome](#chatroomwelcome) | RC:Chatroom:Welcome  | 欢迎用户进入聊天室| App Server | 1.0.0
| [ChatroomAdminAdd](#chatroomadminadd) | RC:Chatroom:Admin:Add  | 设为管理员权限通知| App Server | 1.0.0
| [ChatroomAdminRemove](#chatroomadminremove) | RC:Chatroom:Admin:Remove  | 移除管理员权限通知| App Server | 1.0.0
| [ChatroomUserBlock](#chatroomuserblock) | RC:Chatroom:User:Block  | 用户封禁| App Server | 1.0.0
| [ChatroomUserUnBlock](#chatroomuserunblock) | RC:Chatroom:User:UnBlock  | 用户解除封禁| App Server | 1.0.0
| [ChatroomUserBan](#chatroomuserban) | RC:Chatroom:User:Ban  | 用户禁言| App Server | 1.0.0
| [ChatroomUserUnBan](#chatroomuserunban) | RC:Chatroom:User:UnBan  | 解除用户禁言| App Server | 1.0.0
| [ChatroomUserQuit](#chatroomuserquit) | RC:Chatroom:User:Quit  | 用户退出聊天室| SDK | 1.0.0



### ChatroomStart{#chatroomstart}

聊天室创建完成后，主播可通过此消息在聊天室中发送具体的视频开播时间

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  time     |    string         |     开播时间，UNIX 时间戳| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomStart message = new ChatroomStart();
message.setTime("1525415951135");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomStart *message = [[RCChatroomStart alloc] init];
message.time = @"1525415951135";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomStart = RongIMClient.RegisterMessage.ChatroomStart;

var msg = new ChatroomStart({ 
  time: "1525415951135",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomEnd{#chatroomend}

视频直接结束时通过发送此消息告诉聊天室中成员，结束本次直播

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  duration     |    int         |     本次直播持续时长，单位: 分钟| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomEnd message = new ChatroomEnd();
message.setDuration(60);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomEnd *message = [[RCChatroomEnd alloc] init];
message.duration = 60;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomEnd = RongIMClient.RegisterMessage.ChatroomEnd;

var msg = new ChatroomEnd({ 
  duration:60,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomSummary{#chatroomsummary}

聊天室信息汇总，新用户加入聊天室后，用于同步聊天室中其他成员，当前聊天室的实时人数, [App App Server](http://rongcloud.github.io/App server-sdk-nodejs/docs/v1/) 发送此消息, 包含聊天室中的总人数, 此消息需要按一定频率发送, 例如: 每 2 秒发送一条

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  online     |    int         |     实时人数, 获取方式可参考获取 [聊天室信息](http://rongcloud.github.io/server-sdk-nodejs/docs/v1/chatroom/chatroom.html#get) 方法| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomSummary message = new ChatroomSummary();
message.setOnline(800);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomSummary *message = [[RCChatroomSummary alloc] init];
message.online = 800;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomSummary = RongIMClient.RegisterMessage.ChatroomSummary;

var msg = new ChatroomSummary({ 
  online:800,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomFollow{#chatroomfollow}

用户关注主播后，发送此消息，可用于在聊天室中展示某成员关注了主播

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  rank     |    int         |     应用内的用户等级| 1.0.0
|  level     |    int         |     用户在当前聊天室的级别| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomFollow message = new ChatroomFollow();
message.setId("u2018");
message.setRank(1);
message.setLevel(3);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomFollow *message = [[RCChatroomFollow alloc] init];
message.id = @"u2018";
message.rank = 1;
message.level = 3;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomFollow = RongIMClient.RegisterMessage.ChatroomFollow;

var msg = new ChatroomFollow({ 
  id: "u2018",
  rank:1,
  level:3,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomLike{#chatroomlike}

点赞消息，聊天室成员对主播点赞时发送此消息，鉴于有些用户会连续点击，建议做消息合并机制处理。

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  counts     |    int         |     累计点赞次数| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomLike message = new ChatroomLike();
message.setCounts(5);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomLike *message = [[RCChatroomLike alloc] init];
message.counts = 5;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomLike = RongIMClient.RegisterMessage.ChatroomLike;

var msg = new ChatroomLike({ 
  counts:5,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomGift{#chatroomgift}

发送各种礼物至聊天室，成员给主播发送礼物时使用此消息，通过此消息可实现发送、接收的各种礼物及发送礼物排行等功能。

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     礼物编号| 1.0.0
|  number     |    int         |     本次发送礼物数量| 1.0.0
|  total     |    int         |     在本聊天室当前用户总共发送了多少个该中礼物| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomGift message = new ChatroomGift();
message.setId("G008");
message.setNumber(530);
message.setTotal(900);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomGift *message = [[RCChatroomGift alloc] init];
message.id = @"G008";
message.number = 530;
message.total = 900;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomGift = RongIMClient.RegisterMessage.ChatroomGift;

var msg = new ChatroomGift({ 
  id: "G008",
  number:530,
  total:900,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomBarrage{#chatroombarrage}

聊天室弹幕消息，聊天室中需要进行特殊展示的消息，聊天室中成员收到此消息后根据自已的弹幕规则进行展示

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  type     |    int         |     弹幕规则| 1.0.0
|  content     |    string         |     弹幕内容| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomBarrage message = new ChatroomBarrage();
message.setType(D201801);
message.setContent("hellowrold");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomBarrage *message = [[RCChatroomBarrage alloc] init];
message.type = D201801;
message.content = @"hellowrold";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomBarrage = RongIMClient.RegisterMessage.ChatroomBarrage;

var msg = new ChatroomBarrage({ 
  type:D201801,
  content: "hellowrold",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomWelcome{#chatroomwelcome}

欢迎用户进入聊天室，新成员加入聊天室后可发送此条消息

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  counts     |    int         |     当前用户观看当前主播的次数| 1.0.0
|  rank     |    int         |     应用内的用户等级| 1.0.0
|  level     |    int         |     用户在当前聊天室的级别| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomWelcome message = new ChatroomWelcome();
message.setId("u2018");
message.setCounts(10);
message.setRank(3);
message.setLevel(1);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomWelcome *message = [[RCChatroomWelcome alloc] init];
message.id = @"u2018";
message.counts = 10;
message.rank = 3;
message.level = 1;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomWelcome = RongIMClient.RegisterMessage.ChatroomWelcome;

var msg = new ChatroomWelcome({ 
  id: "u2018",
  counts:10,
  rank:3,
  level:1,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomAdminAdd{#chatroomadminadd}

用户被设置为管理员时，发送此消息通知其他聊天室成员

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  counts     |    int         |     当前用户观看当前主播的次数| 1.0.0
|  level     |    int         |     用户在当前聊天室的级别| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomAdminAdd message = new ChatroomAdminAdd();
message.setId("u2018");
message.setCounts(10);
message.setLevel(1);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomAdminAdd *message = [[RCChatroomAdminAdd alloc] init];
message.id = @"u2018";
message.counts = 10;
message.level = 1;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomAdminAdd = RongIMClient.RegisterMessage.ChatroomAdminAdd;

var msg = new ChatroomAdminAdd({ 
  id: "u2018",
  counts:10,
  level:1,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomAdminRemove{#chatroomadminremove}

管理员被移除权限时，发送此消息通知其他聊天室成员

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     管理员 Id| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomAdminRemove message = new ChatroomAdminRemove();
message.setId("u2018");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomAdminRemove *message = [[RCChatroomAdminRemove alloc] init];
message.id = @"u2018";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomAdminRemove = RongIMClient.RegisterMessage.ChatroomAdminRemove;

var msg = new ChatroomAdminRemove({ 
  id: "u2018",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomUserBlock{#chatroomuserblock}

用户被封禁通知，当前用户被提出聊天室，指定时间内无法加入当前聊天室

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     被封禁的用户 Id| 1.0.0
|  duration     |    int         |     封禁时长，单位: 分钟| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomUserBlock message = new ChatroomUserBlock();
message.setId("u2018");
message.setDuration(60);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomUserBlock *message = [[RCChatroomUserBlock alloc] init];
message.id = @"u2018";
message.duration = 60;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomUserBlock = RongIMClient.RegisterMessage.ChatroomUserBlock;

var msg = new ChatroomUserBlock({ 
  id: "u2018",
  duration:60,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomUserUnBlock{#chatroomuserunblock}

用户被解除封通知消息

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomUserUnBlock message = new ChatroomUserUnBlock();
message.setId("u2018");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomUserUnBlock *message = [[RCChatroomUserUnBlock alloc] init];
message.id = @"u2018";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomUserUnBlock = RongIMClient.RegisterMessage.ChatroomUserUnBlock;

var msg = new ChatroomUserUnBlock({ 
  id: "u2018",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomUserBan{#chatroomuserban}

用户被禁言通知消息，用于通知聊天室中成员用户该用户被禁言，不能发送消息

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  duration     |    int         |     被禁言时长，单位: 分钟| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomUserBan message = new ChatroomUserBan();
message.setId("u2018");
message.setDuration(60);
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomUserBan *message = [[RCChatroomUserBan alloc] init];
message.id = @"u2018";
message.duration = 60;
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomUserBan = RongIMClient.RegisterMessage.ChatroomUserBan;

var msg = new ChatroomUserBan({ 
  id: "u2018",
  duration:60,
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomUserUnBan{#chatroomuserunban}

用户被取消禁言通知消息，用于通知用户现在可以发送聊天室消息

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomUserUnBan message = new ChatroomUserUnBan();
message.setId("u2018");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomUserUnBan *message = [[RCChatroomUserUnBan alloc] init];
message.id = @"u2018";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomUserUnBan = RongIMClient.RegisterMessage.ChatroomUserUnBan;

var msg = new ChatroomUserUnBan({ 
  id: "u2018",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

### ChatroomUserQuit{#chatroomuserquit}

用户离开聊天室通知消息，退出聊天室时可发送此消息，用于通知聊天室中其他成员

| 属性           |   类型            | 描述           | 消息库版本    
|:--------------|:------------------|:---------------|:-------------
|  id     |    string         |     用户 Id| 1.0.0
|  extra     |    string         |     附加信息| 1.0.0

**示例**

{% codetabs name="Android", type="java" -%}
// 消息发送示例
ChatroomUserQuit message = new ChatroomUserQuit();
message.setId("u2018");
message.setExtra("附加信息");
Message msg = Message.obtain("chrm2018", Conversation.ConversationType.CHATROOM, message);
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
{%- language name="iOS", type="c" -%}
// 消息发送示例
RCChatroomUserQuit *message = [[RCChatroomUserQuit alloc] init];
message.id = @"u2018";
message.extra = @"附加信息";

[[RCIM sharedRCIM] sendMessage:ConversationType_CHATROOM
                  targetId:@"chrm2018"
                   content:message
               pushContent:nil
                  pushData:nil
                   success:^(long messageId) {
                   } error:^(RCErrorCode nErrorCode, long messageId) {
}];
{%- language name="Web", type="js" -%}
//消息发送示例
var ChatroomUserQuit = RongIMClient.RegisterMessage.ChatroomUserQuit;

var msg = new ChatroomUserQuit({ 
  id: "u2018",
  extra: "附加信息"
});

var im = RongIMClient.getInstance();
var chatroomType = RongIMLib.ConversationType.CHATROOM;
var chatroomId = "chrm2018";
im.sendMessage(chatroomType, chatroomId, msg, {
  onSuccess: function(message) {
    console.log(message);
  },
  onError: function(error) {
    console.log(error);
  }
});
{%- endcodetabs %}

