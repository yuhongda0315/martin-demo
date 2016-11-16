(function(win){

	var options = {
			xhr:{
				domain:'',
				method:'post'
			},
			send_chunk:true,
			chunk_size:10,  // 单位 MB 。
			headers : {},
			file_data_name:'file',
			multipart_params:{}, // 扩展 formData
			use_formData:true	 // false 默认直接发送，将上传内容传入 upload 方法。
		}, 
		listener;

	var init = function(listener, options){
		this.listener = listener;
		this.options  = options;
	};

	var upload = function(data, options){
		var me = this, multiQueue, chunkQueue;
		// todo : calcute file size : data is a file or string

		// 多选,赋值给队列变量消费发送。
		if(typeof data == 'array'){
			queue = data;
		}

		var chun_size = options.chun_size * 1024;
		if (options.send_chunk && typeof data == 'object' && data.size < chun_size) {
			// 分包
		}

		var uploadNextChunk = function(){
			var xhr;
			if ('XMLHttpRequest' in win) {
				xhr = new XMLHttpRequest();
			}else{
				throw new Error('插件暂时支持非 XMLHttpRequest');
			}
			// 默认发送 OPTIONS 请求，文件服务器需支持 OPTIONS 。
			xhr.upload.onprogress = function(event){
				var percent = Math.floor(event.loaded / event.total * 100);
				me.listener.onUploadProgress({fileId:'', loaded:event.loaded, total:event.total, percent:percent});
			};

			xhr.onreadystatechange = function(){
			 	if (xhr.readyState == 4) {
		            if (xhr.status == 200) {
		           	 	if (xhr.responseText) {
		           	 		// callbacks.onSuccess(JSON.parse(xhr.responseText));
		           	 	}else{
		           	 		me.listener.onError();
		           	 	}
		            }
		       }
			};

			xhr.open(options.xhr.method, options.xhr.domain, true);
			xhr.setRequestHeader('Content-type', 'multipart/form-data');
			if (options.headers) {
				for(var key in headers){
					xhr.setRequestHeader(key, headers[key]);
				}
			}

		};

	};


	win.uploadFile = {
		options:options,
		listener:listener,
		init:init,
		upload:upload
	};
})(window);