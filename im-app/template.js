;(function(RongIM){
	var getTemplates = function(callback){
		var list = {
	        chat: 'templates/chat.html',
	        conversation: 'templates/conversation.html',
	        imageView: 'templates/imageView.html',
	        imMain: 'templates/imMain.html',
	        message: 'templates/message.html',
	        imMessage: 'templates/imMessage.html',
	        messageTemplate: 'templates/messageTemplate.html',
	        imMessageTemplate: 'templates/imMessageTemplate.html',
					userInfo: 'templates/userInfo.html'
					
	    };
	    var templates = {};
	    for (var key in list) {
	    	var url = list[key];
	    	var html = RongIM.templateCache[url];
	    	if (html) {
	    		templates[key] = html;
	    	} else {
		    	var xhr = new XMLHttpRequest();
		    	xhr.open('get', url, false);
		    	xhr.onreadystatechange = function(){
		    		if (xhr.readyState == 4 && xhr.status == 200) {
		    			templates[key] = xhr.responseText;
		    		}
		    	}
		    	xhr.send(null);
	    	}

	    }
	    return templates;
	}
	RongIM.getTemplates = getTemplates;
})(RongIM);