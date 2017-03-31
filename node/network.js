var request = require('superagent');
var dns = require('dns');
var W3CWebSocket = require('websocket').w3cwebsocket;
var http = require('http');

var config = {
    appkey: '8luwapkvucoil',
    token: 'hsYEW1+K1JHASMHGUrJJJLrkPG6U/xPk3zvPIWf9le1hEGTTL55/U3+F/iaeDmXmOvEHh5CgU1f6tiN2qQZgBQ=='
};
/**
    var tpl = '{{0}}今年 {{1}} 岁了。';
    var val = stringFormat(tpl, '小明', 10);
    // 小明今年 10 岁了。
 */
var stringFormat = function(str) {
    for (var i = 1; i < arguments.length; i++) {
        var val = arguments[i] == undefined ? "" : arguments[i],
            reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
        str = str.replace(reg, val);
    }
    return str;
};

var _generateErrorInfo = function(type, error) {
    var network = [
            '网络异常：',
            '1、请检查网络是否可用，是否可以打开 http://rongcloud.cn/ 。'
        ],
        resolveNavi = [
            '解析融云导航域名异常：',
            '1、请检查当前网络环境 (wifi、4G) 。',
            '2、如果网络正常但域名无法解析请反馈日志给技术支持。'
        ],
        resolveHttsServer = [
            '解析导航域名（HTTPS） 异常： ',
            '1、请排查网络环境是否有异常。',
            '2、如果网络正常但无法解析请将域名反馈给技术支持。'
        ],
        reqNavi = [
            '请求融云导航异常：',
            '1、Appkey 与 Token 是否匹配。',
            '2、Token 是否正确、是否过期。',
            '3、访问 IM　域名必须与开发者后台设置的安全与名一致（未设置过请忽略, 默认为空。）'
        ],
        ws_server = [
            '连接融云 CMP 异常 (80 - ws): ',
            '1、请排查网络环境是否有异常',
            '2、80 端口 WebSocket 可能被网络设备禁用，请等待探测工具对备用地址进行测试。'
        ],
        ws_backupServer = [
            '连接融云 CMP 异常 (备用地址 - ws): ',
            '1、请排查网络环境是否有异常。',
            '2、80 端口和备用端口均不可用，请检查您的网络出口，是否对 80 端口的 WebScoket 或',
            '   对 8000 到 8500 之间的端口号有限制。',
            '3、检测对象：防火墙、路由器、或联系公司 IT 部门协助排查。'
        ],
        wss_server = [
            '连接融云 CMP 异常 (443 - wss):',
            '1、请排查网络环境是否有异常',
            '2、如果网络正常但无法连接请反馈日志给技术支持。'
        ];

    var store = {
        network: network,
        resolveNavi: resolveNavi,
        reqNavi: reqNavi,
        ws_server: ws_server,
        ws_backupServer: ws_backupServer,
        wss_server: wss_server
    };

    var info = [error];
    if (type in store) {
        info = store[type].concat(info);
    }
    return info.join('\n\r');
};

var checkNetwork = function(callback) {
    // TODO　更合适的资源
    http.get('http://cdn.ronghub.com/RongIMLib-2.2.4.min.js', function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback.onSuccess();
        });
    }).on('error', function(e) {
        var errorInfo = _generateErrorInfo('network', e.message)
        callback.onError(errorInfo);
    });
};

var _resolve = function(domain, callback) {
    dns.resolve4(domain, function(error, address) {
        if (error) {
            callback.onError(error);
        } else {
            callback.onSuccess(address);
        }
    });
};

var resolveNavi = function(callback) {
    var navi = 'nav.cn.ronghub.com';
    _resolve(navi, {
        onSuccess: function(address) {
            callback.onSuccess(address);
        },
        onError: function(error) {
            var errorInfo = _generateErrorInfo('resolveNavi', error);
            callback.onError(errorInfo);
        }
    });
};

var resolveHttpsServer = function(domain, callback) {
    _resolve(domain, {
        onSuccess: function(address) {
            callback.onSuccess(address);
        },
        onError: function(error) {
            var errorInfo = _generateErrorInfo('resolveHttsServer', error);
            callback.onError(errorInfo);
        }
    });
};

var _request = function(url, options) {
    var accept = options.accept || 'application/json';
    request
        .get(url)
        .set('Accept', accept)
        .end(function(err, res) {
            if (err) {
                options.error(err);
            } else {
                options.success(res);
            }
        });
};

var reqNavi = function(protocol, callback) {
    var urlTpl = '{0}//nav.cn.ronghub.com/navi.json?appId={1}&token={2}&callBack=getServerEndpoint&t={3}',
        timestamp = +new Date,
        token = encodeURIComponent(config.token);
    var url = stringFormat(urlTpl, protocol, config.appkey, token, timestamp);
    _request(url, {
        success: function(res) {
            callback.onSuccess(res.body);
        },
        error: function(error) {
            var errorInfo = _generateErrorInfo('reqNavi', error);
            callback.onError(errorInfo);
        }
    });
};

