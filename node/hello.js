// hello.js

function loadIMLib() {

  try {
      return require('./RongIMLib');
    } catch (err) {
      return require('./RongIMLib');
    }
}

function testSendMessage () {

  var users = ['GC2lr3GPu','Rbzowp7aX']; //for SRS

  //var objectName = "RC:TxtMsg";
  var txtMsgData = "{\"content\":\"@LT gghh\",\"mentionedInfo\":{\"type\":2,\"userIdList\":[\"LEU82p5Zk\"]}, \"user\":{\"name\":\"李涛\",\"icon\":\"http:\/\/7xogjk.com1.z0.glb.clouddn.com\/LEU82p5Zk1464574166962886963\",\"id\":\"LEU82p5Zk\"}}";

  var typingName = "RC:TypSts";
  var typingData = "{\"typingContentType\":\"RC:TxtMsg\"}";

  addon.registerMessageType(typingName, 0);

  var objectName = "RC:ImgMsg";
  var imgMsgdata = "{\"messageName\":\"ImageMessage\",\"user\":{\"id\":\"1\",\"name\":\"xx\"},\"content\":\"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAoAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDvqKjmmjgheWZwkaDLMegFcoNRu/EtxJHaTPaWKHBZeGf8aBHUyXdtE22S4iRh2ZwDTo5opc+XIj467WBrCTw9pkaoGidyO7SHmql/pCWBW9s9+2P7wVsMB7Gpba32FqjrKKybXXLImKGS6TzJMBQx5yfWtaqGFFMkEhA8t0U99ylv6ioImuZC/wC8iGx9v+rPP/j1MC1RVSa7dFn2IH8sdu3HcE/ypVunM+xoWRdm4livHv16UAWqKpve7LVnxucA4KKWQ/iKsRTLL0DgjruQr/MUASUUUUhhRRRQAUUUUAFFFFAHN+LNTjga3sGRJPtALMr8jjp+ufyrJi+0STo0M4hgQgrCiAKBVX4i711u0YEgGAbeOhDH/EVYsLxE0/7bcoyoi4x0yR6e1HUaeh18Q3Rjd1qJrZ/tSyLPIqAYMYxtP14rlrXxqksqo0QiQdyc1q3OqfaijQPhMAjHrWVeqqMeZl04Obsh2q3FvFb3TPbpJsRuNgOTitDw5qLano0Fw4xJyrj3B/8A1H8awxMsvysQc/ezXQaKF+xErjBc9Pwrlw2KlUnyyRpVpciuWp4oGG+aJX2jqU3Gq9ra27iRjbJgudu6PHHHYir1FegcxQmR381FV1Q4RVRQMjHckcDmneVJFcK7PMwK4yNp6c4I2/rV2igDMUMY/JmSRIyxZgEZi2TnGR0q1auxLIWdlH3S6Mpx75HNWaKACiiikMKKKKACiiigAooooA5vxtpEmpaYk1v/AK+2JYD1U9R+gP4Vx/mNdaULMSYZRjHrRRUydgT1MNbWTfsKnJ46119oskenQ8Zwu0H1xRRXLjFeF30OzD6S0JbKB3mA27nbgDHrXbWsIt7ZIh/COfrRRWeCV7ye+wYtu6QrAPKUblQoOPXOf8KXyIf+eSf98iiivROIPIh/55J/3yKPIh/55J/3yKKKADyIf+eSf98ijyIf+eSf98iiigA8iH/nkn/fIo8iH/nkn/fIoooAPIh/55J/3yKPIh/55J/3yKKKADyIf+eSf98ijyIf+eSf98iiigA8iH/nkn/fIo8iH/nkn/fIoooA/9k=\",\"imageUri\":\"http://rongcloud-image.ronghub.com/FvrEiTClM2_EiT2Aj4OZKoVLyBTP?e=2147483647&token=livk5rb3__JZjCtEiMxXpQ8QscLxbNLehwhHySnX:dQCVWInYlCAGh6Zu0SBpR8ZUMmU=\"}";

  //conversation type | targetId | object name | json string of content | push content | push data | progress callback | success callback | error callback
  addon.sendMessage(1, "LEU82p5Zk", objectName, imgMsgdata, "", "",
  function(message, progress) {
    console.log("progress");
    console.log(message);
    console.log(progress);
  },
  function(message) {
    console.log("success");
    console.log(message);
    testgetDeltaTime();
  },
  function(message, code) {
    console.log("progress");
    console.log(message);
    console.log(code);
  },
  users);
}

