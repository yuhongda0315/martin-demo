"use strict"
const request = require('request');
const fs = require('fs');
const path = require('path');

let utils = {
  getUId: () => {
    let date = Date.now();
    let uuid = 'xxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
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
  readFiles: (url, sessionId) => {
    let urls = [];
    let files = fs.readdirSync(url);
    files.forEach(function(name) {
      let fileUrl = path.join(url, name);
      let stats = fs.statSync(fileUrl);
      let tpl = '{url}/{name}';
      if (stats.isFile()) {
        urls.push(path.resolve(__dirname, config.tmpPath, sessionId, name));
      }
    });
    return urls;
  },
  /*
  rmdir({
    dir: './files/dksjsdaa',
    urls: ['./files/dksjsdaa/0', './files/dksjsdaa/1'] 可选
  });
  */
  rmdir: (params) => {
    let dir = params.dir;
    let urls = params.urls || [];
    urls.forEach((url) => {
     fs.unlinkSync(url);
    });
    // 文件暂时删除
    //fs.rmdirSync(dir);
  },
  copy: (objs) => {
    let tmpObj = {};
    for(let key in objs){
      let val = objs[key];
      tmpObj[key] = val;
    }
    return tmpObj;
  },
  prettyJSON: (obj) => {
    return JSON.stringify(obj, null, 4);
  }
};

let config = {
  tmpPath: path.resolve(__dirname, 'tmp-files'),
  rangeConf: path.resolve(__dirname, 'range.json')
}

let RangeConf = require(config.rangeConf);

/*
  params.name
  params.dist
  params.sessionId
*/
let mergeFile = (params, callback) => {
  // 文件名称
  let name = params.name;
  // 下载位置
  let dist = params.dist;

  let sessionId = params.sessionId;

  let distTpl = '{dist}/{name}';
  dist = utils.tplEngine(distTpl, {
    dist,
    name
  });
  let writeable = fs.createWriteStream(dist);

  let tmpPath = config.tmpPath;
  let dir = path.resolve(__dirname, tmpPath, sessionId);

    let urls = utils.readFiles(dir, sessionId) || [];
    
    let urlMap = {};
    urls.forEach((url) => {
      let name = path.basename(url);
      urlMap[name] = url;
    });

    urls = [];

    for(let key in urlMap){
      let url = urlMap[key];
      urls.push(url);
    }

    let index = 0;
    let merge = (urls, callback) => {
      let mergeProcess = (url) => {
        let readable = fs.createReadStream(url);
        readable.on('data', function(chunk) {
          writeable.write(chunk);
        });
        readable.on('end', () => {
          index += 1;
          if (index < urls.length) {
            merge(urls, callback);
          } else {
            callback();
          }
        });
      };
      mergeProcess(urls[index], callback);
    };

    merge(urls, () => {
      utils.rmdir({
        dir,
        urls
      });
      writeable.end();
      callback();
    });
};

let RangeUtils = {
  set: (sessionId, data) => {
    RangeConf[sessionId] = data;
    fs.writeFileSync(config.rangeConf, utils.prettyJSON(RangeConf));
  },
  remove: (sessionId) => {
    delete RangeConf[sessionId];
    fs.writeFileSync(config.rangeConf, utils.prettyJSON(RangeConf));
  }
};


function Downloader(params){
  params = utils.copy(params);
  let file = params.file;
  let fileRange = RangeConf[file.uId] || {};

  let offset = fileRange.offset || 0;
  file.offset =  offset;
  //起始值是 0，续传 seq 以 offset 开始，seq 意为分片下载顺序
  file.seq = fileRange.seq || 0;

  let callbacks = params.callbacks;
  let loaded = offset;
  /*  
    let file = {
      url: '',
      seq: 1,
      size: 30 * 1024 * 1024,
      
    };
    let opts = {
      sessionId: 'kdkdksldkj',
      headers: {
    
      },
      chunkSize: 1 * 1024 * 1024
    }
    download(file, opts, {
      onchunkloaded: () => {
    
      },
      onsuccess: (ret) => {
      
      }
    });
  */
  let download = (opts, callbacks) => {
      let currentLoaded = 0;

      let method = opts.method || 'GET';

      let headers = opts.headers;
      let chunkSize = opts.chunkSize;
      let sessionId = opts.sessionId;
      let seq = opts.seq;

      let url = file.url;
      let size = file.size;
      let uId = file.uId; 

      let _success = (response) => {
        if (chunkSize == currentLoaded) {
          callbacks.onchunkloaded({
            total: size,
            offset: loaded,
            sessionId,
            code: response.statusCode
          });
        }
      };
      let _fail = (response) => {
        callbacks.onerror({
          code: response.statusCode,
          msg: response.body
        });
      };
      let resMap = {
        200: _success,
        206: _success
      };
      let req = request({
        method: method,
        url: url,
        headers: headers
      }, (error, response) => {
          let code = response.statusCode;
          (resMap[code] || _fail)(response);
      });

      callbacks.onbeforechunkloaded({
        req,
        uId
      });

      let tpl = '{tmpPath}/{sessionId}';
      let tmpPath = config.tmpPath;
      let filePath = utils.tplEngine(tpl, {
        tmpPath,
        sessionId
      });

      let isExists = fs.existsSync(filePath);

      if (!isExists) {
        fs.mkdirSync(filePath);
      }

      tpl = '{filePath}/{name}';
      filePath = utils.tplEngine(tpl, {
        filePath,
        name: seq
      });

      let origin = fs.createWriteStream(filePath);

      let onclose = (data) => {
      };

      req.pipe(origin).on('close', onclose);

      req.on('response', (res) => {
        req.on('data', (chunk) => {
          loaded += chunk.length;
          currentLoaded += chunk.length;

          callbacks.onprogress({
            total: size,
            loaded: loaded,
          });
        });
      });
  };
  /*
    文件名称
    file.name
    
    下载到本地位置
    file.dist
    
    远程资源路径
    file.url 

    文件总大小
    file.size
    
    每片大小（字节）
    file.chunkSize

    callbacks.onsuccess

    callbacks.onchunkloaded

    callbacks.onerror
  */
  this.downloadChunk = () => {
    let that = this;
    let offset = file.offset;
    //断点下载，临时文件名以 offset 命名，保证文件顺序从旧到新
    let seq = file.seq;

    let sessionId = file.uId ||utils.getUId();

    let _process = () => {
      let dist = file.dist;

      let name = file.name;
      let url = file.url;
      let uId = file.uId;

      let size = file.size;
      let chunkSize = file.chunkSize;

      let currChunkSize = Math.min(chunkSize, size - offset);

      let start = offset;
      let end = (offset + currChunkSize - 1);
      let rangeTpl = 'bytes={start}-{end}';
      let range = utils.tplEngine(rangeTpl, {
        start,
        end
      });

      offset += currChunkSize;
      seq += 1;

      let _opts = {
        seq,
        sessionId,
        chunkSize: currChunkSize,
        headers: {
          'Range': range,
          'X-File-TransactionId': sessionId,
          'X-File-Total-Size': size
        }
      };

      console.log(range);

      let _callbacks = {
        onprogress: callbacks.onprogress,
        onerror: callbacks.onerror,
        onchunkloaded: (res) => {
          callbacks.onchunkloaded(res);
          let isLoop = (offset < size && res.code == 206);
          if (isLoop) {
            RangeUtils.set(sessionId, {
              offset,
              seq
            });
            _process();
          } else {
            let params = {
              name: name,
              dist: dist,
              sessionId: sessionId
            };
            RangeUtils.remove(sessionId);
            mergeFile(params, function(){
              callbacks.onsuccess({ dist: dist });
            });
          }
        },
        onsuccess: () => {
          callbacks.onsuccess();
        },
        onbeforechunkloaded: (res) => {
          callbacks.onbeforechunkloaded(res);
        }
      };

      download(_opts, _callbacks);
    };

    _process();
  };
}

module.exports = {
  Downloader
}