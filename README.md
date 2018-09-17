### 上传文件说明

文件上传分 3 步 `获取上传凭证`、`获取文件唯一标识`、`获取文件 URL`

1、获取不同类型凭证(文件、图片)，即调用 `getFileToken`

2、文件服务器返回文件、图片唯一标识 `hash`

文件服务器返回示例:

```json
{
	"name": "test.txt",
	"size": 22335,
	"hash": "FsM0h43WLNj4LWHV5z19XerP04YC"
}
```

3、通过唯一标识 `hash` 获取文件、图片 URL ，即调用 `getFileUrl`

#### getFileToken(type, callbacks)

上传凭证，有效期从获取开始计算 1 小时后失效，详细用法可参考 [示例](https://github.com/rongcloud/rongcloud-web-im-upload/blob/master/qiniu/message.html) 

参数说明：

| 参数   	 		|	类型		| 必填	| 说明 							|
| :----------------	|:--------	|:-----	|:------------------------------|
| type		  		| number 	| 	是 	| RongIMLib.FileType.IMAGE: 获取图片凭证; RongIMLib.FileType.FILE: 获取文件凭证|
| callbakcs		  	| object 	| 	是 	| 两个回调函数 callbacks.onSuccess、callbacks.onError|

`callbacks.onSuccess(result)` 参数说明：

```json
{
    "token": "CddrKW5AbOMQaDRwc3ReDNvo3-sL_SO1iOiAkKGV0YWcpfSIsImRlYWRsaW5lIjoxNTIwMjUzNTQ3fQ=="
}
```

| 参数   	 |	类型		| 说明	
| :----------|:--------	|:-----	
|	token	 |	string	| 上传凭证

#### getFileUrl(type, hash, name, callbacks)

获取文件、图片地址

参数说明：

| 参数   	 		|	类型		| 必填	| 说明 							|
| :----------------	|:--------	|:-----	|:------------------------------|
| type		  		| number 	| 	是 	| RongIMLib.FileType.IMAGE: 获取图片 URL; RongIMLib.FileType.FILE: 获取文件 URL|
| hash		  		| string 	| 	是 	| 文件服务器返回的文件、图片唯一标识|
| name				| string 	| 	是 	| 下载文件、图片后的文件名称|
| callbakcs		  	| object 	| 	是 	| 两个回调函数 callbacks.onSuccess、callbacks.onError|

`callbacks.onSuccess(result)` 参数说明：

```json
{
	"downloadUrl": "http://rongcloud-file.ronghub.com/f3845848438623c995.txt?attname=test.txt&e=6K676aCD-PfwDIdrEbQ="
}
```

| 参数   	 |	类型		| 说明	
| :----------|:--------	|:-----	
| downloadUrl|	string	| 文件、图片的完整 URL

#### Upload

[上传插件](https://github.com/rongcloud/rongcloud-web-im-upload/tree/master/qiniu)

[完整示例](https://github.com/rongcloud/rongcloud-web-im-upload/blob/master/qiniu/message.html)


#### 获取历史消息说明

```js
// 向上获取历史消息
var conversationType = 1;
var targetId = 'targetId01';
// 获取历史消息的起始位置，0 从最近的历史消息开始获取
var timestamp = 1536315287170;
var count = 5;
RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestamp, count, {
	onSuccess: function(list, hasMore) {
		// list 顺序：按发送时间正序 
		// hasMore 是否还有更多消息
	},
	onError: function(error) {
		
	}
}, objectname, order);
```

```js
// 向下获取历史消息
var conversationType = 1;
var targetId = 'targetId01';
// 获取历史消息的起始位置，0 从最早的历史消息开始获取
var timestamp = 1536315287170;
var count = 5;
// 1: 向下获取; 0: 向上获取（默认）
var order = 1;
RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestamp, count, {
	onSuccess: function(list, hasMore) {
		// list 顺序：按发送时间正序 
		// hasMore 是否还有更多消息
	},
	onError: function(error) {
		
	}
}, "", order);
```