function testRecallMessage() {
  var objectName = "RC:RcCmd";
  var push = "xxx recall a message";
  var content = "{\"conversationType\":1,\"messageUId\":\"5DK2-H0EB-K4U0-35LG\",\"targetId\":\"Rbzowp7aX\",\"sentTime\":1491448630877}";

  addon.recallMessage(objectName,content,push,
    function() {
      console.log("recall success");
    },
    function(errorCode) {
      console.log("recall failed");
      console.log(errorCode);
    });
}

function testSetMessageContent() {
  var messageId = 11555;
  var content = "{\"operatorId\":\"GC2lr3GPu\",\"recallTime\":1491790407315,\"originalObjectName\":\"RC:TxtMsg\"}";
  var objectName = "RC:RcNtf";
  addon.setMessageContent(messageId,content,objectName);
}

function testInsertMessage() {
	// var msgContent = "{\"messageName\":\"InformationNotificationMessage\",\"message\":\"您当前不在此群组\"}";
  var msgContent = "{\"message\":\"You are not in current group\"}";
	var objectName = "RC:InfoNtf";
  var conversationType = 1;
  var targetId = "GC2lr3GPu";
  var senderUserId = "xxx";
  var direction = 2;
  return addon.insertMessage(conversationType,targetId,senderUserId,objectName,msgContent,
	  function(){
      console.log("insertMessage Successfully");
	  },
	  function(){
      console.log("insertMessage error");
	  },
    direction);
}

function setDebugLevel(){
  return addon.setDebugLevel();
}

function testGetMessage() {
	var msgId = "100"; // 显示的本地消息会有 msgId。
  addon.getMessage(msgId,
  function(msg){
    console.log("getMessage success");
  },
  function(){
    console.log("getMessage error");
  });
}

function testGetHistoryMessage() {
  var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
  var sendTime = 0; // 默认传 0
  var count = 15; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
  var objectName = ""; // 默认 空串（“”）
  var direction = true;// 默认 true
  var result = addon.getHistoryMessages(conversationType,targetId,sendTime,count,objectName,direction);
  return result;
}

function testGetUnreadMentionedMessages() {
  var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
  var result = addon.getUnreadMentionedMessages(conversationType, targetId);
  return result;
}

function testGetConversationList() {
  var arr = [1,2,3,5,6,7,8];
  var result = addon.getConversationList(arr);
  return result;
}

function testRemoveConversation() {
  var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
	var result = addon.removeConversation(conversationType,targetId);
  return result;
}

function testClearConversations() {
	var result = addon.clearConversations();
  return result;
}

function testGetTotalUnreadCount() {
	var result = addon.getTotalUnreadCount();
  return result;
}

function testGetPrivateTotalUnreadCount() {
  var conversationTypes = [1,2];
	var result = addon.getTotalUnreadCount(conversationTypes);
  return result;
}

function testGetUnreadCount() {
  var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk";
	var result = addon.getUnreadCount(conversationType,targetId);
  return result;
}

function testClearUnreadCount() {
	var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk";
	var result = addon.clearUnreadCount(conversationType,targetId);
  return result;
}

function testClearUnreadCountByTimestamp() {
  var conversationType = 1; //私聊,其他会话选择相应的消息类型即可。
  var targetId = "LEU82p5Zk";
  var timestamp = 0;
  var result = addon.clearUnreadCountByTimestamp(conversationType,targetId,timestamp);
  return result;
}

