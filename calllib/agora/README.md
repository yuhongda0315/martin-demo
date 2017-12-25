### Rong CallLib API 说明

### Demo

使用下面的 URL 可体验 VoIP，App(SealTalk 大乔) 登录使用手机号登录，可以进行多端互通。

#### 一对一


|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | xNlpDTUmw | 13269772769/admin123.|https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html
|B          | b5NwvIrW8 | 18310485134/123456   |https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html?peer

#### 多人

|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | xNlpDTUmw | 13269772769/admin123.| https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html
|B          | b5NwvIrW8 | 18310485134/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer1
|C          | JFTfwU5Zc | 13810123257/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer2

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