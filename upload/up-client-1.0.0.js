var UploadClient = (function(win) {
    var calcPosition = function(height, width, opts) {
        var isheight = width < height,
            scale = isheight ? height / width : width / height;
        var zoom, x = 0,
            y = 0,
            w, h;
        if (scale > opts.scale) {
            if (isheight) {
                zoom = width / 100;
                w = 100;
                h = height / zoom;
                y = (h - 240) / 2;
            } else {
                zoom = height / 100;
                h = 100;
                w = width / zoom;
                x = (w - 240) / 2;
            }
        } else {
            if (isheight) {
                zoom = height / 240;
                h = 240;
                w = width / zoom;
            } else {
                zoom = width / 240;
                w = 240;
                h = height / zoom;
            }
        }
        return {
            w: w,
            h: h,
            x: -x,
            y: -y
        };
    };

    var getBlobUrl = function(file) {
        var URL = window.URL || window.webkitURL;
        return URL ? URL.createObjectURL(file) : "";
    };

    var getThumbnail = function(file, opts, callback) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
            var pos = calcPosition(img.width, img.height, opts);
            var width = opts.width;
            var height = opts.height;
            canvas.width = pos.w > width ? width : pos.w;
            canvas.height = pos.h > height ? height : pos.h;
            context.drawImage(img, pos.x, pos.y, pos.w, pos.h);
            try {
                var base64 = canvas.toDataURL(file.type, opts.quality);
                var reg = new RegExp('^data:image/[^;]+;base64,');
                base64 = base64.replace(reg, '');
                callback(base64);
            } catch (e) {
                throw new Error(e);
            }
        };
        img.src = typeof file == 'string' ? 'data:image/png;base64,' + file : getBlobUrl(file);
    };

    var _compressBase64 = function(base64, opts, callback) {
        getThumbnail(base64, opts, callback);
    };

    var _compressFile = function(file, opts, callback) {
        getThumbnail(file, opts, callback);
    };

    var _compress = function(data, callback) {
        var file = data.file;
        var opts = data.compress;
        var getThumb = typeof file == 'string' ? _compressBase64 : _compressFile;
        getThumb(file, opts, callback);
    };

    _init = function(config, callback) {
        config.getToken(function(token) {
            config.multi_parmas || (config.multi_parmas = {});
            config.multi_parmas.token = token;
            config.headers || (config.headers = {});
            if (config.base64) {
                config.headers['Content-type'] = 'application/octet-stream';
                config.headers['Authorization'] = 'UpToken ' + token;
            }
            var instance = UploadFile.init(config);
            callback(instance);
        });
    };

    var _upload = function(data, instance, callback) {
        instance.upload(data.file, {
            onError: function(errorCode) {
                callback.onError(errorCode);
            },
            onProgress: function(loaded, total) {
                callback.onProgress(loaded, total);
            },
            onCompleted: function(result) {
                result.filename || (result.filename = result.hash);
                var compress = config.compressThumbnail || _compress;
                if (data.compress) {
                    compress(data, function(thumbnail) {
                        result.thumbnail = thumbnail;
                        callback.onCompleted(result);
                    });
                } else {
                    callback.onCompleted(result);
                }

                // if (!config.getUrl) {
                //     throw new Error('getUrl is undefined.');
                // }
                // var params = {
                //     uname: result.filename,
                //     oriname: result.name
                // };
                // config.getUrl(params, function(url) {
                //     result.url = url;
                //     var compress = config.compressThumbnail || _compress;
                //     if (data.compress) {
                //         compress(data, function(thumbnail) {
                //             result.thumbnail = thumbnail;
                //             callback.onCompleted(result);
                //         });
                //     } else {
                //         callback.onCompleted(result);
                //     }
                // });
            }
        });
    };
    /**
     * 自定义获取 token 的方法
     * config.getToken(callback)
     * 自定义获取 url 方法
     * config.getUrl(callback)
     */
    var uploadFile = function(file, config, callback) {
        _init(config, function(instance) {
            var data = {
                file: file
            };
            _upload(data, instance, callback);
        });
    };

    var uploadImage = function(file, config, callback) {
        _init(config, function(instance) {
            var data = {
                file: file,
                compress: {
                    height: config.height || 240,
                    width: config.width || 240,
                    quality: config.quality || 0.5,
                    scale: config.scale || 2.4
                }
            };
            _upload(data, instance, callback);
        });
    };

    var uploadImgBase64 = function(base64, config, callback) {
        config.base64 = true;
        _init(config, function(instance) {
            var data = {
                file: base64,
                compress: {
                    height: config.height || 240,
                    width: config.width || 240,
                    quality: config.quality || 0.5,
                    scale: config.scale || 2.4
                }
            };
            _upload(data, instance, callback);
        });
    };

    return {
        uploadFile: uploadFile,
        uploadImage: uploadImage,
        uploadImgBase64: uploadImgBase64,
        dataType: UploadFile.dataType
    };
})(window);