; (function (RongIM) {
	var utils = RongIM.utils;
	var emoji = RongIM.emoji;
	var render = utils.render;
	var conversation = {};
	conversation.lastSendTime = 0;
	conversation.messageContent = [];
	var voicePlay = null;
	var userInfoValue = {};//保存收集用户信息的相关数据
	var templates = {};
	var $ = utils.$;
	var terminal;
	var supportNot = false;//页面是否支持notification
	var rongErrorNode = document.querySelector('.rong-error');
	var showError = function (error) {
		rongErrorNode.style.display = 'block';
		rongErrorNode.innerHTML = error;
	};
	var ConversationCache = utils.Cache();
	//加载模板
	var getTemplates = function (callback) {
		templates = RongIM.getTemplates();
		callback && callback();
	}

	//键盘回车发送
	var keySend = function (event) {
		if (event.keyCode == '13' && !event.shiftKey) {
			event.preventDefault()
			send();
		} else {
			inputChange();
		}
	}
	var sendText = function (content) {
		content = emoji.symbolToEmoji(content);
		sendMessage(new RongIMLib.TextMessage({ content: content, extra: "附加信息" }));
	};

	var registerMessage = function(message){
		var messageName = 'CustomMessage';
		var objectName = message.objectName;
		var isCounted = true;
		var isPersited = true;
		var mesasgeTag = new RongIMLib.MessageTag(isCounted, isPersited);
		var props = utils.jsonKeys(message.content);
		RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, props);
	};
	/* 
		var message = {
			objectName: 'App:User',
			content: {
				id: 'maondo1p',
				name: 'Martin',
				portrait: 'http://www.rongcloud.cn/portrait.png'
			}
		};
	*/
	var sendCustomMessage = function (message) {
		registerMessage(message);
		var msg = new RongIMClient.RegisterMessage.CustomMessage(message.content);
		sendMessage(msg);
	};
	//发送
	var send = function () {
		var inputMsg = $(".rongcloud-text")[0];
		var content = inputMsg.value;
		if (content) {
			try {
				var message = eval(`(${content})`);
				var isMessage = utils.isObject(message) && message.objectName;
				if (isMessage) {
					sendCustomMessage(message);
				} else {
					sendText(content);
				}
			} catch (e) {
				sendText(content);
			}
			inputMsg.value = '';
			inputMsg.focus();
		}
	}
	//每6秒执行一次正在输入消息发送
	var inputChange = function () {
		var timespan = new Date().getTime() - conversation.lastSendTime;
		if (timespan > 1000 * 6) {
			conversation.lastSendTime += timespan;
			sendTyping();
		}
	}
	//正在输入中
	var sendTyping = function () {
		if (conversation.targetType == RongIMLib.ConversationType.CUSTOMER_SERVICE) {
			var msg = new RongIMLib.TypingStatusMessage({
				typingContentType: 'RC:TxtMsg',
				data: null
			});
			var callback = function () { };
			sendMessage(msg, callback);
		}
	}
	//显示表情
	var showemoji = function (event) {
		event.stopPropagation();
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		if (emojiContent.style.display == 'none') {
			utils.show(emojiContent);
		} else {
			utils.hide(emojiContent);
		}
	}
	//表情点击
	var chooseEmoji = function (event) {
		event.stopPropagation();
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		var thisTarget = event.target || event.srcElement;
		var textArea = $('.rongcloud-text')[0];
		var emojiName = thisTarget.getAttribute('name');
		if (emojiName) {
			textArea.value += emojiName;
			utils.hide(emojiContent);
			if (terminal == 'pc') {
				textArea.focus();
				range = document.createRange();
				range.selectNodeContents(textArea);
				range.collapse(true);
				range.setEnd(textArea, textArea.childNodes.length);
				range.setStart(textArea, textArea.childNodes.length);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	}

	function textMessageFormat(content) {
		if (content.length === 0) {
			return '';
		}

		content = utils.encodeHtmlStr(content);

		content = utils.replaceUri(content, function (uri, protocol) {
			var link = uri;
			if (!protocol) {
				link = 'http://' + uri;
			}
			return '<a class="rong-link-site" target="_blank" href="' + link + '">' + uri + '</a>';
		});

		content = utils.replaceEmail(content, function (email) {
			return '<a class="rong-link-email" href="mailto:' + email + '">' + email + '<a>';
		});

		return emoji.emojiToHTML(content, 18);
	}

	//发送消息
	var sendMessage = function (msg, callback) {
		var targetId = conversation.id; // 目标 Id
		RongIMClient.getInstance().sendMessage(conversation.targetType, targetId, msg, {
			// 发送消息成功
			onSuccess: function (message) {
				console.log(message);
				//message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
				console.log("Send successfully");
				callback && callback();
				if (!callback) {
					updateConversationList();
					updateMessage(message);
				}
			},
			onError: function (errorCode, message) {
				var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
						info = '在黑名单中，无法向对方发送消息';
						break;
					case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
						info = '不在讨论组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_GROUP:
						info = '不在群组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
						info = '不在聊天室中';
						break;
					default:
						info = x;
						break;
				}
				alert('发送失败:' + info);
			}
		});
	}

	//显示新消息
	var updateMessage = function (message) {
		if (message.messageType == 'ReadReceiptMessage') {
			return;//ReadReceiptMessage的messageType
		}
		conversation.messageContent.push(message);
		var newMessage = modifyMessage(utils.cloneObj(message));
		if (message.messageDirection != 1 && supportNot) {
			pushMessage(newMessage);
		}
		var messageList = $(".rcs-message-box")[0];
		if (!messageList) {
			return;
		}
		if (newMessage.sentTime - conversation.lastSendTime >= 60000) {//超过1分钟
			var messageTime = {};
			messageTime.content = {};
			messageTime.messageType = 'TimeMessage';
			messageTime.sentTime = utils.getTime(newMessage.sentTime);
			messageList.innerHTML += render(templates.imMessageTemplate, messageTime);
			conversation.lastSendTime = newMessage.sentTime;
		}
		messageList.innerHTML += render(templates.imMessageTemplate, newMessage);
		messageList.scrollTop = messageList.scrollHeight;
	}

	//web push message
	var pushMessage = function (msg) {
		if (terminal == 'pc') {
			var title = '消息提醒';
			var options = {
				body: "您有一条新消息，请及时回复",
				icon: (msg.content.user && msg.content.user.icon) ? msg.content.user.icon : "./images/kefu.png",
			};
			var notification = new Notification(title, options);

			notification.onclick = function (event) {
				window.focus();
				notification.close();
			}
			notification.onshow = function () {
				setTimeout(function () {
					notification.close();
				}, 5000);
			};
		}
	}

	//图片新消息图片加载完毕滚动到最下面
	var scrollBottom = function () {
		var messageList = $(".rcs-message-box")[0];
		messageList.scrollTop = messageList.scrollHeight;
	}
	//加载历史消息
	var loadHisMessages = function () {
		var callbacks = function (list, hasMsg) {
			var messageBox = $(".rcs-message-box")[0];
			var messageList = {};
			messageList.hasMore = hasMsg;
			messageList.list = modificateMessage(conversation.messageContent);
			var oldHeight = messageBox.scrollHeight;
			messageBox.innerHTML = render(templates.imMessage, messageList);
			var newHeight = messageBox.scrollHeight;
			messageBox.scrollTop = newHeight - oldHeight;
		}
		getHisMessage(conversation.id, null, 20, callbacks);
	}

	var createIMConversation = function (config) {
		var data = {
			"showConversitionList": true,
			currentUser: RongIMLib.Bridge._client.userId
		}
		var callback = function (list) {
			var obj = {};
			obj.currentUser = RongIMLib.Bridge._client.userId;
			obj.list = list;
			data.conversationList = render(templates.conversation, obj);
			$(".customer-service")[0].innerHTML = render(templates.imMain, data);
		}
		getConversationList(callback);
	}

	//开始会话
	var startConversation = function (event) {
		var thisTarget = event.target || event.srcElement;
		if (thisTarget.className.indexOf('rongcloud-sprite') != -1) {
			event.currentTarget.parentNode.removeChild(event.currentTarget);
			removeConversation(event.currentTarget.getAttribute("_cid"));
			if (conversation.id == event.currentTarget.getAttribute("_cid")) {
				$('.rcs-chat-wrapper')[0].innerHTML = '';
			}
			return;
		}
		if (conversation.id == event.currentTarget.getAttribute("_cid")) {
			return;
		}
		conversation.messageContent = [];
		conversation.id = event.currentTarget.getAttribute("_cid");
		conversation.mcount = event.currentTarget.getAttribute('_mcount');
		conversation.targetType = +event.currentTarget.getAttribute('targetType');
		if (conversation.mcount != 0) {
			var badge = event.currentTarget.querySelector('.rongcloud-badge');
			if (badge) {
				badge.parentNode.removeChild(badge);
				clearUnreadCount(conversation.id);
			}
		}
		//打开会话
		openConversation(conversation);
	}

	//删除会话
	var removeConversation = function (targetId) {
		RongIMClient.getInstance().removeConversation(RongIMLib.ConversationType.PRIVATE, targetId, {
			onSuccess: function (bool) {
				console.log('删除会话成功');
				// 删除会话成功。
			},
			onError: function (error) {
				// error => 删除会话的错误码
			}
		});
	}

	var formatMessage = function (message) {
		var messageTypes = {
			TextMessage: function () {
				return emoji.emojiToHTML(message.content.content);
			},
			ImageMessage: function () {
				return '[图片]';
			},
			VoiceMessage: function () {
				return '[语音]';
			},
			FileMessage: function () {
				return '[文件]';
			}
		};

		var _default = function () {
			return '[自定义消息]';
		};

		var messageType = message.messageType;
		var getContent = messageTypes[messageType] || _default;
		return getContent();
	};

	var formatSentTime = function (sentTime) {
		var dateStr = utils.getTime(sentTime);
		var items = dateStr.split(' ');
		return items[0];
	};

	var isGroup = function (conversation) {
		var type = conversation.conversationType;
		return type == 3;
	};
	var isPrivate = function (conversation) {
		return conversation.conversationType == 1;
	};

	var getConversationName = function (conversationType) {
		var types = {
			1: '单',
			2: '讨',
			3: '群',
			4: '聊',
			6: 'S',
			7: 'MC',
			8: 'MP'
		};
		return types[conversationType];
	};
	//获取会话列表
	var getConversationList = function (callback) {
		RongIMClient.getInstance().getConversationList({
			onSuccess: function (list) {
				var _list = [];
				utils.forEach(list, function (conversation) {
					if (isGroup(conversation) || isPrivate(conversation)) {
						var message = conversation.latestMessage;
						conversation.$sentTime = formatSentTime(message.sentTime);
						conversation.$content = formatMessage(message);
						conversation.$name = getConversationName(conversation.conversationType);
						_list.push(conversation);
					}
				});

				var isEqual = function (conversatioin, another) {
					return conversatioin.conversationType == another.conversationType && conversatioin.targetId == another.targetId;
				};
				var currentUserId = RongIMLib.Bridge._client.userId;
				var fakeConversations = ConversationCache.get('fake') || [];
				// 过滤自己
				fakeConversations = fakeConversations.filter(function (conversation) {
					return conversation.targetId != currentUserId;
				});
				utils.forEach(fakeConversations, function (fakeConversation) {
					var isExist = false, len = _list.length;
					for (var i = 0; i < len; i++) {
						var conversation = _list[i];
						if (isEqual(conversation, fakeConversation)) {
							isExist = true;
							break;
						}
					}
					if (!isExist) {
						_list.unshift(fakeConversation);
					}
				});
				callback && callback(_list);
			},
			onError: function (error) {
				console.log('getConversationList error', error);
			}
		}, null);
	}

	//更新会话列表
	var updateConversationList = function () {
		var callback = function (list) {
			var obj = {};
			obj.list = list;
			$('.rcs-conversation-list')[0].innerHTML = render(templates.conversation, obj);
		}
		getConversationList(callback);
	}

	//清楚未读消息数
	var clearUnreadCount = function (targetId) {
		var conversationType = conversation.targetType;
		RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
			onSuccess: function () {
				console.log('清除未读消息成功');
				// 清除未读消息成功。
			},
			onError: function (error) {
				// error => 清除未读消息数错误码。
			}
		});
	}

	//进入指定会话
	var openConversation = function (conversation) {
		var chat = $(".rcs-chat-wrapper")[0];
		var callbacks = function (list, hasMsg) {
			var data = {};
			var messageList = {};
			messageList.firstEnter = true;
			messageList.list = modificateMessage(list);

			data.messageList = render(templates.imMessage, messageList);
			data.targetName = conversation.id;
			data.terminal = terminal;
			$(".rcs-chat-wrapper")[0].innerHTML = render(templates.chat, data);
			scrollBottom();
			utils.hide($('.rongcloud-mode2')[0]);
			utils.show($('.rongcloud-mode1')[0]);
			//初始化表情
			var emojiList = emoji.getEmoji();
			var strHtml = '';
			for (var i = 0; i < emojiList.length; i++) {
				strHtml += '<div class="emojiItem">' + emojiList[i].outerHTML + '</div>';
			}
			$('.rongcloud-expressionContent')[0].innerHTML += strHtml;

			if (hasMsg) {
				$('.rongcloud-Messages-history')[0].style.display = 'block';
			}
		}
		var count = conversation.mcount < 2 ? 2 : (conversation.mcount > 20 ? 20 : conversation.mcount);
		getHisMessage(conversation.id, 0, parseInt(count), callbacks);
	}

	//拉去消息记录
	var getHisMessage = function (conversationId, timestrap, count, callbacks) {
		var conversationType = conversation.targetType; //私聊,其他会话选择相应的消息类型即可。
		var targetId = conversationId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
		// timestrap默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
		// count每次获取的历史消息条数，范围 0-20 条，可以多次获取。
		var callback = {
			onSuccess: function (list, hasMsg) {
				conversation.messageContent = list.concat(conversation.messageContent);
				callbacks(list, hasMsg);
			},
			onError: function (error) {
				console.log("GetHistoryMessages,errorcode:" + error);
			}
		};
		var instance = RongIMLib.RongIMClient.getInstance();
		var type = conversationType == 4 ? 'chatroom' : 'other';
		var History = {
			chatroom: function () {
				// var order = 1;  
				// instance.getChatRoomHistoryMessages(targetId, count, order, callback);
				callback.onSuccess([], false);
			},
			other: function () {
				instance.getHistoryMessages(conversationType, targetId, timestrap, count, {
					onSuccess: function (list, hasMore) {
						callback.onSuccess(list, hasMore);
					},
					onError: function () {
						callback.onSuccess([], false);
					}
				});
			}
		};
		History[type]();
	}

	//单条消息修饰
	var modifyMessage = function (msg) {
		if (msg.messageType == 'TextMessage') {
			msg.content.content = textMessageFormat(String(msg.content.content));
		} else if (msg.messageType == 'FileMessage') {
			msg.content.size = utils.getFileSize(msg.content.size);
		} else if (msg.messageType == 'VoiceMessage') {
			RongIMLib.RongIMVoice.preLoaded(msg.content.content);
		}
		return msg;
	}

	//消息修饰，2条消息之间相差6000毫秒，显示消息发送时间
	var modificateMessage = function (list) {
		var listTemp = JSON.parse(JSON.stringify(list));
		var _list = [];
		for (var i = 0; i < listTemp.length; i++) {
			var messageTime = {
				sentTime: utils.getTime(listTemp[i].sentTime),
				messageType: 'TimeMessage'
			};
			var messageMap = [
				"TextMessage",
				"FileMessage",
				"SightMessage",
				"ImageMessage",
				"VoiceMessage",

			];
			if (messageMap.indexOf(listTemp[i].messageType) >= 0) {
				listTemp[i] = modifyMessage(listTemp[i]);
			} else {
				listTemp[i].messageType = 'UnknownMessage';
			}
			if (i == 0) {
				_list.push(messageTime);
			} else if (listTemp[i].sentTime - listTemp[i - 1].sentTime >= 60000) {
				_list.push(messageTime);
			}
			_list.push(listTemp[i]);
		}
		return _list;
	}

	//播放音频
	var play = function (event, msgContent) {
		RongIMLib.RongIMVoice.stop();
		var thisTarget = event.target || event.srcElement;
		if (thisTarget.className.indexOf('rongcloud-animate') != -1) {
			thisTarget.className = thisTarget.className.replace(' rongcloud-animate', '');
			clearTimeout(voicePlay);
		} else {
			var audioStatusNode = thisTarget.parentNode.querySelector('.rongcloud-audioState');
			if (audioStatusNode) {
				audioStatusNode.parentNode.removeChild(audioStatusNode);
			}
			if (voicePlay) {
				clearTimeout(voicePlay);
				var voiceList = $('.rongcloud-audioBox');
				for (var i = 0; i < voiceList.length; i++) {
					voiceList[i].className = 'rongcloud-audioBox rongcloud-clearfix';
				}
			}
			RongIMLib.RongIMVoice.play(msgContent.content, msgContent.duration);
			thisTarget.className = thisTarget.className + ' rongcloud-animate';
			voicePlay = setTimeout(function () {
				thisTarget.className = thisTarget.className.replace(' rongcloud-animate', '');
			}, msgContent.duration * 1000);
		}
	}

	//播放视频
	var playVideo = function (event) {
		var video = event.currentTarget.querySelector('video');
		var btn = event.currentTarget.querySelector('.play-btn');
		if (video.paused) {
			video.play();
			btn.style.display = "none";
		} else {
			video.pause();
			btn.style.display = "block";
		}
		video.onended = function () {
			btn.style.display = "block";
		}
	}


	//img上传图片
	var imgUpload = function (event) {
		var thisTarget = event.target || event.srcElement;
		var _file = thisTarget.files;
		for (var i = 0; i < _file.length; i++) {
			RongIM.imageStartUpload(_file[i], function (data) {
				console.log("文件上传完成：", data);
				getFileUrl(data);
			});
		}
		thisTarget.value = '';
	}
	//上传文件
	var fileUpload = function (event) {
		var thisTarget = event.target || event.srcElement;
		var _file = thisTarget.files;
		for (var i = 0; i < _file.length; i++) {
			RongIM.fileStartUpload(_file[i], function (data) {
				console.log("文件上传完成：", data);
				getFileUrl(data);
			});
		}
		thisTarget.value = '';
	}

	var urlItem = {
		file: function (data) {
			if (RongIM.config.fileConfig && RongIM.config.fileConfig.isPrivate) {
				if (data.rc_url.type == 1) {
					data.downloadUrl = data.rc_url.path;
				} else {
					data.downloadUrl = RongIM.config.fileConfig.fileServer + data.rc_url.path;
				}
				var msg = messageItem[data.fileType](data);
				sendMessage(msg);
			} else {
				var fileType = RongIMLib.FileType.FILE;
				RongIMClient.getInstance().getFileUrl(fileType, data.filename, data.name, {
					onSuccess: function (result) {
						data.downloadUrl = result.downloadUrl;
						var msg = messageItem[data.fileType](data);
						sendMessage(msg);
					},
					onError: function (error) {
						showError('getFileToken error:' + error);
					}
				});
			}
		},
		image: function (data) {
			if (RongIM.config.upload && RongIM.config.upload.isPrivate) {
				if (data.rc_url.type == 1) {
					data.downloadUrl = data.rc_url.path;
				} else {
					data.downloadUrl = RongIM.config.upload.fileServer + data.rc_url.path;
				}
				var msg = messageItem[data.fileType](data);
				sendMessage(msg);
			} else {
				var fileType = RongIMLib.FileType.IMAGE;
				RongIMClient.getInstance().getFileUrl(fileType, data.filename, null, {
					onSuccess: function (result) {
						data.downloadUrl = result.downloadUrl;
						var msg = messageItem[data.fileType](data);
						sendMessage(msg);
					},
					onError: function (error) {
						showError('getFileUrl Error:' + error);
					}
				});
			}
		}
	};
	var messageItem = {
		file: function (file) {
			var name = file.name || '',
				index = name.lastIndexOf('.') + 1,
				type = name.substring(index);
			// 发送文件消息请参考： http://rongcloud.cn/docs/web_api_demo.html#发送消息
			// 创建文件消息
			return new RongIMLib.FileMessage({ name: file.name, size: file.size, type: type, fileUrl: file.downloadUrl });
		},
		image: function (image) {
			return new RongIMLib.ImageMessage({ content: image.thumbnail, imageUri: image.downloadUrl });
		}
	};

	var getFileUrl = function (data) {
		urlItem[data.fileType](data);
	}

	//关闭聊天窗口
	var endConversation = function () {
		$('.rcs-chat-wrapper')[0].innerHTML = '';
	}

	//最小化
	var minimize = function () {
		utils.hide($('.customer-service')[0]);
	}

	//预览图片
	var viewImage = function (event) {
		var thisTarget = event.target || event.srcElement;
		var image = {
			imageUrl: thisTarget.getAttribute('data-img')
		}
		$('.imageViewBox')[0].innerHTML = render(templates.imageView, image);
		utils.fadein($('.imageViewBox')[0]);
	}
	var escImageView = function () {
		$('.imageViewBox')[0].innerHTML = '';
		utils.fadeout($('.imageViewBox')[0]);
	}

	//sdk初始化
	var sdkInit = function (params, callbacks) {
		var appKey = params.appKey;
		var token = params.token;
		RongIMLib.RongIMClient.init(appKey, null, params);

		var instance = RongIMClient.getInstance();

		// 连接状态监听器
		RongIMClient.setConnectionStatusListener({
			onChanged: function (status) {
				console.log(status);
				var connectDom = $('.RongIM-connect-status')[0];
				if (connectDom) {
					connectDom.style.display = 'block';
				}
				switch (status) {
					case RongIMLib.ConnectionStatus.CONNECTED:
						if (connectDom) {
							connectDom.style.display = 'none';
						}
						callbacks.getInstance && callbacks.getInstance(instance);
						break;
					case RongIMLib.ConnectionStatus.CONNECTING:
						console.log('正在链接');
						break;
					case RongIMLib.ConnectionStatus.DISCONNECTED:
						console.log('断开连接');
						break;
					case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
						console.log('其他设备登录');
						break;
					case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
						console.log('域名不正确');
						break;
					case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
						console.log('网络不可用');
						break;
					case RongIMLib.ConnectionStatus.DISCONNECTED:
						console.log('断开连接');
						break;
					case 4:
						console.log('token无效');
						break;
					default:
						console.log('未知错误');
						break;
				}
			}
		});

		RongIMClient.setOnReceiveMessageListener({
			// 接收到的消息
			onReceived: function (message) {
				// 判断消息类型
				console.log("新消息: " + message.targetId);
				if (message.offLineMessage) {
					return;
				}
				// if (message.conversationType == RongIMLib.ConversationType.PRIVATE) {
				if (message.targetId == conversation.id) {
					updateMessage(message);
					clearUnreadCount(conversation.id);
				}
				// }
				updateConversationList();
			}
		});

		//开始链接
		RongIMClient.connect(token, {
			onSuccess: function (userId) {
				callbacks.getCurrentUser && callbacks.getCurrentUser(userId);
				console.log("链接成功，用户id：" + userId);
				var chatroomId = ConversationCache.get('chatroomId');
				if (chatroomId) {
					var count = 10;
					RongIMClient.getInstance().joinChatRoom(chatroomId, count, {
						onSuccess: function () {
							console.log('joinchatroom successfully.');
						},
						onError: function (error) {
							console.log('joinchatroom error', erro);
						}
					});
				}
			},
			onTokenIncorrect: function () {
				showError('Token 无效, 请刷新后重试');
			},
			onError: function (errorCode) {
				showError('连接失败:' + errorCode);
			}
		});
	}

	//创建button
	var createButton = function (config) {
		// config.target.innerHTML = render(templates.button);
		createIMConversation(config);
		addListener(config);
	}

	var addListener = function (config) {
		var callback = function (phoneOrPc) {
			terminal = phoneOrPc;
		}
		utils.browserRedirect(callback);
		if (terminal == 'pc') {
			document.body.onclick = function () {
				hideEmoji();
			}
			if (Notification.permission === "granted") {
				supportNot = true;
			}
			// Otherwise, we need to ask the user for permission
			else if (Notification.permission !== "denied") {
				Notification.requestPermission(function (permission) {
					// If the user accepts, let's create a notification
					if (permission === "granted") {
						supportNot = true;
					}
				});
			}
		} else {
			document.body.ontouchstart = function (event) {
				if (event.target.className.indexOf('emojiItem') < 0 && event.target.className.indexOf('rong-emoji-content') < 0 && event.target.className.indexOf('rongcloud-expressionContent') < 0) {
					hideEmoji();
				}
				if (event.target.className.indexOf('rongcloud-rong-btn') < 0 && event.target.className.indexOf('rongcloud-text') < 0) {
					var inputMsg = $(".rongcloud-text")[0];
					if (inputMsg) {
						inputMsg.blur();
					}
				}
			}
		}
	}

	var hideEmoji = function () {
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		if (emojiContent) {
			utils.hide(emojiContent);
		}
	}

	//button点击事件
	var showCommon = function () {
		var csContext = $('.customer-service')[0];
		if (csContext.style.display == 'none') {
			utils.show($('.customer-service')[0]);
		} else {
			utils.hide($('.customer-service')[0]);
		}
	}

	//im组件初始化
	var init = function (config) {
		RongIM.config = config;
		config.isIM = true;
		var callbacks = {
			getInstance: function (instance) {
				var callback = function () {
					var templates = RongIM.config.templates;
					if (templates) {
						for (var index in templates) {
							templates[index] = templates[index];
						}
					}
				}
				getTemplates(callback);
				emoji.init();
				createButton(config);
			},
			getCurrentUser: function (userId) {
				showInfo(userId);
			}
		}
		sdkInit(config, callbacks);
	}

	//H5唤醒键盘的时候输入框显示在视野内
	var keyboard = function (event) {
		var thisTarget = event.target || event.srcElement;
		setTimeout(function () {
			thisTarget.scrollIntoView(true);
		}, 500)
	}

	//页面显示当前用户信息
	var showInfo = function (userId) {
		document.title = 'IM - 用户: ' + userId;
	}

	var formatInput = function (elements) {
		var get = function (key) {
			return elements[key].value;
		};
		var appkey = get('appkey'),
			token1 = get('token1'),
			token2 = get('token2'),
			nav = get('nav'),
			targetIds = get('private'),
			groupIds = get('group'),
			chatroomId = get('chatroom'),
			connectEngine = get('connectEngine');
		var createConversation = function () {
			var list = [];
			var carete = function (type, ids) {
				utils.forEach(ids, function (id) {
					if (id != "") {
						list.push({ conversationType: type, targetId: id, $name: getConversationName(type) });
					}
				});
			};
			var ConversationType = RongIMLib.ConversationType;
			targetIds = targetIds.split(',');
			carete(ConversationType.PRIVATE, targetIds);
			carete(ConversationType.CHATROOM, [chatroomId]);
			groupIds = groupIds.split(',');
			carete(ConversationType.GROUP, groupIds);
			return list;
		};
		var fakeList = createConversation();
		ConversationCache.set('appkey', appkey);
		ConversationCache.set('token1', token1);
		ConversationCache.set('token2', token2);
		ConversationCache.set('nav', nav);
		ConversationCache.set('connectEngine', connectEngine);
		ConversationCache.set('chatroomId', chatroomId);
		ConversationCache.set('fake', fakeList);
	};
	// var rongDialog = document.querySelector('.rong-dialog');
	// rongDialog.style.display = 'none';
	var initApp = function (elements) {
		formatInput(elements);
		var isPolling = ConversationCache.get('connectEngine') == 'comet';
		var index = location.search.replace('?', '')
		var config = {
			appKey: ConversationCache.get('appkey'),
			token: ConversationCache.get('token' + index),
			target: document.getElementById('app'),
			showConversitionList: true,
			navi: ConversationCache.get('nav')
		};
		if (isPolling) {
			config.isPolling = isPolling;
		}
		init(config);
	};

	//对外暴露
	RongIM.initApp = initApp;
	RongIM.send = send;
	RongIM.keySend = keySend;
	RongIM.showemoji = showemoji;
	RongIM.chooseEmoji = chooseEmoji;
	RongIM.loadHisMessages = loadHisMessages;
	RongIM.scrollBottom = scrollBottom;
	RongIM.imgUpload = imgUpload;
	RongIM.fileUpload = fileUpload;
	RongIM.endConversation = endConversation;
	RongIM.play = play;
	RongIM.playVideo = playVideo;
	RongIM.minimize = minimize;
	RongIM.showCommon = showCommon;
	RongIM.confirm = confirm;
	RongIM.close = close;
	RongIM.viewImage = viewImage;
	RongIM.escImageView = escImageView;
	RongIM.keyboard = keyboard;
	RongIM.startConversation = startConversation;
})(RongIM);