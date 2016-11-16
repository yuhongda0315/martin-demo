(function(win){

	function mergeOption(opts){
		var options = {
		 	domain			: '',	
		 	method			: 'POST',										
		  	file_data_name	: 'file',										
		 	base64_size		: 10 * 1024,											
			chunk_size		: 10 * 1024,											
			headers			: { },		
		  	multi_parmas	: { },											
		  	query			: { },											
		  	support_options : true,											
		  	use_nodeupload	: false,
		  	useFormData		: true,
		  	use_key_value	: true,
		  	up_chunk_type 	: 1 ,
		  	up_process		: {} 										
	  	};
	   if (!opts.domain) {
	   		throw new Error('doman is null');
	   }
	   for(var key in opts){
	   		options[key] = opts[key];
	   }
	   return options;
	}

	function mEach(m, callback){
		for(var key in m){
			callback(key, m[key]);
		}
	}

	function uploadCosChunkData(data, callback, options){

	}

	function uploadQiniuChunkData(){

	}

	function uploadData (data, options){
		// TODO 兼容
		var xhr = new XMLHttpRequest();
		if (xhr.upload && options.support_options) {
			xhr.upload.onprogress = function (event) {
				UploadFile.listeners.onProgress(options.fileUId, event.loaded, event.total, Math.floor(event.loaded / event.total * 100) );
			};
		}
		
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				// 200 | 202
	            if (xhr.status == 200) {
	           	 	if (xhr.responseText) {
	           	 		UploadFile.listeners.onCompleted(options.fileUId, JSON.parse(xhr.responseText));
	           	 	}else{
	           	 		UploadFile.listeners.onError(options.fileUId, UploadFile.ErrorCode.POST_DATA_ERROR);
	           	 	}
	            }
	       }
		};

		var url = options.domain;
		mEach(options.query, function(key, value){
			if (url.indexOf('?') == -1){
				 url += '?' + key + '=' + encodeURIComponent(value);
			} else {
				 url += '&' + key + '=' + encodeURIComponent(value)
			}
			
		});

		xhr.open(options.method, options.domain, true);

		mEach(options.headers, function(key, value){
			xhr.setRequestHeader(key, value);
		});

		xhr.send(data);
	}


	function UploadFile(options, fileData, isBase64){
		var processDataChunk, processData;
		switch (options.up_chunk_type) {
			case 0 :
				processDataChunk = options.up_process.chunkName;
				processData = options.up_process.name;
			break;
			case 1 :
				processDataChunk = uploadCosChunkData;
				processData = uploadData;
			break;
			case 2 :
				processDataChunk = uploadQiniuChunkData;
				processData = uploadData;
			break;
		}

		if (!isBase64 && options.chunk_size > fileData.size) {

			if (options.use_nodeupload) {
				// UploadFile.uploadChunkDataByNode(fileData, function(options, loaded, total, resData){

				// 	if (loaded == total) {
				// 			UploadFile.listeners.onCompleted(options.fileUId, resData);
				// 	} else {
				// 		UploadFile.listeners.onProgress(options.fileUId, loaded, total, Math.floor(loaded / total * 100));
				// 	}

				// }, options);
			
			} else {

				processDataChunk(fileData, function(options, loaded, total, resData){

					if (loaded == total) {
							UploadFile.listeners.onCompleted(options.fileUId, resData);
					} else {
						UploadFile.listeners.onProgress(options.fileUId, loaded, total, Math.floor(loaded / total * 100));
					}

				}, options);
			}
			

		} else {

			if (options.use_nodeupload) {
				// TODO 参数设置、回调、进度条等
				//UploadFile.uploadDataByNode();

			} else {
				if (options.useFormData && !isBase64) {

					var formData = new FormData();
					formData.append(options.file_data_name, fileData);
					mEach(options.multi_parmas, function(key, value){
						formData.append(key, value);
					});
					
					uploadData(formData, options);

				} else if(isBase64) {
					
					if (options.use_key_value) {

						var data = {};
						data[options.file_data_name] = encodeURIComponent(fileData);
						mEach(options.multi_parmas, function(key, value){
							data[key] = value;
						});
						// TODO JOSN.stringify 兼容
						uploadData(JSON.stringify(data), options);

					}else{
						
						uploadData(encodeURIComponent(fileData), options);
					
					}
				}
			}

		}
	}

	/**
	 var options = {
		 	domain			: '',											// default : '' ,必须设置文件服务器地址。
		  	file_data_name	: 'file',										// default : file , 文件对象的 key 。
		 	base64_size		: 10,											// default : 10 单位 MB 。
			chunk_size		: 10,											// default : 10 单位 MB 。
			headers			: { Content-Type : 'multipart/form-data'},		// default : { Content-Type : 'multipart/form-data'} ,增加 requestHeader 需扩展。 
		  	multi_parmas	: { },											// default : {} 扩展上传属性 。
		  	query			: { },											// default : {}	扩展 url 参数 e.g. http://rongcloud.cn?name=zhangsan 。
		  	support_options : true,											// default : true, 文件服务器不支持 OPTIONS 请求需设置为 false。
		  	use_nodeupload	: false,  										// default : false , 是否使用 node-server 中转上传（Electron 中使用）。
		  	useFormData		: true,											// default : true , 是否使用 formData 。
			use_key_value	: true,											// default : true , body 体是否使用 key - value 形式，useFormData 为 false 时有效
			up_chunk_type	: 0 | 1	| 2 | ....								// default : 1 , 分片厂商选择 0、自定义 1、腾讯云  2、七牛云 持续扩展 。
			up_process		: { chunkName : function(opts, file, listeners){},
								name : function(opts, file, listeners){}}	// default : {} ,与 up_chunk_type 为 0 次属性生效。
	  	};

	  var uploadParmas = {
			image : options,
			file  : options
			....
	  };
	------------------------------------------------------------------------------------------
	  var listeners = {
		onError	: function (fileUId, errorCode) { },
		onProgress : function (fileUId, loaded, total, percent) { },
		onCompleted : function (fileUId, data) { }
	  };
	*/

	UploadFile.init = function (uploadParmas, listeners) {

		if (Object.prototype.toString.call(listeners) != '[object Object]' || !listeners.onError || !listeners.onProgress || !listeners.onCompleted) {
			throw new Error('please set listeners');
			return;
		}
		
		UploadFile.listeners = listeners;
		UploadFile.uploadParmas = {};

		if (Object.prototype.toString.call(uploadParmas) != '[object Object]') {
			UploadFile.listeners.onError('', UploadFile.ErrorCode.UPLOAD_PARAMS_ERROR);
			return;
		}

		for(var type in uploadParmas){
			UploadFile.uploadParmas[type] = mergeOption(uploadParmas[type]);
		}
	};

	UploadFile.uploadFile = function(uploadType, fileUId, fileData){
		
		if (!UploadFile.uploadParmas){
			UploadFile.listeners.onError(fileUId, UploadFile.ErrorCode.NOT_INIT);
			return;
		}
		if (!UploadFile.listeners) {
			UploadFile.listeners.onError(fileUId, UploadFile.ErrorCode.NOT_SETLISTENERS);
			return;
		}

		var check = Object.prototype.toString;

		if (check.call(uploadType) != '[object String]' || uploadType == '') {
			UploadFile.listeners.onError(fileUId, UploadFile.ErrorCodeUPlOADTYPE_ERROR);
		}

		if (check.call(fileUId) != '[object String]' || fileUId == '') {
			UploadFile.listeners.onError(fileUId, UploadFile.FILEUID_ERROR);
		}

		if (check.call(fileData) != '[object String]' && check.call(fileData) != '[object File]') {
			UploadFile.listeners.onError(fileUId, UploadFile.ErrorCode.FILEDATA_ERROR);
		}

		var options = UploadFile.uploadParmas[uploadType] , isBase64 = false;
		if (check.call(fileData) == '[object String]') {
			if ((fileData.length/1024)  > options.base64_size) {
				UploadFile.listeners.onError(fileUId, UploadFile.BASE64_TOO_LARGE);
				return;
			}
			isBase64 = true;
		}
		options.fileUId = fileUId;
		UploadFile(options, fileData, isBase64);
	};

	UploadFile.ErrorCode = {
		BASE64_TOO_LARGE : 1001,
		NOT_INIT : 1002,
		NOT_SETLISTENERS : 1003,
		UPLOAD_PARAMS_ERROR : 1004,
		UPlOADTYPE_ERROR : 1005,
		FILEUID_ERROR : 1006,
		FILEDATA_ERROR: 1007,
		DOAMIN_ISNULL : 1008,
		POST_DATA_ERROR : 1009
	};

	win.UploadFile = UploadFile;
})(window);