(function(win){

	var buildData = {
		form : getFormData,
		json : getJsonData,
		data : getData		
	};

	var errorCode = {
			BASE64_TOO_LARGE : {code : 1001, error : 'BASE64_TOO_LARGE' },
			NOT_INIT		 : {code : 1002, error : 'NOT_INIT'},
			DOAMIN_ISNULL	 : {code : 1003, error : 'DOAMIN_ISNULL' },
			POST_DATA_ERROR  : {code : 1004, error : 'POST_DATA_ERROR' }
	};

	function mergeOption(opts){
		var options = {
		 	domain			: '',	
		 	method			: 'POST',										
		  	file_data_name	: 'file',										
		 	base64_size		: 10 * 1024 *1024,											
			chunk_size		: 10 * 1024 *1024,											
			headers			: { },		
		  	multi_parmas	: { },											
		  	query			: { },											
		  	support_options : true,
		  	// cloud			: uploadProcess.tencent,
		  	data 			: buildData.form									
	  	};
	   if (!opts || !opts.domain) {
	   		throw new Error('domain is null');
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


	/** data start*/
	function getFormData(file, opts) {
		var form = new FormData();
			form.append(opts.file_data_name, file);
			mEach(opts.multi_parmas, function(key, value){
				form.append(key, value);
			});
		return form;
	}

	function getJsonData(file, opts) {
		var data = {};
			data[opts.file_data_name] = file;
			mEach(opts.multi_parmas, function(key, value){
				data[key] = value;
			});
		return JSON.stringify(data);
	}

	function getData(file, opts) {
		return encodeURIComponent(file);
	} 

	/** data end*/

	// function uploadData (data, options, callback) {
	// 	// TODO 兼容
	// 	var xhr = new XMLHttpRequest();
	// 	if (xhr.upload && options.support_options) {
	// 		xhr.upload.onprogress = function (event) {
	// 			callback.onProgress(event.loaded, event.total, Math.floor(event.loaded / event.total * 100) );
	// 		};
	// 	}
		
	// 	xhr.onreadystatechange = function(){
	// 		if (xhr.readyState == 4) {
	//             if (xhr.status == 200) {
	//            	 	if (xhr.responseText) {
	//            	 		callback.onCompleted(JSON.parse(xhr.responseText));
	//            	 	}else{
	//            	 		callback.onError(UploadFile.ErrorCode.POST_DATA_ERROR);
	//            	 	}
	//             }
	//        }
	// 	};

	// 	var url = options.domain;
	// 	mEach(options.query, function(key, value){
	// 		if (url.indexOf('?') == -1){
	// 			 url += '?' + key + '=' + encodeURIComponent(value);
	// 		} else {
	// 			 url += '&' + key + '=' + encodeURIComponent(value)
	// 		}
			
	// 	});
	// 	xhr.open(options.method, options.domain, true);
	// 	mEach(options.headers, function(key, value){
	// 		xhr.setRequestHeader(key, value);
	// 	});
	// 	xhr.send(data);
	// }

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
			data 			: buildData.form
	  	};
	  var callback = {
		onError	: function (fileUId, errorCode) { },
		onProgress : function (fileUId, loaded, total, percent) { },
		onCompleted : function (fileUId, data) { }
	  };
	*/

	function init(options) {
		return new Upload(options);
	}

	function Upload(options) {
		this.options = mergeOption(options);
	}

	Upload.prototype.setOptions = function(opts) {
		var me = this;
		mEach(opts,function(key, value){
			me.options[key] = value;
		});
	}

	Upload.prototype.upload = function(file, callback) {
		if (!file) {
			callback.onError(errorCode.POST_DATA_ERROR);
			return;
		}
		uploadProcess(file, this.options, callback);
	};

	win.UploadFile = {
		init : init,
		buildData : buildData,
		errorCode : errorCode
	};
})(window);