var reqHttpNavi = function(callback) {
    reqNavi('http:', callback);
};

var reqHttpsNavi = function(callback) {
    reqNavi('https:', callback);
};

var checkWebSocket = function(server, errorType, callback) {
    var urlTpl = '{0}/websocket?appId={1}&token={2}&sdkVer=2.2.4&apiVer={3}',
        timestamp = +new Date,
        url = stringFormat(urlTpl, server, config.appkey, config.token, timestamp);
    var client = new W3CWebSocket(url);
    client.onerror = function(e) {
        var errorInfo = _generateErrorInfo(errorType, e);
        callback.onError(errorInfo);
    };

    client.onopen = function() {
        callback.onOpen('WebSocket 正常打开');
    };

    client.onclose = function() {
        callback.onSuccess('WebSocket 正常关闭');
    };

    client.onmessage = function(e) {
        callback.onMessage('接收：' + e.data);
    };
};

var checkServer = function(server, callback) {
    server = 'ws://' + server;
    var errorType = 'ws_server';
    checkWebSocket(server, errorType, callback);
};

var checkBuckUpServer = function(server, callback) {
    server = 'ws://' + server;
    var errorType = 'ws_backupServer';
    checkWebSocket(server, errorType, callback);
};

var checkWssServer = function(server, callback) {
    server = 'wss://' + server;
    var errorType = 'wss_server';
    checkWebSocket(server, errorType, callback);
};

var _showTips = function(type, tip, bound) {
    !bound && console.log('------------------------------------------------------------');
    console.log(type, tip);
};

var automatic = function() {
    var next = function(method, item) {
        method(item);
    };
    var _checkWssServer = function(res) {
        var type = 'CheckWssServer - ';
        checkWssServer(res.server, {
            onSuccess: function(info) {
                _showTips(type, info, true);
                _showTips('探测完成','');
            },
            onOpen: function(info) {
                _showTips(type, info);
            },
            onMessage: function(data) {
                _showTips(type, data, true);
            },
            onError: function(error) {
                _showTips(type, error, true);
            }
        });
    };
    var _resolveHttpsServer = function(res) {
        var type = 'Resolve Https Navi - ';
        // server: ws33.cn.ronghub.com:443
        var domain = res.server.split(':')[0];
        resolveHttpsServer(domain,{
            onSuccess: function(address) {
                _showTips(type, address);
                next(_checkWssServer, res);
            },
            onError: function(error) {
                _showTips(type, error);
            }
        });
    };
    var _reqHttpsNavi = function() {
        var type = 'Request Https Navi - ';
        reqHttpsNavi({
            onSuccess: function(res) {
                _showTips(type, res);
                next(_resolveHttpsServer, res);
            },
            onError: function(error) {
                _showTips(type, error);
            }
        });
    };
    var _checkBuckUpServer = function(res) {
        var type = 'CheckBuckUpServer - ';
        checkBuckUpServer(res.backupServer, {
            onSuccess: function(info) {
                _showTips(type, info, true);
                next(_reqHttpsNavi);
            },
            onOpen: function(info) {
                _showTips(type, info);
            },
            onMessage: function(data) {
                _showTips(type, data, true);
            },
            onError: function(error) {
                _showTips(type, error, true);
            }
        });
    };

    var _checkServer = function(res) {
        var type = 'CheckServer - ';
        checkServer(res.server, {
            onSuccess: function(info) {
                _showTips(type, info, true);
                next(_checkBuckUpServer, res);
            },
            onOpen: function(info) {
                _showTips(type, info);
            },
            onMessage: function(data) {
                _showTips(type, data, true);
            },
            onError: function(error) {
                _showTips(type, error, true);
            }
        });
    };
    var _reqHttpNavi = function() {
        var type = 'Request Http Navi - ';
        reqHttpNavi({
            onSuccess: function(res) {
                _showTips(type, res);
                next(_checkServer, res);
            },
            onError: function(error) {
                _showTips(type, error);
            }
        });
    };
    var _resolveNaiv = function() {
        var type = 'Resolve Navi - ';
        resolveNavi({
            onSuccess: function(address) {
                _showTips(type, address);
                next(_reqHttpNavi);
            },
            onError: function(error) {
                _showTips(type, error);
            }
        });
    };
    var _checkNetWork = function() {
        var type = 'CheckNetWork - ';
        checkNetwork({
            onSuccess: function() {
                _showTips(type, 'successfully');
                next(_resolveNaiv);
            },
            onError: function(error) {
                _showTips(type, error);
            }
        });
    };

    next(_checkNetWork);
};

module.exports.CheckTools = {
    automatic: automatic,
    checkNetwork: checkNetwork,
    resolveNavi: resolveNavi,
    reqHttpNavi: reqHttpNavi,
    reqHttpsNavi: reqHttpsNavi,
    checkServer: checkServer,
    checkBuckUpServer: checkBuckUpServer,
    checkWssServer: checkWssServer
};