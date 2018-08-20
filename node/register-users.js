"use strict";

var fs = require('fs');

var RongSDK = require('rongcloud-sdk')({
    appkey: 'tdrvipkstfsu5',
    secret: 'Sv8bVhjYZ6'
});

var User = RongSDK.User;

var getUser = (id) => {
  var xingList = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张于";
  var xingSize = xingList.length;

  var nameList = "梦琪忆柳之桃慕青问兰尔岚元香初夏沛菡傲珊曼文乐菱痴珊恨玉惜文香寒新柔语蓉海安夜蓉涵柏水桃醉蓝春儿语琴从彤傲晴语兰又菱碧彤元霜怜梦紫寒妙彤曼易南莲紫翠雨寒易烟如萱若南寻真晓亦向珊慕灵以蕊寻雁映易雪柳孤岚笑霜海云";
  var nameSize = nameList.length;
  var portraits = [
    'https://rongcloud-image.cn.ronghub.com/fa33294a358e7f2abf.gif?e=2147483647&token=CddrKW5AbOMQaDRwc3ReDNvo3-sL_SO1fSUBKV3H:z2QkbpEqUEMrOPrJtV3tBP4gQYo=',
    'http://7xogjk.com1.z0.glb.clouddn.com/01fac54313ad977d6e.gif',
    'https://rongcloud-image.cn.ronghub.com/2fcdba4205860a63fb.gif?e=2147483647&token=livk5rb3__JZjCtEiMxXpQ8QscLxbNLehwhHySnX:m7S0ADf1E-d2bIG3E0vuiZJSH_w=',
    'http://oqekw07cj.bkt.clouddn.com/9da99c4255a24baba1.gif',
    'http://2f.zol-img.com.cn/product/172_100x75/267/cepP02EKJTV6.gif',
    'https://fsprodrcx.cn.ronghub.com/lVMs15VSLeR47CzXlVMs15VbxLGVULo2/timg.gif',
    'https://fsprodrcx.cn.ronghub.com/FmUv4RZmLtL72i_hFmUv4RYqrWMWbCI7/timg+%284%29.gif',
    'https://fsprodrcx.cn.ronghub.com/vJiff7ybnkxRJ59_vJiff7zADyO8gW0a/timg+%285%29.gif',
    'https://fsprodrcx.cn.ronghub.com/5FJuo-RTb5AJ7W6j5FJuo-Rf_-_kU162/timg+%283%29.gif',
    'https://fsprodrcx.cn.ronghub.com/Jx-MkScejaLKoIyRJx-MkScT89YnHp6U/timg+%282%29.gif',
    'https://fsprodrcx.cn.ronghub.com/pQjyn6UJ86xIt_KfpQjyn6UGM_6lDaO-/timg+%281%29.gif',
    'https://fsprodrcx.cn.ronghub.com/1T1xVdU_cGY4gnFV1T1xVdUFyRPVM_4N/test.gif',
    'https://fsprodrcx.cn.ronghub.com/yn2CV8p8g2QnwoJXyn2CV8ppkNXKdrNS/1512691986120.gif',
    'https://fsprodrcx.cn.ronghub.com/B0qmIAdLpxPq9aYgB0qmIAdV5acHSrhp/timg.jpeg'
  ];

  var portraitSize = portraits.length;

  var getIndex = (max) => {
    return Math.floor(Math.random() * max);
  };

  var getName = (len) => {
    var names = [];
    for (var i = 0; i < len; i++) {
      var index = getIndex(nameSize);
      names.push(nameList[index]);
    }
    return names.join('');
  };


  var getXing = (index) => {
    return xingList.split('')[index];
  };

  var getPortrait = (index) => {
    return portraits[index];
  };

  var getNameLen = () => {
    return Math.floor(Math.random() * 2) || 2;
  };

  var name = getName(getNameLen());

  var xingIndex = getIndex(portraitSize);
  var xing = getXing(xingIndex);

  var portraitIndex = getIndex(portraitSize);
  var portrait = getPortrait(portraitIndex);


  return {
    id: id,
    name: xing + name,
    portrait: portrait
  };
};

var prettyJSON = (content) => {
  return JSON.stringify(content, null, 4)
};

var userCount = 1;
var Cache = {
  users: []
};
var getToken = () => {
  var userId = 'number' + userCount;

  var user = getUser(userId);
  User.register(user).then(result => {
    user.token = result.token;
    console.log(user);
    Cache.users.push(user);
    if (userCount < 100) {
      userCount++;
      getToken();
    }else{
      fs.writeFileSync('./users.json', prettyJSON(Cache));
    }
  }, error => { 
    console.log(error);
  });
};

getToken();

 