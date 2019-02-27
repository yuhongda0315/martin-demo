(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.RongSticker = factory();
  }
})(window, function () {

  var utils = {
    tplEngine: function (temp, data, regexp) {
      if (!(Object.prototype.toString.call(data) === '[object Array]')) data = [data];
      var ret = [];
      for (var i = 0, j = data.length; i < j; i++) {
        ret.push(replaceAction(data[i]));
      }
      return ret.join('');

      function replaceAction(object) {
        return temp.replace(regexp || (/{([^}]+)}/g), function (match, name) {
          if (match.charAt(0) == '\\') return match.slice(1);
          return (object[name] != undefined) ? object[name] : '{' + name + '}';
        });
      }
    },
    copy: function (target, source) {
      for (var key in source) {
        target[key] = source[key];
      }
    },
    noop: function () { },
    getRandom: function (range) {
      return Math.floor(Math.random() * range);
    },
    getTimestamp: function (timestamp) {
      var date = new Date();
      if (timestamp > 0) {
        date = new Date(timestamp);
      }
      return date.getTime();
    },
    forEach: function (obj, callback) {
      callback = callback || RongUtil.noop;
      var loopObj = function () {
        for (var key in obj) {
          callback(obj[key], key, obj);
        }
      };
      var loopArr = function () {
        for (var i = 0, len = obj.length; i < len; i++) {
          callback(obj[i], i);
        }
      };
      if (utils.isObject(obj)) {
        loopObj();
      }
      if (utils.isArray(obj)) {
        loopArr();
      }
    },
    /* 
      var option = {
        url: '',
        method: '',
        headers: {},
        success: function(){},
        fail: function(){}
      };
    
    */
    ajax: function (option) {
      var getXHR = function () {
        var xhr = null;
        var hasXDomain = function () {
          return (typeof XDomainRequest != 'undefined');
        };
        var hasXMLRequest = function () {
          return (typeof XMLHttpRequest != 'undefined');
        };
        if (hasXDomain()) {
          xhr = new XDomainRequest();
        } else if (hasXMLRequest()) {
          xhr = new XMLHttpRequest();
        } else {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
      };

      var xhr = getXHR();
      var method = option.method || 'GET';
      var url = option.url;
      var queryStrings = option.queryStrings || {};
      var tpl = '{key}={value}', strings = [];
      utils.forEach(queryStrings, function (value, key) {
        var str = utils.tplEngine(tpl, {
          key: key,
          value: value
        });
        strings.push(str);
      });
      var queryString = strings.join('&');
      var urlTpl = '{url}?{queryString}';
      url = utils.tplEngine(urlTpl, {
        url: url,
        queryString: queryString
      });

      xhr.open(method, url, true);

      var headers = option.headers || {};
      utils.forEach(headers, function (header, name) {
        xhr.setRequestHeader(name, header);
      });

      var success = option.success || utils.noop;
      var fail = option.fail || utils.noop;
      var isSuccess = function (result ) {
        return /^(200|202)$/.test(result.code);
      };

      var onLoad = function () {
          var result = xhr.responseText;
          if (result != '') {
            result = utils.JSON.parse(xhr.responseText);
          }
          if (isSuccess(result )) {
            success(result);
          } else {
            fail(result);
          }
      };
      if ('onload' in xhr) {
        xhr.onload = onLoad;
      }
      else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            onLoad();
          }
        };
      }
      xhr.send(null);
    },
    getProtocol: function () {
      var protocol = location.protocol;
      var isLocal = (protocol == 'file:');
      if (isLocal) {
        protocol = 'http:';
      }
      return protocol;
    },
    Cache: function () {
      var _cache = {};
      this.cache = _cache;
      this.set = function (key, value) {
        _cache[key] = value;
      };
      this.get = function (key) {
        return _cache[key];
      };
      this.remove = function (key) {
        delete _cache[key];
      };
    },
    rename: function (origin, newNames) {
      var isObject = utils.isObject(origin);
      if (isObject) {
        origin = [origin];
      }
      var utilJSON = utils.JSON;
      origin = utilJSON.parse(utilJSON.stringify(origin));
      var updateProperty = function (val, key, obj) {
        delete obj[key];
        key = newNames[key];
        obj[key] = val;
      };
      utils.forEach(origin, function (item) {
        utils.forEach(item, function (val, key, obj) {
          var isRename = (key in newNames);
          (isRename ? updateProperty : utils.noop)(val, key, obj);
        });
      });
      return isObject ? origin[0] : origin;
    },
    isObject: function (obj) {
      return (Object.prototype.toString.call(obj) == '[object Object]');
    },
    isArray: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Array]');
    },
    isFunction: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Function]');
    }
  };

  var config = {
    appkey: '',
    url: 'stickerservice.ronghub.com'
  };

  var StickerCache = new utils.Cache();

  var getSignature = function (data) {
    var appkey = utils.sha1(data.appkey);
    var nonce = data.nonce;
    var timestamp = data.timestamp;
    var tpl = '{appkey}{nonce}{timestamp}';
    var content = utils.tplEngine(tpl, {
      appkey: appkey,
      nonce: nonce,
      timestamp: timestamp
    });
    return utils.sha1(content);
  };

  var getQueryStrings = function () {
    var headers = {
      appkey: config.appkey,
      nonce: utils.getRandom(10000),
      timestamp: utils.getTimestamp()
    };
    var signature = getSignature(headers);
    utils.copy(headers, {
      signature: signature
    });
    return headers;
  };

  var getUrl = function (data) {
    var pathes = {
      'get-sticker': '/emoticonservice/emopkgs/{packageId}/stickers/{stickerId}',
      'get-packages': '/emoticonservice/emopkgs',
      'get-stickers': '/emoticonservice/emopkgs/{packageId}/stickers'
    };

    var path = pathes[data.type] || '';
    var tpl = utils.tplEngine('{protocol}//{host}{path}', {
      path: path
    });

    utils.copy(data, {
      protocol: utils.getProtocol(),
      host: config.url
    });
    var url = utils.tplEngine(tpl, data);
    return url;
  };

  var errorHandler = function (result) {
    var errors = {
      1004: {
        code: 1004,
        msg: '签名错误'
      },
      403: {
        code: 403,
        msg: 'AppKey 无效，请移步融云开发者后台获取 AppKey: https://developer.rongcloud.cn/'
      }
    };
    var error = errors[result.code];
    if (!error) {
      error = {
        code: 20000,
        msg: result
      };
    }
    return error;
  }

  var RequestCache = new utils.Cache();
  /* 
    rongSticker.Proxy.set(function(option, callback){
      //dosomething request
      var result = {}, error = null;
      callback(result, error);
    });
  */
  var requestProxy = function(proxy){
    if(utils.isFunction(proxy)){
      RequestCache.set('proxy', proxy);
    }
  };

  var innerProxy = function(option, callback){
    var url = getUrl(option);
    var queryStrings = getQueryStrings();
    utils.ajax({
      url: url,
      queryStrings: queryStrings,
      success: function (result) {
        var error = null;
        callback(result, error);
      },
      fail: function (error) {
        var result = null;
        callback(result, errorHandler(error));
      }
    });
  };
  RequestCache.set('proxy', innerProxy);

  var request = function (option, callback) {
    var proxy = RequestCache.get('proxy');
    proxy(option, callback);
  };

  var get = function (message, callback) {
    var packageId = message.packageId,
      stickerId = message.stickerId;

    var error = null;

    var stickers = StickerCache.get(packageId) || {};
    var sticker = stickers[stickerId];
    if (utils.isObject(sticker)) {
      utils.copy(sticker, {
        packageId: packageId,
        stickerId: stickerId
      });
      return callback(sticker, error);
    }

    var option = {
      type: 'get-sticker',
      packageId: packageId,
      stickerId: stickerId
    };
    request(option, function (result, error) {
      if (error) {
        return callback(result, error);
      }
      var sticker = result.data;
      sticker = utils.rename(sticker, {
        digest: 'desc',
        pkgId: 'packageId'
      });
      callback(sticker, error)
    });
  };

  var updatePackageCache = function(packages){
    var cachePackages = StickerCache.get('packages') || [];

    packages = packages.concat(cachePackages);

    var tmpPkg = {};
    utils.forEach(packages, function(package){
      tmpPkg[package.id] = package;
    });
    var pkgs = [];
    utils.forEach(tmpPkg, function(pkg){
      pkgs.push(pkg);
    });
    StickerCache.set('packages', pkgs);
  };

  var updateStickerCache = function(packageId, stickers){
    var tpl = '{id}_list';
    var key = utils.tplEngine(tpl, {
      id: packageId
    });

    var cacheStickers = StickerCache.get(key) || {};
    utils.forEach(stickers, function (sticker) {
      cacheStickers[sticker.stickerId] = sticker;
    });
    if(stickers.length > 0){
      // 为 getStickers 缓存
      StickerCache.set(key, stickers);
      // 为 get 获取单个 Sticker 方法缓存数据
      StickerCache.set(packageId, cacheStickers);
    }
  };

  /* 
  var packages = [{
    id: '',
    icon: '',
    name: '',
    order: 10,
    poster: '',
    stickers: [{
      packageId: '',
      stickerId: '',
      thumbUrl: '',
      url: '',
      desc: '描述',
      height: 100,
      width: 100
    }]
  }];
  */
  var extend = function (packages) {
    if (!utils.isArray(packages)) {
      throw new Error('Packages must be array');
    }

    utils.forEach(packages, function (package) {
      var stickers = package.stickers || [];
      
      //远程获取没有 stickers 此处删除为了保证本地、远程获取数据一致
      delete package.stickers;

      updateStickerCache(package.id, stickers);
    });
    updatePackageCache(packages);
  };

  var getPackages = function (callback) {
    callback = callback || utils.noop;

    var option = {
      type: 'get-packages'
    };
    request(option, function (result, error) {
      if (error) {
        return callback(result, error);
      }
      result = result.data;
      result = utils.rename(result, {
        manualLoad: 'packages'
      });

      var packages = result.packages;
      packages = packages.concat(result.preload);

      var filterProps = function (pack) {
        delete pack.createTime;
        delete pack.pkgType;
        return pack;
      };

      utils.forEach(packages, function (pack, index) {
        pack = utils.rename(pack, {
          packageId: 'id',
          digest: 'desc',
          cover: 'poster',
          isPreload: 'type'
        });
        packages[index] = filterProps(pack);
      });

      updatePackageCache(packages);
      result = {
        packages: StickerCache.get('packages')
      };
      callback(result, error);
    });
  };

  var getStickers = function (package, callback) {
    var id = package.id;
    
    var tpl = '{id}_list';
    var key = utils.tplEngine(tpl, {
      id: id
    });
    var stickers = StickerCache.get(key);
    var error = null;
    if(stickers){
      return callback({stickers: stickers}, error);
    }

    var option = {
      type: 'get-stickers',
      packageId: id
    };
    request(option, function (result, error) {
      if (error) {
        result = { data: { stickers: [] } };
      }
      var data = result.data;
      var stickers = data.stickers;

      utils.forEach(stickers, function (sticker, index) {
        sticker = utils.rename(sticker, {
          digest: 'desc'
        });
        utils.copy(sticker, {
          packageId: id
        });
        stickers[index] = sticker;
      });
      updateStickerCache(id, stickers);
      result = {stickers: stickers};
      callback(result, error);
    });
  };
  var init = function (_config) {
    utils.copy(config, _config);
    var extensions = config.extensions;
    if(utils.isArray(extensions)){
      extend(extensions);
    }
    return {
      Sticker: {
        get: get,
        getList: getStickers
      },
      Package: {
        getList: getPackages
      },
      Proxy: {
        set: requestProxy
      },
      utils: utils
    };
  };

  return {
    init: init
  };
});