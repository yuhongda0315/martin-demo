### Rong CallLib API 说明

测试环境： SealTalk 大乔

### Demo

使用下面的 URL 可体验 VoIP。

#### 一对一


|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | nSH63LJ3B5sGXHeaHXnZ5Y | 13426250042/123456   |https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html
|B          | XD3ke8sUKaRHWU5hfvbLmn | 18601253544/123456q  |https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html?peer
 
#### 多人

|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | nSH63LJ3B5sGXHeaHXnZ5Y | 13426250042/123456    | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html
|B          | XD3ke8sUKaRHWU5hfvbLmn | 18601253544/123456q   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer1
|C          | Mkt5fei2RfKJZZmURkDp8Z | 15910946839/123456q   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer2

GroupId: KoEGFGQj8kAYkij84MkEsj

A Token: ZQ9MNlyAxcU1hNX1cFnLSbdo0HEjrdNpsoJjvzzRSyGB1946LlrOg56BoVSv79cn+HbC4kdlHSj86afSYMK1XxrJRt5N53FjeMBnCQVdHB6h7RZ9QvQEbg==

B Token: FNj6usREH9k77Qidicx+F7do0HEjrdNpsoJjvzzRSyFMcCusI5n/EcntbKCxkrOCTLZr0050b8cGqp5CKNxUkqIKd2tawevq6DfbkbpjQuU9BG9hQtX3uA==

C Token: nGiNKIEUzBqkF4F2mMeLeeQT2n65B7OjBiykm8VlpZXvWVFnsDdS63nR83tK61OzAp0bL/u6I2SPXm1gcGJ69nX/TStlaS6vLNTVLyKL11jHJzD+50w9Rw==

### API

    
#### videoWatch

方法： `RongCallLib.videoWatch(watcher);` 。

描述： 监控视频流，当有人加入、离开会触发此监听。
   
示例：

```js
var watcher = function(result){
    // result => {type: 'added', data: ''}
};

RongCallLib.videoWatch(watcher);
```
    
#### commandWatch

方法： `RongCallLib.commandWatch(watcher);` 。

描述： 接收指令，根据指令操作 UI，按钮、浮层等等。
   
示例：

```js
RongCallLib.commandWatch(function(command){
    // command => 消息指令
});

```
#### call

方法： `RongCallLib.call(params, callback);` 。

描述： 发起音视频通话。
   
示例：

```js
var CallType = RongIMLib.VoIPMediaType;

var params = {
    // 会话类型，请参考: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
    conversationType: conversationType,
    // 会话目标 Id，群 Id 或者 userId。 
    targetId: targetId,
    // 被邀请人 Id , 多人视频填写多个 userId, 一对一和 targetId 值一致。
    inviteUserIds: inviteUserIds,
    // 音频类型
    // CallType.MEDIA_VEDIO
    // CallType.MEDIA_AUDIO
    mediaType: CallType.MEDIA_VEDIO
};
RongCallLib.call(params, function(error){
    // do something...
});
```
#### hungup

方法： `RongCallLib.hungup(params, callback);` 。

描述： 挂断音视频通话。
   
示例：

```js
var params = {
    // 会话类型，请参考: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
    conversationType: conversationType,
    // 会话目标 Id，群 Id 或者 userId。 
    targetId: targetId,   
};
RongCallLib.hungup(params, function(error, summary){
    // summary => 音视频通话汇总信息
});
```
#### reject

方法： `RongCallLib.reject(params);` 。

描述： 收到请求音视频指令，拒绝通话。
   
示例：

```js
var params = {
    // 会话类型，请参考: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
    conversationType: conversationType,
    // 会话目标 Id，群 Id 或者 userId。 
    targetId: targetId
};
RongCallLib.reject(params);
```

#### mute

方法： `RongCallLib.mute();` 。

描述： 关闭麦克风

示例：

```js
RongCallLib.mute();
```

#### unmute

方法： `RongCallLib.unmute();` 。

描述： 打开麦克风
   
示例：

```js
RongCallLib.unmute();
```

#### videoToAudio

方法： `RongCallLib.videoToAudio;` 。

描述： 视频转音频
   
示例：

```js
RongCallLib.videoToAudio();
```

#### audioToVideo

方法： `RongCallLib.audioToVideo();` 。

描述： 音频转视频

示例：

```js
RongCallLib.audioToVideo();
```

#### accept

方法： `RongCallLib.accept();` 。

描述：
   

示例：

```js
var CallType = RongIMLib.VoIPMediaType;

var params = {
    // 会话类型，请参考: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
    conversationType: conversationType,
    // 会话目标 Id，群 Id 或者 userId。 
    targetId: targetId,
    // 音频类型
    // CallType.MEDIA_VEDIO
    // CallType.MEDIA_AUDIO
    mediaType: CallType.MEDIA_VEDIO
};
RongCallLib.accept(params);
```