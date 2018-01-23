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
  readFiles: (url) => {
    let urls = [];
    let files = fs.readdirSync(url);
    files.forEach(function(name) {
      let fileUrl = path.join(url, name);
      let stats = fs.statSync(fileUrl);
      let tpl = '{url}/{name}';
      if (stats.isFile()) {
        urls.push(utils.tplEngine(tpl, { url, name }));
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
    fs.rmdirSync(dir);
  }
};

let config = {
	tmpPath: '/Applications/work/martin-demo/node/tmp-files'
}

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

let loaded = 0;

let download = (file, opts, callbacks) => {
  let currentLoaded = 0;

  let method = opts.method || 'GET';

  let headers = opts.headers;
  let chunkSize = opts.chunkSize;
  let sessionId = opts.sessionId;

  let url = file.url;
  let seq = file.seq;
  let size = file.size;
  

  let req = request({
    method: method,
    url: url,
    headers: headers
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

  let onclose = () => {
    callbacks.onsuccess();
  };

  req.pipe(origin).on('close', onclose);

  req.on('response', (res) => {
    req.on('data', (chunk) => {
      loaded += chunk.length;
      currentLoaded += chunk.length;

      callbacks.onprogress({
        total: size,
        loaded,
      });

      if (chunkSize == currentLoaded) {
        callbacks.onchunkloaded({
          total: size,
          offset: loaded,
          sessionId,
          code: res.statusCode
        });
      }
    });
  });

  req.on('error', (error) => {
    console.log('error', error);
  });
};

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
	let dir = '{tmpPath}/{sessionId}';
	dir = utils.tplEngine(dir, {
		tmpPath,
		sessionId
	});

    var urls = utils.readFiles(dir);

    let index = 0;
    let merge = (urls, callback) => {
      let mergeProcess = (uri) => {
        var readable = fs.createReadStream(uri);
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
    	callback();
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

*/


let downloadChunk = (file, callbacks) => {
  let offset = file.offset || 0;
  //断点下载，临时文件名以 offset 命名，保证文件顺序从旧到新
  let seq = file.offset || 0;

	let sessionId = utils.getUId();

	let _process = (file, callbacks) => {
		let dist = file.dist;

		let name = file.name;
		let url = file.url;

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

		let _file = {
			url,
			seq,
			size
		};

		let _opts = {
			sessionId,
			chunkSize: currChunkSize,
			headers: {
			  'Range': range,
			  'X-File-TransactionId': sessionId,
			  'X-File-Total-Size': size
			}
		};

		let _callbacks = {
      onprogress: callbacks.onprogress,
			onchunkloaded: (res) => {
        callbacks.onchunkloaded(res);
        let isLoop = (offset < size && res.code == 206);
        if (isLoop) {
          _process(file, callbacks);
        } else {
          offset = 0;
          seq = 0;
          
          let params = {
            name: name,
            dist: dist,
            sessionId: sessionId
          };
          mergeFile(params, function(){
            callbacks.onsuccess({ dist: dist });
          });
        }
			}
		};

	  download(_file, _opts, _callbacks);
	};

	_process(file, callbacks);
	
};

module.exports = {
	downloadChunk
}
