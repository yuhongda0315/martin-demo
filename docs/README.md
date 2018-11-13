### Introduction{#introduction}

Due to different underlying engine technologies, the SDK will not be able to communicate with the real-time audio and video of the previous SDK version starting from 3.0.0. 
In order to facilitate the developers and save development resources, RongCloud provides audio and video call Demo source codeon Github and please feel free to download and experience it.

### Open RTC Service{#open-rtc-services}

Audio and video services are opened; please refer to the audio and video opening method description.

### Network{#network}

Real-time audio and video has the following network bandwidth requirements:

`Bandwidth`: In order to get high video quality and smoothness, resolution and bandwidth of each video channel are in the 

following corresponding relation:

>288P: 350kbps

>480P: 500kbps

>720P: 1000kbps

`Delay`: In order to assure that audio and video is real-time, RTT from client to media server is advised to be lower than 150 ms

`Packet loss`: 30% of random package loss can be resisted at the media level

### Browser{#browser}

Browser: Chrome 57.0.2978.110+

### HTTP{#http}

Due to the requirements of the browser, the web version can be subject to the encrypted HTTPS protocol at present 

### Version{#version}

** Latest version: **

```js
<script src="http(s)://cdn.ronghub.com/RongCallLib-3.0.1.min.js"></script>
```

** Historical version: **

```js
<script src="http(s)://cdn.ronghub.com/RongCallLib-3.0.0.min.js"></script>
```

### CallLib Process{#call-process}

>1. A initiates an audio/video request to B

>2. B receives audio and video InviteMessage

>3. A receives the RingingMessage

>4. B accept audio and video request accept

>5. A receives B's Accept Message for audio and video invite AcceptMessage

>6. Successfully establish an audio and video call

### Integration{#integration}

>1. Introduction of Web SDK is detailed in the Web SDK Development Guide 

>2. Introduce the Web CallLib SDK, download the file to the project, and modify the relative path of src

>3. Initialize Web SDK and connect to the server, as detailed in the SDK Development Guide

>4. Set parameters

>5. Initialize CallLib SDK

>6. Registered video nodes monitoring and video streams monitoring, which will be triggered when users join or leave.

>7. Register command monitoring

>8. Initiate a call request

>9. The call request is attended and the entire call is established


### Setting Parameter{#setting-parameter}

Resolution(W * H)| Frame Rate　| Code Rate(Min)| Code Rate(Max)
:----------------|:------------|:-------------|:---------
320*240          | 15          |  50          |  300     
640*480 (default)| 15(default) |  50(default) |  600(default)    
1280*720         | 15          |  50          |  2000    


### Initialize CallLib{#init-calllib}

```js
var rongCallLib = RongCallLib.init(config)
```

### Register Video Monitor{#register-video}

Which will be triggered when someone joins or leaves

```js
var watcher = function(result){
  // result => {type: 'added', data: ''}
};
RongCallLib.videoWatch(watcher);
```

### Register Command Monitor{#register-command}

```js
RongCallLib.commandWatch(function(command) {
  // command => message command;
});
```

### Setting Resolution{#setting-resolution}

```js
// 20: 480P、40: 480P、50: 720P
var profile = 20;
RongCallLib.setVideoProfile(profile)
```

### Call{#call}

```js
var CallType = RongIMLib.VoIPMediaType;
var params = {
    //  ConversationType, please refer: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
    conversationType: conversationType,
    // Conversation Target Id， group Id or userId
    targetId: targetId,
    // The invitee Id, fill in multiple userIds for multi-person video, with one-to-one and targetId values consistent
    inviteUserIds: inviteUserIds,
    // CallType CallType.MEDIA_VEDIO or CallType.MEDIA_AUDIO
    mediaType: CallType.MEDIA_VEDIO
};
RongCallLib.call(params, function(error){
    // do something...
});

```

### Accept{#accept}

```js
var params = {
  conversationType: conversationType,
  targetId: targetId,
  mediaType: mediaType
};
RongCallLib.accept(params);
```

### Invite{#invite}

