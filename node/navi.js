const request = require('request');

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

var getNavi = function(protocol, callback) {
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