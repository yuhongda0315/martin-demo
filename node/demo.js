"use strict";

let Downloader = require('./range-download').Downloader;
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

let params = {
	file: {
		name: '需求-9901.zip',
		dist: '/Applications/work/martin-demo/node/zip-test',
		url: 'https://dj-poc.rongcloud.net:1446/8xoekPMbH6MfhR6Q8xoekOOWXW_zW_nL/blob',
		size: 4319003,
		chunkSize: 1 * 1024 * 1024,
		uId: 'martin0---1'
	}, 
	callbacks: {
		onsuccess: () => {
			console.log('download successfully.');
		},
		onprogress: (ret) => {
			//console.log(ret.loaded, ret.total);
		},
		onchunkloaded: (ret) => {
			//console.log(ret);
		},
		onerror: (error) => {
			console.log(error);
		},
		onbeforechunkloaded: (ret) => {
			//console.log(ret);
		}
	}
};

let downloader = new Downloader(params);
downloader.downloadChunk();

// downLoad({
// 	name: '需求-9901.zip',
// 	dist: '/Applications/work/martin-demo/node/zip-test',
// 	url: 'https://dj-poc.rongcloud.net:1446/NgWaBTYEmzbanpoFNgWaBTWU_RE2RH1e/blob',
// 	size: 4319003,
// 	chunkSize: 1 * 1024 * 1024
// }, {
// 	onsuccess: () => {
// 		console.log('download successfully.');
// 	},
// 	onprogress: (ret) => {
// 		//console.log(ret.loaded, ret.total);
// 	},
// 	onchunkloaded: (ret) => {
// 		//console.log(ret);
// 	},
// 	onerror: (error) => {
// 		console.log(error);
// 	},
// 	onbeforechunkloaded: (ret) => {
// 		//console.log(ret);
// 	}
// });

/*
name: '需求-9901.zip',
	dist: '/Applications/work/martin-demo/node/zip-test',
	url: 'http://120.92.88.18:8086/GkmD2hpIgun21YPaGkmD2hpRUQMaWWbR/blob',
	size: 1107147,
	chunkSize: 1 * 1024 * 1024

*/

/*
name: '需求-9901.zip',
	dist: '/Applications/work/martin-demo/node/zip-test',
	url: 'https://dj-poc.rongcloud.net:1446/NgWaBTYEmzbanpoFNgWaBTWU_RE2RH1e/blob',
	size: 4319003,
	chunkSize: 4 * 1024 * 1024
*/

// let mergeFile = require('./range-download').mergeFile;
// let path = require('path');

// let params = {
// 	name: '10.jpg',
// 	dist: '/Applications/work/martin-demo/node/zip-test',
// 	sessionId: '6e46d64cfa8175512f'
// };

// mergeFile(params, function(ret){
// 	console.log(ret);
// });