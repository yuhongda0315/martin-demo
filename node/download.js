"use strict"

const request = require('request');
const fs = require('fs');
const superagent = require('superagent');
const path = require('path');

let genUId = () => {
  var date = new Date().getTime();
  var uuid = 'xxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

let readFile = (url) => {
  let urls = [];
  let files = fs.readdirSync(url);
  files.forEach(function(filename) {
    let fileUrl = path.join(url, filename);
    let stats = fs.statSync(fileUrl);
    if (stats.isFile()) {
      urls.push(url + '/' + filename);
    }
  });
  return urls;
}

let rmdir = (dir) => {

};

let download = (file, callbacks) => {

  let total = 0;
  let loaded = 0;

  let method = 'GET';
  let url = file.url;
  let headers = file.headers;
  let seq = file.seq;
  let chunkSize = file.chunkSize;
  let size = file.size;
  let uname = file.uname;

  let transactionId = ''
  let req = request({
    method: method,
    url: url,
    headers: headers
  });

  let origin = '/Applications/work/martin-demo/node/files/' + uname;

  let isExists = fs.existsSync(origin);

  if (!isExists) {
    fs.mkdirSync(origin);
  }

  origin += '/' + seq;

  origin = fs.createWriteStream(origin);

  var onclose = () => {
    callbacks.onsuccess();
  };

  req.pipe(origin).on('close', onclose);

  req.on('response', (res) => {
    total = parseInt(res.headers['content-length']);

    req.on('data', (chunk) => {
      loaded += chunk.length;
      // callbacks.onsuccess({
      //  total,
      //  loaded,
      //  chunk
      // });
      if (chunkSize == loaded) {
        callbacks.ondownload(res.statusCode);
      }
    });


  });

  req.on('error', (error) => {
    console.log('error', error);
  });
};

let offset = 0;
let seq = 0;
let downloadNextChunk = (file, callbacks) => {

  let uname = file.uname;
  let name = file.name;
  let url = file.url;

  let size = file.size;
  let chunkSize = file.chunkSize;

  var curChunkSize = Math.min(chunkSize, size - offset);
  var range = 'bytes=' + offset + '-' + (offset + curChunkSize - 1);
  offset += curChunkSize;

  download({
    url: url,
    seq: seq++,
    chunkSize: curChunkSize,
    uname: uname,
    size: size,
    headers: {
      'Range': range,
      'X-File-TransactionId': uname,
      'X-File-Total-Size': size
    }
  }, {
    ondownload: (code) => {
      console.log(offset, size);
      if (offset < size && code == 206) {
        downloadNextChunk(file, callbacks);
      } else {
        offset = 0;
        seq = 0;
        callbacks.onsuccess({ uname: uname });
      }
    }
  });
};

var dist = './files/';
var filename = 'emoji.zip';
downloadNextChunk({
  size: 369302,
  chunkSize: 100000,
  uname: genUId(),
  url: 'http://api-test.rcx.rongcloud.cn:8086/2fio79n5qdw1Y6jv2fio79n-5BvZ_Qo5/blob'
}, {
  onsuccess: (ret) => {
    let writeable = fs.createWriteStream(dist + filename);

    var uris = readFile('./files/' + ret.uname);

    let index = 0;
    let merge = (uris, callback) => {
      let mergeProcess = (uri) => {
        var readable = fs.createReadStream(uri);
        readable.on('data', function(chunk) {
          writeable.write(chunk);
        });
        readable.on('end', () => {
          index += 1;
          if (index < uris.length) {
            merge(uris, callback);
          } else {
            callback();
          }
        });
      };
      mergeProcess(uris[index], callback);
    };

    merge(uris, () => {
      console.log('download successfully.');
      uris.forEach((uri) => {
        fs.unlinkSync(uri);
      });
      fs.rmdirSync(dist + ret.uname);
    });
  }
});