function testJoinChatRoom() {
  var chatRoomId = "chatroom001";
  var count = 10;
  addon.joinChatRoom(chatRoomId, count,
    function() {
      console.log("join chat room success");

      //testQuitChatRoom();
    },
    function(error) {
      console.log("join chat room error", error);
    });
}

function testQuitChatRoom() {
  var chatRoomId = "xxxx";
  addon.quitChatRoom(chatRoomId,
    function() {
      console.log("quit chat room success");
    },
    function(error) {
      console.log("quit chat room error", error);
    });
}

function testAddToBlacklist() {
  var userId = "xxxx";
  addon.addToBlacklist(userId, function() {
    console.log("add to blacklist success");
  },
  function(error) {
    console.log("add to blacklist error", error);
  });
}

function testRemoveFromBlacklist() {
  var userId = "xxxx";
  addon.removeFromBlacklist(userId, function() {
    console.log("remove from blacklist success");
  },
  function(error) {
    console.log("remove from blacklist error", error);
  });
}

function testGetBlacklist() {
  addon.getBlacklist(function(blacklistors) {
    console.log("get blacklistor", blacklistors);
  },
  function(error) {
    console.log("get blacklist error", error);
  });
}

function testGetBlacklistStatus() {
  var userId = "xxxx";
  addon.getBlacklistStatus(userId, function(result) {
  console.log("get blacklist success", result);
  },
  function(error) {
    console.log("get blacklist error", error);
  });
}

function testRegisterMessageType() {
  var messageType = "RCD:testMsg";
  var persistentFlag = 3;
  addon.registerMessageType(messageType, persistentFlag);
}

function testRegisterCmdMessage() {
  var objectNames = ["RC:RcCmd","RC:TypSts","RC:ReadNtf","RC:RRReqMsg","RC:RRRspMsg","RC:SRSMsg"];
  addon.registerCmdMessage(objectNames);
}

function testGetMessageById() {
  var messageId = 102;
  console.log(addon.getMessage(messageId));
}

function testGetMessageByUid() {
  var messageUid = "5BLC-482V-4A1O-JTTU";
  console.log(addon.getMessage(messageUid));
}

function testdisconnect() {
  addon.disconnect(true);
}

function testgetConnectionStatus() {
  console.log(addon.getConnectionStatus());
}

function testsetConversationNotificationStatus() {
  var userId = "xxx";
  addon.setConversationNotificationStatus(1, userId, false, function() {
    console.log("set conversation notification status success");
  },
  function(errorCode) {
    console.log("set conversation notification status error", errorCode);
  });
}

function testgetConversationNotificationStatus() {  //failure
  var userId = "xxx";
  addon.getConversationNotificationStatus(1, userId, function(notify) {
    console.log("get conversation notification status", notify);
  },
  function(errorCode) {
    console.log("get conversation notification status error", errorCode);
  });
}

function testsetConversationToTop() {
  console.log("set conversation top", addon.setConversationToTop(1, "GC2lr3GPu", true));
}

function testsetConversationHidden() {
  console.log("set conversation hidden", addon.setConversationHidden(1, "GC2lr3GPu", true));
}

function testgetRemoteHistoryMessages() { //failure
  addon.getRemoteHistoryMessages(1, "GC2lr3GPu", 0, 20, function(messages, remain) {
    console.log("get remote messages", messages, remain);
  }, function(errorCode) {
    console.log("get remote message error", errorCode);
  });
}

function testdeleteMessages() {
  var messageIds = [1,27];
  console.log("test delete message ", addon.deleteMessages(messageIds));
}

function testclearMessages() {
  var targetId = "1";
  console.log("test clear messages", addon.clearMessages(1, targetId));
}

