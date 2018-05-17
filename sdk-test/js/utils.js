(function(global) {
	var tools = {
		getDom: function(id) {
			return document.getElementById(id);
		},
		stringFormat: function(temp, data, regexp) {
			if (!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
			var ret = [];
			for (var i = 0, j = data.length; i < j; i++) {
				ret.push(replaceAction(data[i]));
			}
			return ret.join("");

			function replaceAction(object) {
				return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name) {
					if (match.charAt(0) == '\\') return match.slice(1);
					return (object[name] != undefined) ? object[name] : '{' + name + '}';
				});
			}
		},
		isArray: function(array) {
			return Object.prototype.toString.call(array) == '[object Array]';
		},
		prettyJSON: function(objs, opts) {
			opts = opts || {};
			var isArray = tools.isArray(objs);
			objs = isArray ? objs : [objs];
			var tpl = opts.tpl || '<span class={type}-font>{v}</span>';
			for (var i = 0, len = objs.length; i < len; i++) {
				var obj = objs[i];
				for (var k in obj) {
					if (obj.hasOwnProperty(k)) {
						var v = obj[k] || 'null';
						var type = (typeof v);
						if (type == 'object') {
							tools.prettyJSON(v);
						} else {
							obj[k] = tools.stringFormat(tpl, {
								type: type,
								v: v
							});
						}
					}
				}
			}
			return isArray ? objs : objs[0];
		}
	};

	var conversation = {
		get: function(params) {
			params = params || {};
			var type = params.type || 'conversationType';
			var id = params.id || 'targetId';
			return {
				conversationType: tools.getDom(type).value,
				targetId: tools.getDom(id).value
			}
		},
	};

	function Log(params){
		var element = params.element;
		var tpl = '<p class="log-title">{title}</p><pre>{logs}</pre>'
		this.show = function(title, logs){
			logs = tools.prettyJSON(logs);
			logs = JSON.stringify(logs, null, '  ');
			element.innerHTML += tools.stringFormat(tpl, {
				title: title,
				logs: logs
			});
		};
		this.clear = function(){
			element.innerHTML = '';
		}
	}

	global.RCUtils = {
		utils: tools,
		conversation: conversation,
		Log: Log
	};	
})(this);