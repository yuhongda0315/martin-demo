function Comet(event, option) {
  let messageId = 1;
  let utils = {
    tplEngine: (temp, data, regexp) => {
      if (!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
      let ret = [];
      for (let i = 0, j = data.length; i < j; i++) {
        ret.push(replaceAction(data[i]));
      }
      return ret.join("");

      function replaceAction(object) {
        return temp.replace(regexp || (/{([^}]+)}/g), function(match, name) {
          if (match.charAt(0) == '\\') return match.slice(1);
          return (object[name] != undefined) ? object[name] : '{' + name + '}';
        });
      }
    },
    getMsgId: () => {
      return messageId++;
    },
    noop: () => {}
  };

  let {
    appkey,
    token,
    server,
    sdkver
  } = option;
  token = encodeURIComponent(token);

  let pid = Date.now(), t = Date.now();

  let isPoll = true;

  let connect = () => {
    let url = '{server}/websocket?appId={appkey}&token={token}&sdkVer={sdkver}&apiVer=267717&pid={pid}&t={t}';
    url = utils.tplEngine(url, {
      server,
      appkey,
      token,
      sdkver,
      pid,
      t
    })
    return fetch(url).then(res => {
      return res.json();
    });
  };

  let doPolling = (conn, callback) => {
    t = Date.now();
    let sessionid = conn.sessionid;
    let url = '{server}/pullmsg.js?sessionid={sessionid}&pid={pid}&t={t}';
    url = utils.tplEngine(url, {
      server,
      sessionid,
      pid,
      t
    });
    return fetch(url).then(res => {
      return res.json();
    }).then(res => {
      callback(res);
    });
  };

  let syncTime = 0;
  let updateSyncTime = (res) => {
    syncTime = res.syncTime;
  };
  let pullMsg = (params) => {
    let {sessionId, targetId} = params;
    let messageId = utils.getMsgId();
    let url = '{server}/websocket?messageid={messageId}&header=82&sessionid={sessionId}&topic=pullMsg&targetid={targetId}&pid={pid}';
    url = utils.tplEngine(url, {
      server,
      sessionId,
      pid,
      targetId,
      messageId,
      t
    });
    let body = {
      ispolling: false,
      syncTime
    };
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res.json();
    });
  };

  let showNtf = (message) => {
    let title = '您有条新消息～';
    const options = {
      body: message.content,
    };
    // event.waitUntil(self.registration.showNotification(title, options));
    self.registration.showNotification(title, options);
  }; 

  let topicMap = {
    s_ntf: (ntf) => {
      pullMsg(ntf).then(data => {
        let result = data[0].data;
        result = JSON.parse(result);
        updateSyncTime(result);

        let messages = result.list;
        let msgLen = messages.length;
        let message = messages[msgLen - 1];
        let content = JSON.parse(message.content);
        showNtf({
          content: content.content
        });
      });
    },
    s_msg: (msg) => {

    }
  };

  connect().then(conn => {
    console.log(conn);
    var callback = (ret) => {
      let hasMsg = (ret.length > 0);
      if (hasMsg) {
        // 暂时只处理第一个 s_ntf 
        let message = ret[0];
        (topicMap[message.topic] || utils.noop)({
          sessionId: conn.sessionid,
          targetId: message.targetId
        });
      }
      
      if (isPoll) {
        doPolling(conn, callback);
      }
    };
    doPolling(conn, callback)
  });

  this.abort = function() {
    isPoll = false;
  };
}

self.addEventListener('message', event => {
  console.log(event);
  let {opts} = event.data;
  let comet = new Comet(event, opts);
 });