var fs = require('fs');
var RL = require('readline');
var path = require('path');


var config = require('../config.json');
// var fileName = './index.html';
// var readFile = fs.createReadStream(fileName);  

// var readline = RL.createInterface({  
//     input: readFile  
// });

// var index = 1;  
// readline.on('line', (content)=>{  
// 	content += "<<<<<<<"
//     console.log(content);
//     index ++;  
// });  
  
// readline.on('close', ()=>{  
//     console.log('readline end...');  
// }); 

var props = config.props;

var getPathReg = () =>{
	var reg = '\\s' + props.join('="|\\s') + '="';
	reg = '(' + reg + ')(([a-zA-Z0-9-]*\/)*[a-zA-Z-]*.html)"';
	return new RegExp(reg, 'g');	
};

var parseContent = (params) => {
	var reg = /<!--[ ]*#([a-z]+)([ ]+([a-z]+)="(.+?)")*[ ]*-->/g;
	var pathReg = getPathReg();
	
	var result = '';
	
	var promiseList = [];
	var getUrls = (params) => {
		var arrs = params.arrs;
		var prefix = params.prefix;
		return arrs.map((v) => {
			return v.replace(reg, (m, expr, props) => {
				return prefix + '/' + props.replace(pathReg, '$2');
			});
		});
	};

	var read = (params) => {
		var url = params.url;
		var promise = new Promise((resolve, reject) => {
			var readFile = fs.createReadStream(url);  

			var readline = RL.createInterface({  
			    input: readFile  
			});  

			var index = 1;  
			readline.on('line', (content)=>{ 
				var matches = content.match(reg) || [];
				var hasInclude = (matches.length > 0);
				if (hasInclude) {
					var urls = getUrls({prefix: path.dirname(url), arrs: matches})
					urls.forEach((url) => {
						read({
							url: url
						});
					});
				}

				result += content;
			    index ++;  
			});  
			  
			readline.on('close', ()=>{  
			    resolve(result); 
			}); 
		});
		promiseList.push(promise);
	};

	read(params);

	var promise = new Promise((resolve, reject) => {
		Promise.all(promiseList).then((content) => {
			resolve(content);
		});
	});
	return promise;
};


parseContent({url: 'index.html'}).then((content) => {
	console.log(content);
});