// ReceivedStatus_UNREAD = 0,
//
// ReceivedStatus_READ = 1,
//
// ReceivedStatus_LISTENED = 2,
//
// ReceivedStatus_DOWNLOADED = 4,
function testsetMessageReceivedStatus() {
  console.log("test set message received status", addon.setMessageReceivedStatus(129, 3));
}
// SentStatus_SENDING = 10,
//
// SentStatus_FAILED = 20,
//
// SentStatus_SENT = 30,
//
// SentStatus_RECEIVED = 40,
//
// SentStatus_READ = 50,
//
// SentStatus_DESTROYED = 60,
function testsetMessageSentStatus() {
  console.log("test set message sent status", addon.setMessageSentStatus(23, 20));
}

function testgetTextMessageDraft () {
  console.log("test get message draft", addon.getTextMessageDraft(1, "xxx"));
}

function testsaveTextMessageDraft() {
  console.log("test save draft", addon.saveTextMessageDraft(1, "xxx", "draft text"));
}

function testclearTextMessageDraft() {
  console.log("test clear draft", addon.clearTextMessageDraft(1, "xxx"));
}

function testgetConversation() {
  console.log("test getConversation", addon.getConversation(1, "LEU82p5Zk"));
}

function testGetUploadToken() {
  var type = 1;
  addon.getUploadToken(type,
    function(token) {
      console.log("got upload token:",token);
    },
    function (errorCode) {
      console.log("upload token err:",errorCode);
    }
  );
}

function testGetDownloadUrl() {
  var type =1;
  var mimekey = "";
  var fileName = "";
  addon.getDownloadUrl(type, mimekey, fileName,
    function(url) {
      console.log("got download url:",url);
    },
    function(errorCode) {
      console.log("get downloadurl err:",errorCode);
    }
  )
}

function testGetChatroomInfo() {
  var chatroomId = "chatroom001";
  var order = 1;
  var count = 10;
  addon.getChatroomInfo(chatroomId,count,order,
    function(users,count) {
      console.log("get chatroominfo success:",users,count);
    },
    function (errorCode) {
      console.log("get chatroominfo err:",errorCode);
    }
  );
}

function testsearchMessageByContent(){
  var conversationType = 1;
  var targetId = "GC2lr3GPu";
  var keyword = "jimmie";
  var timestamp = 0; // 默认传 0
  var count = 10; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
  var total = 1;
  addon.searchMessageByContent(conversationType,targetId,keyword,timestamp,count,total, function(msgs,matched) {
    console.log("testsearchMessageByContent:",msgs,matched);
  });
}

function testsearchConversationByContent(){
  var keyword = "hello";
  var arr = [1,2,3,5,6,7,8];
  var result = addon.searchConversationByContent(arr,keyword);
  console.log("searchConversationByContent:",result);
}

function testgetDeltaTime() {
  console.log("delta time is ", addon.getDeltaTime());
}

function testGetUserStatus() {
  addon.getUserStatus("s3ldZ7sKI",
    function(status) {
  console.log("getUserStatus success:",status);
  },
  function(code) {
  console.log("getUserStatus error:",code);
  });
}

function testSetUserStatus() {
  addon.setUserStatus(2,
    function() {
      console.log("setUserStatus success");
  },
  function(code) {
    console.log("setUserStatus error:",code);
  });
}

function testSubscribeUserStatus() {
  var users = ["Prod1_MSG_NODE_5_monitor3","tBbSqim5e"];
  addon.subscribeUserStatus(users,
    function() {
    console.log("subscribeUserStatus success");
  },
  function(code) {
    console.log("subscribeUserStatus error:",code);
  });
}

function testSetValue()
{
  var key = "key1";
  var value = "value1";
  var ret = addon.setStoreValue(key,value);
  console.log("test setStoreValue:",ret);
}

function testGetValue()
{
  var key = "key1";
  var value = addon.getStoreValue(key);
  console.log("test getStoreValue:",value);
}

function testsearchValues(){
  var keyword = "jimmie";
  addon.searchValues(keyword, function(value) {
    console.log("testsearchValue:",value);
  });
}

//在init之后， connect之前设置
function testSetServerInfo() {
  var naviUrl = "http://nav.cn.ronghub.com/navi.xml";
  var xiaoqiaoNavi = "http://119.254.111.49:9100/navi.xml";
  addon.setServerInfo(naviUrl);
}

