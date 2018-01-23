"use strict";

let downLoad = require('./range-download').downloadChunk;
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
*/
downLoad({
	name: '需求.zip',
	dist: '/Applications/work/martin-demo/node/zip-test',
	url: 'http://api-test.rcx.rongcloud.cn:8086/6pEhEuqQICEGCiES6pEhEuqd1yzqR_bt/blob',
	size: 14079935,
	chunkSize: 5 * 1024 * 1024
}, {
	onsuccess: () => {
		console.log('download successfully.');
	},
	onprogress: (ret) => {
		console.log(ret.loaded, ret.total);
	},
	onchunkloaded: (ret) => {
		console.log(ret);
	}
});