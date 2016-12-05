(function(win){
	function uploadQiniu(file, opts, callback) { 
		if (file.size && opts.chunk_size < file.size) {
			uploadNextChunk(file, opts, callback);
		}else{
			var data = opts['data'](file, opts);
			uploadData(data, opts, callback);
		}
	}

	var offset = 0, filename = "", fileSize = 0;

	function uploadNextChunk(blob, opts, callback) {
		opts.filesize = blob.size;
		var chunk = Math.ceil(offset/opts.chunk_size);
		var chunks = Math.ceil(blob.size/opts.chunk_size);
		var curChunkSize = Math.min(opts.chunk_size, blob.size - offset);
		var chunkBlob = blob.slice(offset, offset + curChunkSize);
		opts.multi_parmas['chunk'] = chunk;
		opts.multi_parmas['chunks'] = chunks;
		opts.multi_parmas['name'] = blob.name;
		opts.headers = {'Content-Type':'application/octet-stream'};
		opts.stream = true;
		uploadData(chunkBlob, opts, 
					{
						onCompleted:function(resText){
							offset += curChunkSize;
							callback.onProgress(Math.floor((chunk+1) / chunks * blob.size), blob.size);
							if (offset < blob.size) {
								uploadNextChunk(blob, opts, callback);
							}else{
								offset = 0;
								opts.stream = false;
								delete opts.multi_parmas['chunk'] ;
								delete opts.multi_parmas['chunks'];
								delete opts.multi_parmas['name'];
								delete opts.headers['Content-Type'];
								callback.onCompleted(JSON.stringify({name:blob.name, size:blob.size}));
							}
						},
						onError:function(){
							console.log('qiniu uploadChunk error');
						},
						onProgress:function(){}
					});
	}

	function uploadData (data, options, callback) {
		var xhr = new XMLHttpRequest();
		if (xhr.upload && options.support_options) {
			xhr.upload.onprogress = function (event) {
				callback.onProgress(event.loaded, event.total, Math.floor(event.loaded / event.total * 100) );
			};
		}
		
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
	            if (xhr.status == 200) {
	           	 	if (xhr.responseText) {
	           	 		var result = JSON.parse(xhr.responseText.replace(/'/g,'"'));
	           	 		result.filename = options.unique_value;
	           	 		callback.onCompleted(JSON.stringify(result));
	           	 	}else{
	           	 		callback.onError(UploadFile.ErrorCode.POST_DATA_ERROR);
	           	 	}
	            }
	       }
		};

		var url = options.domain;
		if (options.stream) {
			url += '/mkblk/' + data.size;
			url = buildUrl(url, options.multi_parmas);
		}
		xhr.open(options.method, url, true);

		if (options.stream) {
			xhr.setRequestHeader('authorization','UpToken '+options.multi_parmas.token);
		}
		
		mEach(options.headers, function(key, value){
			xhr.setRequestHeader(key, value);
		});
		xhr.send(data);
	}

	function mEach(m, callback){
		for(var key in m){
			callback(key, m[key]);
		}
	}

	function buildUrl(url, items){
		var query = '';
		mEach(items, function(name, value) {
			if (name != 'token') {
				query += (query ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
			}
		});

		if (query) {
			url += (url.indexOf('?') > 0 ? '&' : '?') + query;
		}

		return url;
	}
	win.uploadProcess = uploadQiniu;
})(window);