function testGetUnreadCountByConversation() {
  var idArr = ['pc1','gc1','pc2','gc2'];
  var typeArr = [1,3,1,3];
  return addon.getUnreadCountByConversation(idArr,typeArr);
}

function testSearchAccounts() {
  var key = "te";
  var stype = 0; //0: mc and mp 1: mp 2:mc
  var qtype = 1; //0 精确查询 1模糊查询
  addon.searchAccounts(key,stype,qtype,function(accounts) {
    console.log("search accounts:",accounts);
  },
  function(errCode){
    console.log("search accounts failed:",errCode);
  });
}

function testSubscribeAccount() {
  var id = "lulutest";
  var type = 7;
  var sub = true;
  addon.subscribeAccount(type,id,sub,function(){
  console.log("subscirbe success");
  },
  function(errCode){
  console.log("subscirbe failed:", errCode);
  });
}

function testGetAccounts (){
  console.log(addon.getAccounts());
}

function testGetVoipToken() {
  var type = 1;
  var name = "getvoipk";
  var extra = "";
  addon.getVoIPKey(type,name,extra,
    function(success) {
      console.log("testGetVoipToken:",success);
    },
    function(errorCode) {
      console.log("testGetVoipToken:",errorCode);
    });
}

function testAddBlocker(userId) {
  var reason = 20111;
  addon.addMessageBlocker(userId,reason,
    function() {
      console.log("testAddBlocker:");
    },
    function(errorCode) {
      console.log("testAddBlocker:",errorCode);
    });
}

function testRemoveBlocker() {
  var userId = "MQpF9hMuT";
  addon.removeMessageBlocker(userId,
    function() {
      console.log("testRemoveBlocker");
    },
    function(errorCode) {
      console.log("testRemoveBlocker:",errorCode);
    });
}

function testGetBlockers() {
  addon.getMessageBlockers(
    function(blockers) {
      console.log("testGetBlockers:",blockers);
    },
    function(errorCode) {
      console.log("testGetBlockers:",errorCode);
    });
}

function testGetBlockerStatus() {
  var userId = "MQpF9hMuT";
  addon.getMessageBlockerStatus(userId,
    function(status) {
      console.log("testGetBlockerStatus:",status);
    },
    function(errorCode) {
      console.log("testGetBlockerStatus:",errorCode);
    });
}

function testPublicCloud()
{
  addon.initWithAppkey("n19jmcy59f1q9");
  addon.setServerInfo("http://nav.cn.ronghub.com/navi.xml");
  addon.setConnectionStatusListener(function(result) {
    if (result == 0) {
      console.log("connect public cloud success");
    } else {
      console.log("connect public cloud error", result);
    }
  });
  addon.connectWithToken("rH9kY8Mmw4YGh+VkhUxezXxpRjANxKgfakOnYLFljI/cwIqj1TL1WNZ9OBMXlKaihLEVHZrHHo0tE2hP+hlNrw==", "Rbzowp7aX");
}

function testPrivateCloud()
{
  addon.initWithAppkey("0vnjpoanq0ymg");
  addon.setServerInfo("http://120.92.10.214:80/navi.xml");
  addon.setConnectionStatusListener(function(result) {
    if (result == 0) {
      console.log("connect private cloud success");
      testPublicCloud()
    } else {
      console.log("connect private cloud error", result);
    }
  });
  addon.connectWithToken("uAMHdO2maa31vLdJeLaWKiBa5Tax/kfLQylt6HLhuhQzHeUsVaGPpUsmj+tYy3zvQDjbWETwg9mdm1OzCTk/hA==", "111");
}

const addon = loadIMLib();
//addon.initWithAppkey("e0x9wycfx7flq");
 addon.initWithAppkey("n19jmcy59f1q9", './');
