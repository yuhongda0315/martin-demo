# Web CallLib 开发指南

## 环境准备

**操作系统**

Windows: `Windows 7+`

Mac: `10.12.6+`

**浏览器**

Chrome: `Chrome 58+`

Safari `Safari 11+`

<span style="color: red"> 注意: 站点必须是 HTTPS 或使用本地使用 127.0.0.1 调试</span>

## 集成流程

1、开通音视频服务，请参考 [音视频开通指南](http://www.rongcloud.cn/docs/call.html#open)

2、引入 `Web SDK`，请参考 [Web 开发指南](http://www.rongcloud.cn/docs/web.html#sdk)

3、引入 Web CallLib ，请参考 [音视频示例](https://github.com/rongcloud/websdk-demo/tree/master/calllib/agora#calllib)

4、使用 `Web SDK` 连接融云服务器，可参考 [示例](https://github.com/rongcloud/websdk-demo/blob/master/calllib/init.js)

5、[发起音视频通话](https://github.com/rongcloud/websdk-demo/tree/master/calllib/agora#calllib)

## 通话流程

![](https://fsprodrcx.cn.ronghub.com/K-cEsSvlBYLGVASxK-cEsS2iDzMr5-RH/call.png)

>`User A` 与 `User B` 通话图解

1、`User A` 发起通话，向 `User B` 发送 `InviteMessage`

2、`User B` 开始响铃， 并向 `User A` 发送 `RingingMessage`，通知 `User A` 响铃

3、`User B` 发送 `AcceptMessage` 至 `User A` 建立通话

4、`User A` 与 `User B` 均可主动切换音频、视频通话

5、`User A` 与 `User B` 均可主动邀请人加入通话

6、`User A` 与 `User B` 均可主动邀请人加入通话

7、`User A` 与 `User B` 均可主动挂断通话

8、通话结束

## 消息类型

### InviteMessage{#invite-message}

>通话发起方，发送 `InviteMessage` 给接收方，发起方等待接通，接收方此时响铃、等待接听

ObjectName: `RC:VCInvite`

|属性名  		| 类型 			| 说明　							
|:--------------|:--------------|:------------------------------
| callId    	| string      	| 房间 Id  						
| engineType  	| number      	| [视频引擎](#engine-type) 	
| mediaType   	| number		| [通话类型](#call-type)
| inviteUserIds | array       	| 被邀请人 Id 列表		
| extra     	| string      	| 附加信息 		

### RingingMessage

>通话发起方发送 `InviteMessage` 后，会收到接收方 `RingingMessage`, 用来提示发起方响铃

ObjectName: `RC:VCRinging` 

|属性名  		| 类型 			| 说明　							
|:--------------|:--------------|:------------------------------
| callId    	| string      	| 房间 Id  						

### AcceptMessage

>接收方同意通话邀请，发送 `AcceptMessage` 

ObjectName: `RC:VCAccept` 

属性名  		| 类型   		| 说明
:-----------|:--------------|:---------
callId    	| string      	| 房间 Id
mediaType   | number		| [通话类型](#call-type)

### MemberModifyMessage

>音视频通话时邀请其他人加入通话，发送 `MemberModifyMessage`

ObjectName: `RC:VCModifyMem`

属性名  					| 类型   		| 说明
:-----------------------|:--------------|:---------
callId    				| string      	| 房间 Id
caller   				| string		| 邀请人
engineType 				| number		| [音视频引擎类型](#engine-type)
existedUserPofiles 		| array			| 通话内已存在的成员列表
inviteUserIds 			| array			| 被邀请人的列表
mediaType 				| number		| [通话类型](#call-type)

### MediaModifyMessage

>音视频通话切换需要发 `MediaModifyMessage` 告知通话中的其他成员

ObjectName: `RC:VCModifyMedia`

 属性名     | 类型           | 说明    
:----------|:--------------|:---------
callId     | string        | 发起人 Id
mediaType  | number		   | [通话类型](#call-type)

### SummaryMessage{#summary-message}

>通话结束后收到 `SummaryMessage` ，此时可根据消息属性显示通话结束后的小灰条消息

ObjectName: `RC:VCSummary`

属性名  		 | 类型   	   	| 说明
:------------|:-------------|:---------
caller    	 | string      	| 发起人   
inviter   	 | string      	| 被邀请人
mediaType    | number		| [通话类型](#call-type)
memberIdList | array        | 成员列表
startTime    | number       | 通话开始时间
duration     | number       | 通话时长(s)
status       | number	    | [通话状态](#Status)

## 枚举、对象

### 通话类型{#call-type}

`音频`: 1

`视频`: 2

### Status

发起方取消已发出的通话请求: `1`

发起方拒绝收到的通话请求: `2`

发起方挂断: `3`

发起方忙碌: `4`

发起方未接听: `5`

发起方不支持当前引擎: `6`

发起方网络出错: `7`

接收方取消已发出的通话请求: `11`

接收方拒绝收到的通话请求: `12`

通话过程接收方挂断: `13`

接收方忙碌: `14`

接收方未接听: `15`

接收方不支持当前引擎: `16`

接收方网络错误: `17`

## 分辨率说明{#resolution}

| 视频属性  		  | 分辨率（ 宽 x 高 ） |  帧率		  | 码率(Kbps)
|:--------------|:------------------|:----------|:----------
|240P			      |	320X240 		      | 	15		  |	200
|360P			      |	640X360 		      | 	15		  |	400
|480P			      |	640x480 		      | 	15		  |	500
|720P			      |	1280x720 		      | 	15		  |	1130


