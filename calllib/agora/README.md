### Rong CallLib API 说明

测试环境： SealTalk 大乔

### Demo

使用下面的 URL 可体验 VoIP。

#### 一对一


|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | J7XqKPint | 18601253544/123456   |https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html
|B          | rOMJ1vQVd | 18601031141/123456  |https://yuhongda0315.github.io/martin-demo/calllib/agora/private.html?peer
 
#### 多人

|用户       | UserId    | App                  |Web   
|:---------:|:----------|:-------------------- |:-------------------------------------------------
|A          | J7XqKPint | 18601253544/123456    | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html
|B          | rOMJ1vQVd | 18601031141/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer1
|C          | lofnCGIpR | 18519191750/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer2
|D          | cKexnBbWT | 18333109849/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer3
|E          | 3ZOMNA50t | 18612019709/123456   | https://yuhongda0315.github.io/martin-demo/calllib/agora/group.html?peer4

GroupId: 4x0y2olLJ

A Token: R4wO7nhIu1PEHMuwJufJgqE4ovwvabHEXU8xDrUJSvE2yj0t4ZY9RMgg4P5lS3fb5QdTw7QSCTYSNWDRevdakZlOiOLkcV/v

B Token: hu+ujXgW/AKdJHEq5xaoXKE4ovwvabHEXU8xDrUJSvE2yj0t4ZY9RAaO6fk/lPWwalltMGlZQuhrtoh7nVyROu5Wb0m01Avs

C Token: 6YRWv2BZR5MH2c2UuCGSfaE4ovwvabHEXU8xDrUJSvE2yj0t4ZY9RJqBw8clze/6nYmFLf1Cjky0cVytDuTcBmEZVNzxGcw3

D Token: EDrtVj7bNw3JjWfmuNGHu3xpRjANxKgfakOnYLFljI+kKqBAlKZ/SN2b2MI5OUNuF3u5BURU8tLv8Y/8BgG1Fg==

E Token: /+/UsgroH8XDNi3JJkAIk6+YsUIoF3ojin3K277sfOmMDgLI9ROp5oKwwQ8F44g8kTWnvr45QJC8XcutUrFjBqtdpZUyLdaH

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