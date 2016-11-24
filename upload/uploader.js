(function(win){

	var dataType = {
		form : getFormData,
		json : getJsonData,
		data : getData		
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
		  	data 			: dataType.form									
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
		return file;
	} 

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
			callback.onError('upload file is null.');
			return;
		}
		uploadProcess(file, this.options, callback);
	};

	win.UploadFile = {
		init : init,
		dataType : dataType
	};
})(window);