```js
var CallType = RongIMLib.VoIPMediaType;

var params = {
  // ConversationType, please refer: http://rongcloud.cn/docs/web_api_demo.html#conversation_type
  conversationType: conversationType,
  // Conversation Target Id， group Id or userId
  targetId: targetId,
  // The invitee Id, fill in multiple userIds for multi-person video, with one-to-one and targetId values consistent
  inviteUserIds: inviteUserIds,
  // CallType CallType.MEDIA_VEDIO or CallType.MEDIA_AUDIO
  mediaType: CallType.MEDIA_VEDIO
};
RongCallLib.invite(params, function(error){
    // do something...
});

```

### Hangup{#hungup}

```js
var params = {
  conversationType: conversationType,
  targetId: targetId,
};
RongCallLib.hungup(params, function(error, summary) {
  console.log(summary);
});
```

### Reject{#reject}

```js
var params = {
  conversationType: conversationType,
  targetId: targetId,
};
RongCallLib.reject(params);
```

### Mute{#mute}

```js
RongCallLib.mute();
```

### Unmute{#unmute}

```js
RongCallLib.unmute();
```

### Video To Audio{#video2audio}

```js
RongCallLib.videoToAudio();
```

### Audio To Video{#audio2video}

```js
RongCallLib.audioToVideo();
```

### Start Screen Share{#start-screen-share}

`Note`: `The screen sharing function can be used only after the screen sharing plug-in is installed in the browser` 

Plug-in instructions:

After downloading the plug-in, you need to upload it to your own application server and 

provide the download address for the application, because you need to configure the domain name in 

the matches object of manifest.json of the plug-in. Examples of configurations are as follows:

```json
"content_scripts": [ {
   "matches": [
	   "http://localhost:*/*",
	   "https://rtc.ronghub.com/*"
		 ]
}],
```

```js
RongCallLib.startScreenShare();
```

### Stop Screen Share{#stop-screen-share}

```js
RongCallLib.stopScreenShare();
```

### Whiteboard{#whiteboard}

```js
RongCallLib.requestWhiteBoardURL();
```

### InviteMessage{#invitemessage}

Name         | Type         | Description
:------------|:-------------|:--------------------
callId       | String       | Room Id
engineType   | Number       | Engine type, use 3 by default 
channelInfo  | ChannelInfo  | Channel object
mediaType    | VoIPMediaType| Call Type
inviteUserIds| Array        | List of invitee ids
messageName  | String       | message name

### HungupMessage{#hungupmessage}

Name        | Type          | Description
:-----------|:--------------|:---------
caller      | String        | caller   
messagName  | String        | HungupMessage
reason      | Number        | [Hungup reason](#reason)

### RingingMessage{#ringingmessage}

Name        | Type          | Description
:-----------|:--------------|:---------
callId      | String        | room id
messageName | RingingMessage| message name

### AcceptMessage{#acceptmessage}

Name        | Type         | Description
:-----------|:-------------|:---------
callId      | String       | room id
mediaType   | VoIPMediaType| call type, video or audio
messageName | AcceptMessage| message name

### Reason{#reason}

Reason                    | Code     | Description
:-------------------------|:---------|:--------------
CANCEL1                   |  1       | We cancel the call request that has been sent out 
REJECT2                   |  2       | We refuse to answer the received call
HANGUP 3                  |  3       | We hang up
BUSYLINE4                 |  4       | We are busy
NO_RESPONSE5              |  5       | We did not answer
ENGINE_UN_SUPPORTED6      |  6       | We do not support the current engine
NETWORK_ERROR7            |  7       | There was an error in our own network
OTHER_CLIENT_HANDLED8     |  8       | Other devices have been processed 
REMOTE_CANCEL11           |  11      | The other party cancels the call request that has been sent out
REMOTE_REJECT             |  12      | The other party refuses to answer the call
REMOTE_HANGUP             |  13      | During the call, the other party hangs up
REMOTE_BUSYLINE           |  14      | The other party is busy
REMOTE_NO_RESPONSE        |  15      | The other party did not answer
REMOTE_ENGINE_UN_SUPPORTED|  16      | The other party does not support the current engine
REMOTE_NETWORK_ERROR      |  17      | The other party's network error
VOIP_NOT_AVALIABLE        |  18      | CallLib is not available

