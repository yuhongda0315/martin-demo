# 上传插件使用说明 - 七牛云

## 初始化

使用七牛云存储文件必须设置 `multi_params` 对象中的 token 属性，某则将上传失败。

```
 var config = {
	 	domain			: '',											// default : '' ,必须设置文件服务器地址。
	  	file_data_name	: 'file',										// default : file , 文件对象的 key 。
	 	base64_size		: 10,											// default : 10 单位 MB 。
		chunk_size		: 10,											// default : 10 单位 MB 。
		headers			: { Content-Type : 'multipart/form-data'},		// default : { Content-Type : 'multipart/form-data'} ,增加 requestHeader 需扩展。 
	  	multi_parmas	: { },											// default : {} 扩展上传属性 。
	  	query			: { },											// default : {}	扩展 url 参数 e.g. http://rongcloud.cn?name=zhangsan 。
	  	support_options : true,											// default : true, 文件服务器不支持 OPTIONS 请求需设置为 false。
		data 			: dataType.form 								// default : dataType.form 默认提供：form、json、data 数据直传三种方式。

  	};
```

## 上传文件

上传文件必须设置回调函数，用以接收上传信息。

`fileUpload.upload(data, callback);`  data 值可以是 base64 或 file 对象。

token 获取方式请参考七牛云文档说明。

```
var config = { 
	domain: 'http://upload.qiniu.com',
 	multi_parmas : {
 		token : "livk5rb3__JZjCtEi....."
 	}
 };

var callback = {
		onError	: function () { 
			// 上传失败。
		},
		onProgress : function (loaded, total) {
			// 处理进度条。
		},
		onCompleted : function (data) { 
			// data : 上传成功，文件服务器响应值。
		} 
 };

var fileUpload = UploadFile.init(config);
var file = document.getElementById("file-Id");
file.onchange = function(){
	fileUpload.upload(this.files[0], callback);
};

```