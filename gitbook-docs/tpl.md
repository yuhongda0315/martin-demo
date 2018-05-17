

### ChatroomBarrage{#chatroombarrage}

聊天室弹幕消息，

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  content     |    string         |     弹幕内容
|  senderName     |    string         |     发送弹幕的用户名称
|  senderPortrait     |    string         |     发送弹幕的用户头像
### ChatroomGift{#chatroomgift}

可根据此类型消息发送各种礼物至聊天室

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     礼物编号
|  number     |    int         |     本次发送礼物数量
|  total     |    int         |     在本聊天室当前用户总共发送了多少个该中礼物
### ChatroomStart{#chatroomstart}

聊天开始前，发送倒计时通知

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  time     |    string         |     聊天时开始时间点的毫秒数
### ChatroomEnd{#chatroomend}

聊天结束后，发送结束通知

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  duration     |    int         |     本次直播持续时长，单位: 秒
### ChatroomWelcome{#chatroomwelcome}

欢迎用户进入聊天室

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
|  name     |    string         |     用户名称
|  portrait     |    string         |     用户头像
### ChatroomFollow{#chatroomfollow}

用户关注主播后，发送此消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
|  name     |    string         |     用户名称
|  portrait     |    string         |     用户头像
### ChatroomAddminAdd{#chatroomaddminadd}

用户被设置为管理时，发送此消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
|  name     |    string         |     用户名称
|  portrait     |    string         |     用户头像
### ChatroomAddminRemove{#chatroomaddminremove}

管理员被移除权限时，发送此消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     管理员 Id
|  name     |    string         |     管理员名称
|  portrait     |    string         |     管理员头像
### ChatroomUserBlock{#chatroomuserblock}

用户被封禁通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     被封禁的用户 Id
|  duration     |    int         |     封禁时长，单位: 秒
### ChatroomUserUnBlock{#chatroomuserunblock}

用户被解除封通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
### ChatroomUserQuit{#chatroomuserquit}

用户离开聊天室通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
### ChatroomUserBan{#chatroomuserban}

用户被禁言通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
### ChatroomUserUnBan{#chatroomuserunban}

用户被取消禁言通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  id     |    string         |     用户 Id
### ChatroomSummary{#chatroomsummary}

在线人数通知消息

| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  online     |    int         |     在线人数
### ChatroomLike{#chatroomlike}



| 属性           |   类型            | 描述
|:--------------|:------------------|:---------------
|  count     |    int         |     点赞的次数