addon.setConnectionStatusListener(function(result) {
  if (result == 0) {
    console.log("connect success");
    console.log("setdebuglevel", setDebugLevel());
    // testSendMessage();
    // testRecallMessage();
    // testSetValue();
    // testGetValue();
    // testsearchValues();
   // console.log("testGetUnreadCountByConversation:",testGetUnreadCountByConversation());
    console.log("inserted message111", testInsertMessage());
    // console.log("testGetHistoryMessage",testGetHistoryMessage());
    //console.log("testGetUnreadMentionedMessages", testGetUnreadMentionedMessages());
    // testsetConversationToTop();
    // console.log("testGetConversationList",testGetConversationList());
    // console.log("testRemoveConversation",testRemoveConversation());
    // console.log("testGetTotalUnreadCount",testGetTotalUnreadCount());
    // console.log("testGetUnreadCount",testGetUnreadCount());
    // console.log("testClearUnreadCount",testClearUnreadCount());
    // console.log("testClearUnreadCountByTimestamp",testClearUnreadCountByTimestamp());
    // console.log("testGetPrivateTotalUnreadCount",testGetPrivateTotalUnreadCount());
    // testJoinChatRoom();
    // testAddToBlacklist();
    // testRemoveFromBlacklist();
    // testGetBlacklist();
    // testGetBlacklistStatus();
    // testRegisterMessageType();
    // testGetMessageById();
    // testGetMessageByUid();
    // testdisconnect();
    // testgetConnectionStatus();
    // testsetConversationNotificationStatus();
    // testgetConversationNotificationStatus();
    // testgetRemoteHistoryMessages();
    // testdeleteMessages();
    // testclearMessages();
    // testsetMessageReceivedStatus();
    // testsetMessageSentStatus();
    // testsaveTextMessageDraft();
    // testgetTextMessageDraft();
    // testclearTextMessageDraft();
    // testgetTextMessageDraft();
    // testgetTextMessageDraft();
    // testclearTextMessageDraft();
    // testgetTextMessageDraft();
    // testgetConversation();
    // testGetUploadToken();
    // testGetDownloadUrl();
    // testGetChatroomInfo();
    // testsearchMessageByContent();
    // testsearchConversationByContent();
    // testgetDeltaTime();
    // testloop();
    // testsetConversationHidden();
    // testSetUserStatus();
    // testGetUserStatus();
    // testSubscribeUserStatus();
    // testGetAccounts();
  } else {
    console.log("connect error", result);
  }
});

addon.setOnReceiveMessageListener(function(result, left) {
  console.log("message:",result);
  console.log("left:", left);
});

addon.setOnReceiveStatusListener(function(userid, status) {
  console.log("notify userid:",userid);
  console.log("nofigy status:",status);
});


 testSetServerInfo();
// addon.connectWithToken("h51Xt6Jt5d1xCrCNyudnf7ywMGBz8rrOEvvIt6wnoWtK2b7QxlQv8Q3DZFmSJjpx/Uzvuos5g5rPti8T/QQOBuwImOKrWef2","T3faQWsC6");
addon.connectWithToken("rH9kY8Mmw4YGh+VkhUxezXxpRjANxKgfakOnYLFljI/cwIqj1TL1WNZ9OBMXlKaihLEVHZrHHo0tE2hP+hlNrw==", "Rbzowp7aX");
 // addon.connectWithToken("QskDgCgga8iU58Uppk2qgHxpRjANxKgfakOnYLFljI/mV5Q86MQ+UU9i9SOxMB155z++W5o1L83b+DEKdwTVvw==", "LoYFv8hT0");

var counter = 0;
function testloop() {
  //testGetConversationList();
  //testGetHistoryMessage();
  //testGetConversationList();
  console.log("loop");
  setTimeout(function() {
    testloop();
  }, 10);
}

var http = require('http');
var server = http.createServer(function(request, response){
    try {
        var ret = require('.' + request.url);
        response.end(ret.output);
    } catch (err) {
        response.end(err.toString());
    }
});
var port = 8221
server.listen(++port);
