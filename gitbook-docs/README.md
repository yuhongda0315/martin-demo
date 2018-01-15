#### GitBook

GitBook 是一个基于 Node.js 的命令行工具，可使用 Github/Git 和 Markdown 来制作精美的电子书。

支持输出以下几种文档格式:

* 静态站点：GitBook 默认输出该种格式

* PDF：需要安装 gitbook-pdf 依赖

* eBook：需要安装 ebook-convert

#### Markdown

有关教程，请移步 [Markdown](http://wowubuntu.com/markdown/)


RC:VCInvite: InviteMessage
RC:VCRinging: RingingMessage
RC:VCAccept: AcceptMessage
RC:VCHangup: HungupMessage
RC:VCModifyMedia: MediaModifyMessage
RC:VCModifyMem: MemberModifyMessage

http://rongcloud.cn/docs/web_calllib.html#InviteMessage


### InviteMessage

收到通话邀请会收到 `InviteMessage` 类型消息，此时可进行已方响铃，显示接听、挂断按钮等。

属性名  | 类型   | 说明　| 备注
:------|:------|:---------
callId    | string      | 房间 Id  |  string 类型而非 number 类型
engineType  | number      | 引擎类型，默认使用 1 | 暂未用到，可忽略
channelInfo | ChannelInfo   | [Channel 对象](#ChannelInfo) |
mediaType   | VoIPMediaType   | [通话类型](http://rongcloud.cn/docs/web_calllib.html#media) |
inviteUserIds | array       | 被邀请人列表 | 目前仅支持 **一对一**
extra     | string      | 附加信息 | 用于消息的扩展

### SummaryMessage

主叫或被叫终止通话后都会收到 `SummaryMessage` 类型消息，此时可根据消息属性显示通话结束后的小灰条消息（通话时长等）。

属性名  | 类型   | 说明
:------|:------|:---------
caller    | string      | 发起人   
inviter   | string      | 被邀请人
mediaType   | VoIPMediaType   | [通话类型](http://rongcloud.cn/docs/web_calllib.html#media)
memberIdList  | array         | 成员列表
startTime   | number      | 通话开始时间
duration    | number      | 通话时长(s)
status        | ErrorCode     | [通话状态](http://rongcloud.cn/docs/web_calllib.html#Status)

### RingingMessage

主叫发起通话邀请成功后会收到 `RingingMessage` 类型消息，此时可进行响铃（等待被叫接听铃声）。

属性名   | 类型  | 说明
:------|:------|:---------
callId | string     | 发起人 Id

### AcceptMessage--accept_message--

主叫发送通话邀请，被叫接听后会收到 `AcceptMessage` 类型消息，此时可以进行关闭响铃、隐藏、显示操作按钮等。

属性名  | 类型   | 说明
:------|:------|:---------
callId    | string      | 发起人 Id
mediaType   | VoIPMediaType   | [通话类型](http://rongcloud.cn/docs/web_calllib.html#media)

### HungupMessage

对方挂断后会收到 `HungupMessage`

 属性名     | 类型           | 说明    
:----------|:--------------|:---------
callId     | string        | 发起人 Id
reason  | number | [挂断原因](http://rongcloud.cn/docs/web_calllib.html#Status)












