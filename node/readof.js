var request = require('request');
var fs = require('fs');

exports.read = (params, callback) => {
    var url = params.url;
    request
        .get(url)
        .on('response', (response) => {
            var resultBuffer = new Buffer(response.headers["content-length"] * 1 + 2);
            var buffers = [];

            response.on('end', () => {
                var i = 0,
                    size = buffers.length,
                    pos = 0;
                for (i = 0; i < size; i++) {
                    buffers[i].copy(resultBuffer, pos);
                    pos += buffers[i].length;
                }
                var error = null;
                callback(error, resultBuffer);
            });

            response.on('data', (chunk) => {
                buffers.push(new Buffer(chunk));
            });

        });
};