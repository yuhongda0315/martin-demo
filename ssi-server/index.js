var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var RL = require('readline');

var mime = require('./lib/mime');
var config = require('./config.json');

var utils = {
	isEmpty: (obj) => {
		var stringify = JSON.stringify;
		return stringify(obj) == stringify({});
	}
};

var baseDir = config.baseDir;

var props = config.props;

var types = config.types;

var port = config.port;

/*
	/(\svirtual="|\sfiles=")(([a-zA-Z0-9]*\/)*[a-zA-Z]*.html)"/g;	
*/
var getPathReg = () => {
	var reg = '\\s' + props.join('="|\\s') + '="';
	reg = '(' + reg + ')(([a-zA-Z0-9-]*\/)*[a-zA-Z-]*.html)"';
	return new RegExp(reg, 'g');
};

var getTypesReg = () => {
	var reg = types.join('|');
	return new RegExp(reg, 'i');
};

var parseContent = (params, callback) => {
	var reg = /<!--[ ]*#([a-z]+)([ ]+([a-z]+)="(.+?)")*[ ]*-->/g;
	var pathReg = getPathReg();

	var getUrls = (params) => {
		var arrs = params.arrs;
		var prefix = params.prefix;
		var result = [];
		arrs.map((v) => {
			return v.replace(reg, (m, expr, props) => {
				result.push({
					prefix: prefix + '/',
					inc: props.replace(pathReg, '$2')
				});
			});
		});
		return result;
	};


	var contentMap = {};
	var fileMap = {};

	var parse = (params) => {
		var inc = params.inc;
		var content = contentMap[inc] || params;

		content = content.replace(reg, (m, expr, props) => {
			var inc = props.replace(pathReg, '$2');
			return contentMap[inc];
		});

		var matches = content.match(reg) || [];
		var hasInclude = (matches.length > 0);

		if (hasInclude) {
			content = parse(content);
		}
		return content;
	};

	var read = (params, callback) => {
		var result = '';
		var url = params.url;
		var inc = params.inc;

		var readFile = fs.createReadStream(url);
		var readline = RL.createInterface({
			input: readFile
		});

		readline.on('line', (row) => {
			var matches = row.match(reg) || [];
			var hasInclude = (matches.length > 0);
			if (hasInclude) {
				var urls = getUrls({
					prefix: path.dirname(url),
					arrs: matches
				});
				urls.forEach((url) => {
					var inc = url.inc;
					var fileUrl = url.prefix + inc;
					fileMap[inc] = 1;
					read({
						url: fileUrl,
						inc: inc
					}, callback);
				});
			}
			result += row;
		});

		readline.on('close', () => {
			contentMap[inc] = result;
			delete fileMap[inc];
			if (utils.isEmpty(fileMap)) {
				callback();
			}
		});
	};


	read(params, () => {
		var content = parse(params);
		callback(content);
	});
};

var sendResp = (res, params) => {
	var type = params.type,
		content = params.content,
		code = params.code;

	var body = {};
	if (type) {
		body['Content-type'] = type;
	}
	res.writeHead(code, body);
	res.end(content);
};

http.createServer(function(req, res) {

	var reqUrl = decodeURIComponent(req.url);

	var urlObj = url.parse(reqUrl);

	var pathname = urlObj.pathname;

	var extension = path.extname(pathname);

	var contentType = mime[extension] || 'text/plain';

	var resFile = pathname;

	resFile = path.join(baseDir, resFile);

	fs.readFile(resFile, function(err, data) {
		if (err) {
			return sendResp(res, {
				code: 200,
				type: contentType,
				content: JSON.stringify(err)
			});
		}

		var typesReg = getTypesReg();
		var isInc = typesReg.test(contentType);
		if (!isInc) {
			return sendResp(res, {
				code: 200,
				type: contentType,
				content: data
			});
		}
		var params = {
			url: resFile,
			inc: pathname
		};
		parseContent(params, (content) => {
			return sendResp(res, {
				code: 200,
				type: 'text/html',
				content: content
			});
		});

	});

}).listen(port);