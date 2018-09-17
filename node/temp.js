"use strict";

var RongSDK = require('rongcloud-sdk')({
    appkey: 'ik1qhw016ns2p',
    secret: 'nksE31jCRo4s74q673Pwx0',
    api: 'http://dev-hainengda.rongcloud.net:83'
});

var User = RongSDK.User;
var Group = RongSDK.Group;
var user = {
  id: 'member1',
  name: 'member1',
  portrait: 'portrait'
};
User.register(user).then(result => {
  console.log(result);
}, error => { 
  console.log(error);
});

var user = {
  id: 'member2',
  name: 'member2',
  portrait: 'portrait'
};
User.register(user).then(result => {
  console.log(result);
}, error => { 
  console.log(error);
});

var user = {
  id: 'member3',
  name: 'member3',
  portrait: 'portrait'
};
User.register(user).then(result => {
  console.log(result);
}, error => { 
  console.log(error);
});

var group = {
	id: 'groupCall001',
	name: 'groupCall',
	members: [{
		id: 'member1'
	},{
		id: 'member2'
	},{
		id: 'member3'
	}]
};
Group.create(group).then(result => {
	console.log(result);
}, error => {
	console.log(error);
});
