var express      = require('express')
var url          = require('url');

var app = express()
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var friends = {"code":200,"result":[{"displayName":"","message":"我是施剑峰","status":20,"updatedAt":"2016-11-25T06:48:36.000Z","user":{"id":"OIBbeKlkx","nickname":"施剑峰","region":"86","phone":"18500682675","portraitUri":""}},{"displayName":"","message":"","status":20,"updatedAt":"2016-10-18T04:32:09.000Z","user":{"id":"675NdFjkx","nickname":"杨川","region":"86","phone":"18201252063","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","message":"杨攀","status":20,"updatedAt":"2016-06-27T03:13:22.000Z","user":{"id":"ImgEatRGU","nickname":"杨攀","region":"86","phone":"13911558980","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/ImgEatRGU1463128238995328857"}},{"displayName":"","message":"","status":20,"updatedAt":"2016-03-02T07:09:30.000Z","user":{"id":"mi8t76DVu","nickname":"吕朋","region":"86","phone":"13521935282","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934"}}]};

app.get('/friendship/all',function(req,res,next){
  res.send(friends);
  next();
});

var groups = {"code":200,"result":[{"role":1,"group":{"id":"Uz6Sw8GXx","name":"web.","portraitUri":"","creatorId":"675NdFjkx","memberCount":5,"maxMemberCount":500}},{"role":1,"group":{"id":"675NdFjkx","name":"产品研发部","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1466575289048886963","creatorId":"Uz6Sw8GXx","memberCount":76,"maxMemberCount":500}},{"role":1,"group":{"id":"7crjBbeZ5","name":"test2222","portraitUri":"","creatorId":"MfgILRowx","memberCount":3,"maxMemberCount":500}},{"role":1,"group":{"id":"D6Vh5Io7W","name":"Web 中心","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FliXi6zl_U3YJF6K1DkZsY51trWw","creatorId":"Tp6nLyUKX","memberCount":13,"maxMemberCount":500}},{"role":1,"group":{"id":"nzrbOKBdE","name":"SealTalk项目","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fve8fCFBAcQKBVMytJD0dF5X_VMl","creatorId":"Tp6nLyUKX","memberCount":21,"maxMemberCount":500}},{"role":1,"group":{"id":"0KYWsPa17","name":"大融云","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570117209114014","creatorId":"Tp6nLyUKX","memberCount":104,"maxMemberCount":500}}]};
app.get('/user/groups', function(req, res, next){
  res.send(groups);
  next();
});

var groupMembers = {
      'Uz6Sw8GXx':{"code":200,"result":[{"displayName":"","role":0,"createdAt":"2016-03-01T09:38:08.000Z","updatedAt":"2016-03-01T09:38:08.000Z","user":{"id":"675NdFjkx","nickname":"杨川","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","role":1,"createdAt":"2016-03-01T09:38:08.000Z","updatedAt":"2016-03-01T09:38:08.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":1,"createdAt":"2016-03-01T09:38:08.000Z","updatedAt":"2016-03-01T10:03:16.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}},{"displayName":"","role":1,"createdAt":"2016-09-21T14:22:02.000Z","updatedAt":"2016-09-21T14:22:02.000Z","user":{"id":"lUHLA1jod","nickname":"薛争锋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrMzQAt-JEJIwnYWRc885UEGB6il"}},{"displayName":"","role":1,"createdAt":"2016-11-22T08:36:51.000Z","updatedAt":"2016-11-22T08:36:51.000Z","user":{"id":"wmlPKfEUc","nickname":"赵福运","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrestOvUh4089mmpHSGnz5-dUqcr"}}]},
      '675NdFjkx':{"code":200,"result":[{"displayName":"","role":1,"createdAt":"2016-06-23T03:43:18.000Z","updatedAt":"2016-06-23T03:43:18.000Z","user":{"id":"OIBbeKlkx","nickname":"施剑峰","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-06T04:09:04.000Z","updatedAt":"2016-06-06T04:09:04.000Z","user":{"id":"675NdFjkx","nickname":"杨川","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:29:40.000Z","updatedAt":"2016-06-22T05:29:40.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":0,"createdAt":"2016-02-29T12:26:58.000Z","updatedAt":"2016-02-29T12:26:58.000Z","user":{"id":"Uz6Sw8GXx","nickname":"郑英君","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957"}},{"displayName":"","role":1,"createdAt":"2016-02-29T12:26:58.000Z","updatedAt":"2016-06-28T07:25:02.000Z","user":{"id":"hMjCbic6U","nickname":"fanghe","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/hMjCbic6U1466779768249026123"}},{"displayName":"","role":1,"createdAt":"2016-02-29T12:26:58.000Z","updatedAt":"2016-02-29T12:26:58.000Z","user":{"id":"ImgEatRGU","nickname":"杨攀","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/ImgEatRGU1463128238995328857"}},{"displayName":"","role":1,"createdAt":"2016-02-29T12:26:58.000Z","updatedAt":"2016-02-29T12:26:58.000Z","user":{"id":"mi8t76DVu","nickname":"吕朋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934"}},{"displayName":"","role":1,"createdAt":"2016-03-01T07:13:30.000Z","updatedAt":"2016-03-01T07:13:30.000Z","user":{"id":"GC2lr3GPu","nickname":"王平","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T07:05:59.000Z","updatedAt":"2016-03-01T07:05:59.000Z","user":{"id":"YMFYnvxNu","nickname":"岑裕","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:14:49.000Z","updatedAt":"2016-03-01T06:14:49.000Z","user":{"id":"AIq9Pk0Eu","nickname":"师帅","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:17:55.000Z","updatedAt":"2016-03-01T06:17:55.000Z","user":{"id":"pxwX92h1u","nickname":"李恩海","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/pxwX92h1u1480592195057355957"}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:29:40.000Z","updatedAt":"2016-06-22T05:29:40.000Z","user":{"id":"H5YjcPa2k","nickname":"师海阳","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:58:29.000Z","updatedAt":"2016-06-22T04:15:51.000Z","user":{"id":"t1hWCOGvX","nickname":"z阿明","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FtsvvWnAcLeoHFVnRLuQ3hbyZMAC"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:17:55.000Z","updatedAt":"2016-03-01T06:17:55.000Z","user":{"id":"Tp6nLyUKX","nickname":"满少臣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:17:55.000Z","updatedAt":"2016-03-01T06:17:55.000Z","user":{"id":"rOMJ1vQVd","nickname":"张璐","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:17:55.000Z","updatedAt":"2016-03-01T06:17:55.000Z","user":{"id":"zfta479r2","nickname":"周瑞","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FhNGcU1t9fqeY8RNU9YLxB_uC0CW"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:14:49.000Z","updatedAt":"2016-03-01T06:14:49.000Z","user":{"id":"VvnIxO8tV","nickname":"邹岳","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/VvnIxO8tV1466543937625991943"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:57:24.000Z","updatedAt":"2016-06-22T04:57:24.000Z","user":{"id":"DWYHBCA3r","nickname":"王俊","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:17:55.000Z","updatedAt":"2016-03-01T06:17:55.000Z","user":{"id":"nE7j5Hg2U","nickname":"常帅强","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:19:41.000Z","updatedAt":"2016-03-01T06:19:41.000Z","user":{"id":"8ydpAQGf3","nickname":"章颖","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/8ydpAQGf31466593526225904053"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:43:53.000Z","updatedAt":"2016-03-01T06:43:53.000Z","user":{"id":"ZAEFs5BWS","nickname":"张菁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FlU97lSQvja1Q2kDLgl4Orm4Vovw"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:29:47.000Z","updatedAt":"2016-03-01T06:29:47.000Z","user":{"id":"J7XqKPint","nickname":"会会测试","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/J7XqKPint1465875994761060059"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:31:03.000Z","updatedAt":"2016-03-01T06:31:03.000Z","user":{"id":"bgklSBmv3","nickname":"姜辣辣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/bgklSBmv31466593636205681152"}},{"displayName":"","role":1,"createdAt":"2016-03-01T07:27:57.000Z","updatedAt":"2016-03-01T07:27:57.000Z","user":{"id":"CYXf6GNeM","nickname":"杜立召","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/CYXf6GNeM1478592773814176025"}},{"displayName":"","role":1,"createdAt":"2016-03-10T08:50:03.000Z","updatedAt":"2016-03-10T08:50:03.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:45:15.000Z","updatedAt":"2016-03-01T06:45:15.000Z","user":{"id":"LEU82p5Zk","nickname":"李涛","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/LEU82p5Zk1464574166962886963"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:46:29.000Z","updatedAt":"2016-03-01T06:46:29.000Z","user":{"id":"Pbj8ypn4Q","nickname":"周建丽","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Pbj8ypn4Q1466660151351159180"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:48:17.000Z","updatedAt":"2016-03-01T06:48:17.000Z","user":{"id":"v30JWCcQY","nickname":"Jane Chen","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/v30JWCcQY1467084604112441162"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:15:51.000Z","updatedAt":"2016-06-22T04:15:51.000Z","user":{"id":"07JDlu4nE","nickname":"李斐","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/07JDlu4nE1478597604141135986"}},{"displayName":"","role":1,"createdAt":"2016-03-01T06:58:55.000Z","updatedAt":"2016-03-01T06:58:55.000Z","user":{"id":"jkirN8Yfq","nickname":"李小黎","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-07-13T06:38:37.000Z","updatedAt":"2016-07-13T06:38:37.000Z","user":{"id":"E1IoyL5Pj","nickname":"liulin","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/E1IoyL5Pj1474883226760875000"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:15:51.000Z","updatedAt":"2016-06-22T04:15:51.000Z","user":{"id":"iNj2YO4ib","nickname":"张改红","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/iNj2YO4ib1478597318495575928"}},{"displayName":"","role":1,"createdAt":"2016-06-23T03:30:57.000Z","updatedAt":"2016-10-06T01:14:33.000Z","user":{"id":"qGEj03bpP","nickname":"岳军红","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FsZ_Ch_lbZLKlfdoxaDlo70_Bcyi"}},{"displayName":"","role":1,"createdAt":"2016-06-22T08:01:45.000Z","updatedAt":"2016-06-22T08:01:45.000Z","user":{"id":"yl8HaPYDF","nickname":"张宁","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-03-01T08:53:57.000Z","updatedAt":"2016-03-01T08:53:57.000Z","user":{"id":"40qHVS1mE","nickname":"胡君洁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/40qHVS1mE1466594886916926758"}},{"displayName":"","role":1,"createdAt":"2016-07-12T10:44:41.000Z","updatedAt":"2016-07-12T10:44:41.000Z","user":{"id":"QA4oUTH98","nickname":"张雷","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T08:16:15.000Z","updatedAt":"2016-06-22T08:16:15.000Z","user":{"id":"unotDC9VH","nickname":"王成阔","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/unotDC9VH1473837961158452148"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:15:51.000Z","updatedAt":"2016-06-22T04:15:51.000Z","user":{"id":"Bj8i9FSde","nickname":"王珏","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Bj8i9FSde1479293590044522949"}},{"displayName":"","role":1,"createdAt":"2016-06-22T09:14:07.000Z","updatedAt":"2016-06-22T09:14:07.000Z","user":{"id":"BWSZNmXBD","nickname":"刘红艳","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/BWSZNmXBD1479893692484588135"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:57:24.000Z","updatedAt":"2016-06-22T04:57:24.000Z","user":{"id":"kh1Aiyc90","nickname":"魏钦校","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/kh1Aiyc901479641503045092041"}},{"displayName":"","role":1,"createdAt":"2016-06-22T08:01:45.000Z","updatedAt":"2016-06-22T08:01:45.000Z","user":{"id":"cq2SWQOXA","nickname":"杨名","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T10:42:07.000Z","updatedAt":"2016-06-23T10:42:07.000Z","user":{"id":"T8SAQ7jwx","nickname":"田奎","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fta34QQtM96SpSv8zBgYcW9sVLuX"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:15:51.000Z","updatedAt":"2016-06-22T04:15:51.000Z","user":{"id":"w5NUIRwfu","nickname":"陈朗","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FpaJ_Q5yPCzk2ZFAVdxj0q4JkILv"}},{"displayName":"","role":1,"createdAt":"2016-06-22T03:31:29.000Z","updatedAt":"2016-06-22T03:31:29.000Z","user":{"id":"UqloLafw3","nickname":"王伟","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:17:44.000Z","updatedAt":"2016-06-22T05:17:44.000Z","user":{"id":"VPgC4LQxw","nickname":"高彩彩","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T03:52:40.000Z","updatedAt":"2016-06-23T03:52:40.000Z","user":{"id":"bNC60R4Se","nickname":"魏大鹏","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T03:30:57.000Z","updatedAt":"2016-06-23T03:30:57.000Z","user":{"id":"XSqyRXH0b","nickname":"李亚松","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T03:31:04.000Z","updatedAt":"2016-06-23T03:31:04.000Z","user":{"id":"dF4rToXYc","nickname":"战晓峰","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/dF4rToXYc1480663399693231201"}},{"displayName":"","role":1,"createdAt":"2016-06-23T05:52:58.000Z","updatedAt":"2016-06-23T05:52:58.000Z","user":{"id":"Q1S43fzWU","nickname":"高晓光","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T04:02:05.000Z","updatedAt":"2016-06-23T04:02:05.000Z","user":{"id":"SBeaTkR14","nickname":"yanlei","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FsBolWspeXS2BCrVMYDqeqrZiaCY"}},{"displayName":"","role":1,"createdAt":"2016-08-04T04:24:27.000Z","updatedAt":"2016-08-04T04:24:27.000Z","user":{"id":"7z4teCmHU","nickname":"石鹏","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fo_4fQnyNRjz5mSyxLvYXXZIl988"}},{"displayName":"","role":1,"createdAt":"2016-06-23T06:10:02.000Z","updatedAt":"2016-06-23T06:10:02.000Z","user":{"id":"KFfnW3QUD","nickname":"刘华","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T11:58:24.000Z","updatedAt":"2016-06-23T11:58:24.000Z","user":{"id":"xmLI9QOjv","nickname":"刘鹏","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T11:58:24.000Z","updatedAt":"2016-06-23T11:58:24.000Z","user":{"id":"RhkYq7by1","nickname":"老猫","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/RhkYq7by11466683458989444092"}},{"displayName":"","role":1,"createdAt":"2016-06-23T12:32:13.000Z","updatedAt":"2016-06-23T12:32:13.000Z","user":{"id":"wE8mxkfQW","nickname":"冯亚东","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-24T03:12:23.000Z","updatedAt":"2016-06-24T03:12:23.000Z","user":{"id":"gwuf3pPlR","nickname":"王增绪","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-30T08:52:31.000Z","updatedAt":"2016-06-30T08:52:31.000Z","user":{"id":"aZuzVkXFd","nickname":"林光柘","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/aZuzVkXFd1480008946226139160"}},{"displayName":"","role":1,"createdAt":"2016-07-08T05:38:49.000Z","updatedAt":"2016-07-08T05:38:49.000Z","user":{"id":"1wqmFbjA1","nickname":"齐新兵","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/1wqmFbjA11476802386140438965"}},{"displayName":"","role":1,"createdAt":"2016-07-19T04:15:26.000Z","updatedAt":"2016-07-19T04:15:26.000Z","user":{"id":"7EdoAt9ab","nickname":"苏东升","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FmjEfW6euzgAhFG3q9I3RvF_WhjC"}},{"displayName":"","role":1,"createdAt":"2016-07-26T06:48:32.000Z","updatedAt":"2016-07-26T06:48:32.000Z","user":{"id":"H5q4XuNy2","nickname":"王明强","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-09-28T09:16:36.000Z","updatedAt":"2016-09-28T09:16:36.000Z","user":{"id":"xhFlj2X0U","nickname":"王晖","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/xhFlj2X0U1472623393044314941"}},{"displayName":"","role":1,"createdAt":"2016-08-08T03:09:51.000Z","updatedAt":"2016-08-08T03:09:51.000Z","user":{"id":"tZwBjo6pm","nickname":"徐文杰","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-08-09T02:42:19.000Z","updatedAt":"2016-08-09T02:42:19.000Z","user":{"id":"aP9uvganV","nickname":"王丹","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/aP9uvganV1479384908462865967"}},{"displayName":"","role":1,"createdAt":"2016-08-15T10:29:48.000Z","updatedAt":"2016-08-15T10:29:48.000Z","user":{"id":"pivneWX5a","nickname":"李峰","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FhZKRkT7DInMbrqCSKX6NqIqHbEP"}},{"displayName":"","role":1,"createdAt":"2016-08-21T07:52:55.000Z","updatedAt":"2016-08-21T07:52:55.000Z","user":{"id":"57xOKYE5R","nickname":"杨威","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FpMo1YQwcwGXxxlJgZxjcQ7iq-IF"}},{"displayName":"","role":1,"createdAt":"2016-08-22T03:36:53.000Z","updatedAt":"2016-08-22T03:36:53.000Z","user":{"id":"taiRl6AcD","nickname":"周熹君","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/taiRl6AcD1471853788891699951"}},{"displayName":"","role":1,"createdAt":"2016-08-30T08:12:52.000Z","updatedAt":"2016-08-30T08:12:52.000Z","user":{"id":"7QoMbcCVk","nickname":"阳怀雁","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-09-20T04:35:30.000Z","updatedAt":"2016-09-20T04:35:30.000Z","user":{"id":"lUHLA1jod","nickname":"薛争锋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrMzQAt-JEJIwnYWRc885UEGB6il"}},{"displayName":"","role":1,"createdAt":"2016-09-21T06:41:05.000Z","updatedAt":"2016-09-21T06:41:05.000Z","user":{"id":"8d714rvYC","nickname":"方中伟","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FoONElqv9nF_SyXePcfs7e9eEgcj"}},{"displayName":"","role":1,"createdAt":"2016-09-26T12:14:43.000Z","updatedAt":"2016-09-26T12:14:43.000Z","user":{"id":"TUk2bAgVY","nickname":"许广义","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-10-21T03:33:46.000Z","updatedAt":"2016-10-21T03:33:46.000Z","user":{"id":"oOKXWTIkR","nickname":"蒋应吉","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-11-08T09:16:49.000Z","updatedAt":"2016-11-08T09:16:49.000Z","user":{"id":"IuDkFprSQ","nickname":"罗敏丹","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1479202915470147217"}},{"displayName":"","role":1,"createdAt":"2016-11-11T02:16:54.000Z","updatedAt":"2016-11-11T02:16:54.000Z","user":{"id":"6IHYz9dma","nickname":"袁顶望","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/6IHYz9dma1479292541830319824"}},{"displayName":"","role":1,"createdAt":"2016-11-22T08:35:24.000Z","updatedAt":"2016-11-22T08:35:24.000Z","user":{"id":"wmlPKfEUc","nickname":"赵福运","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrestOvUh4089mmpHSGnz5-dUqcr"}},{"displayName":"","role":1,"createdAt":"2016-11-23T07:37:16.000Z","updatedAt":"2016-11-23T07:37:16.000Z","user":{"id":"UPngZsWt8","nickname":"黄家鑫","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-11-23T07:37:16.000Z","updatedAt":"2016-11-23T07:37:16.000Z","user":{"id":"o7n2xlEAb","nickname":"Jiang zijia","portraitUri":""}}]},
      '7crjBbeZ5':{"code":200,"result":[{"displayName":"","role":0,"createdAt":"2016-06-21T07:47:50.000Z","updatedAt":"2016-06-21T07:47:50.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":1,"createdAt":"2016-06-21T07:47:50.000Z","updatedAt":"2016-06-21T07:47:50.000Z","user":{"id":"lFVuoM7Jx","nickname":"zz移动","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FpUeAftgRyYJasAm_Y1HJpmXlM9h"}},{"displayName":"","role":1,"createdAt":"2016-06-21T07:47:50.000Z","updatedAt":"2016-06-21T07:47:50.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}}]},
      'D6Vh5Io7W':{"code":200,"result":[{"displayName":"","role":1,"createdAt":"2016-06-22T04:29:05.000Z","updatedAt":"2016-06-22T04:29:05.000Z","user":{"id":"675NdFjkx","nickname":"杨川","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:59:54.000Z","updatedAt":"2016-06-22T04:59:54.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":0,"createdAt":"2016-06-22T02:56:41.000Z","updatedAt":"2016-06-22T02:56:41.000Z","user":{"id":"Tp6nLyUKX","nickname":"满少臣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:29:05.000Z","updatedAt":"2016-06-22T04:29:05.000Z","user":{"id":"DWYHBCA3r","nickname":"王俊","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:27:54.000Z","updatedAt":"2016-06-22T04:27:54.000Z","user":{"id":"ZAEFs5BWS","nickname":"张菁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FlU97lSQvja1Q2kDLgl4Orm4Vovw"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:56:41.000Z","updatedAt":"2016-06-22T02:56:41.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}},{"displayName":"","role":1,"createdAt":"2016-06-22T08:16:41.000Z","updatedAt":"2016-06-22T08:16:41.000Z","user":{"id":"unotDC9VH","nickname":"王成阔","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/unotDC9VH1473837961158452148"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:29:05.000Z","updatedAt":"2016-06-22T04:29:05.000Z","user":{"id":"UqloLafw3","nickname":"王伟","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:29:27.000Z","updatedAt":"2016-06-22T05:29:27.000Z","user":{"id":"VPgC4LQxw","nickname":"高彩彩","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-09-05T10:05:59.000Z","updatedAt":"2016-09-05T10:05:59.000Z","user":{"id":"xhFlj2X0U","nickname":"王晖","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/xhFlj2X0U1472623393044314941"}},{"displayName":"","role":1,"createdAt":"2016-08-24T02:17:26.000Z","updatedAt":"2016-08-24T02:17:26.000Z","user":{"id":"tZwBjo6pm","nickname":"徐文杰","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-09-20T04:19:22.000Z","updatedAt":"2016-09-20T04:19:22.000Z","user":{"id":"lUHLA1jod","nickname":"薛争锋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrMzQAt-JEJIwnYWRc885UEGB6il"}},{"displayName":"","role":1,"createdAt":"2016-11-03T08:09:57.000Z","updatedAt":"2016-11-03T08:09:57.000Z","user":{"id":"RbuDdJXv8","nickname":"刘雨奇","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/RbuDdJXv81478178192931130859"}}]},
      'nzrbOKBdE':{"code":200,"result":[{"displayName":"","role":1,"createdAt":"2016-10-13T01:42:43.000Z","updatedAt":"2016-10-13T01:42:43.000Z","user":{"id":"675NdFjkx","nickname":"杨川","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","role":1,"createdAt":"2016-06-24T01:41:03.000Z","updatedAt":"2016-06-24T01:41:03.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"Uz6Sw8GXx","nickname":"郑英君","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"hMjCbic6U","nickname":"fanghe","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/hMjCbic6U1466779768249026123"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:31:58.000Z","updatedAt":"2016-06-22T04:31:58.000Z","user":{"id":"ImgEatRGU","nickname":"杨攀","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/ImgEatRGU1463128238995328857"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"mi8t76DVu","nickname":"吕朋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-07-01T04:21:19.000Z","user":{"id":"t1hWCOGvX","nickname":"z阿明","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FtsvvWnAcLeoHFVnRLuQ3hbyZMAC"}},{"displayName":"","role":0,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"Tp6nLyUKX","nickname":"满少臣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"rOMJ1vQVd","nickname":"张璐","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A"}},{"displayName":"","role":1,"createdAt":"2016-06-23T07:09:21.000Z","updatedAt":"2016-06-23T07:09:21.000Z","user":{"id":"zfta479r2","nickname":"周瑞","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FhNGcU1t9fqeY8RNU9YLxB_uC0CW"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"8ydpAQGf3","nickname":"章颖","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/8ydpAQGf31466593526225904053"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"J7XqKPint","nickname":"会会测试","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/J7XqKPint1465875994761060059"}},{"displayName":"","role":1,"createdAt":"2016-06-22T02:57:58.000Z","updatedAt":"2016-06-22T02:57:58.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}},{"displayName":"","role":1,"createdAt":"2016-08-26T03:28:16.000Z","updatedAt":"2016-08-26T03:28:16.000Z","user":{"id":"iNj2YO4ib","nickname":"张改红","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/iNj2YO4ib1478597318495575928"}},{"displayName":"","role":1,"createdAt":"2016-08-08T05:33:01.000Z","updatedAt":"2016-08-08T05:33:01.000Z","user":{"id":"40qHVS1mE","nickname":"胡君洁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/40qHVS1mE1466594886916926758"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:31:58.000Z","updatedAt":"2016-06-22T04:31:58.000Z","user":{"id":"Bj8i9FSde","nickname":"王珏","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Bj8i9FSde1479293590044522949"}},{"displayName":"","role":1,"createdAt":"2016-06-23T07:08:58.000Z","updatedAt":"2016-06-23T07:08:58.000Z","user":{"id":"BWSZNmXBD","nickname":"刘红艳","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/BWSZNmXBD1479893692484588135"}},{"displayName":"","role":1,"createdAt":"2016-08-26T03:27:55.000Z","updatedAt":"2016-08-26T03:27:55.000Z","user":{"id":"T8SAQ7jwx","nickname":"田奎","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fta34QQtM96SpSv8zBgYcW9sVLuX"}},{"displayName":"","role":1,"createdAt":"2016-07-04T01:57:02.000Z","updatedAt":"2016-07-04T01:57:02.000Z","user":{"id":"dF4rToXYc","nickname":"战晓峰","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/dF4rToXYc1480663399693231201"}},{"displayName":"","role":1,"createdAt":"2016-08-21T07:54:01.000Z","updatedAt":"2016-08-21T07:54:01.000Z","user":{"id":"57xOKYE5R","nickname":"杨威","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FpMo1YQwcwGXxxlJgZxjcQ7iq-IF"}},{"displayName":"","role":1,"createdAt":"2016-09-20T04:35:54.000Z","updatedAt":"2016-09-20T04:35:54.000Z","user":{"id":"lUHLA1jod","nickname":"薛争锋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FrMzQAt-JEJIwnYWRc885UEGB6il"}}]},
      '0KYWsPa17':{"code":200,"result":[{"displayName":"","role":1,"createdAt":"2016-06-23T03:42:59.000Z","updatedAt":"2016-06-23T03:42:59.000Z","user":{"id":"OIBbeKlkx","nickname":"施剑峰","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"675NdFjkx","nickname":"杨川","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:01:31.000Z","updatedAt":"2016-06-22T05:01:31.000Z","user":{"id":"MfgILRowx","nickname":"郑毅123","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"Uz6Sw8GXx","nickname":"郑英君","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"hMjCbic6U","nickname":"fanghe","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/hMjCbic6U1466779768249026123"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:17.000Z","updatedAt":"2016-06-22T04:35:17.000Z","user":{"id":"ImgEatRGU","nickname":"杨攀","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/ImgEatRGU1463128238995328857"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"mi8t76DVu","nickname":"吕朋","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"GC2lr3GPu","nickname":"王平","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"YMFYnvxNu","nickname":"岑裕","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-28T04:11:07.000Z","updatedAt":"2016-06-28T04:11:07.000Z","user":{"id":"AIq9Pk0Eu","nickname":"师帅","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"pxwX92h1u","nickname":"李恩海","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/pxwX92h1u1480592195057355957"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:36:29.000Z","updatedAt":"2016-06-22T04:36:29.000Z","user":{"id":"H5YjcPa2k","nickname":"师海阳","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"t1hWCOGvX","nickname":"z阿明","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FtsvvWnAcLeoHFVnRLuQ3hbyZMAC"}},{"displayName":"","role":0,"createdAt":"2016-06-22T04:35:17.000Z","updatedAt":"2016-06-22T04:35:17.000Z","user":{"id":"Tp6nLyUKX","nickname":"满少臣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041"}},{"displayName":"","role":1,"createdAt":"2016-06-22T06:49:15.000Z","updatedAt":"2016-06-22T06:49:15.000Z","user":{"id":"N5zNVXSAL","nickname":"融融","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/N5zNVXSAL1468383079822445801"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"rOMJ1vQVd","nickname":"张璐","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"zfta479r2","nickname":"周瑞","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FhNGcU1t9fqeY8RNU9YLxB_uC0CW"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"VvnIxO8tV","nickname":"邹岳","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/VvnIxO8tV1466543937625991943"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"DWYHBCA3r","nickname":"王俊","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"nE7j5Hg2U","nickname":"常帅强","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"8ydpAQGf3","nickname":"章颖","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/8ydpAQGf31466593526225904053"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"ZAEFs5BWS","nickname":"张菁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FlU97lSQvja1Q2kDLgl4Orm4Vovw"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"J7XqKPint","nickname":"会会测试","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/J7XqKPint1465875994761060059"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"bgklSBmv3","nickname":"姜辣辣","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/bgklSBmv31466593636205681152"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"CYXf6GNeM","nickname":"杜立召","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/CYXf6GNeM1478592773814176025"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"u0LUuhzHm","nickname":"于洪达001","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"LEU82p5Zk","nickname":"李涛","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/LEU82p5Zk1464574166962886963"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"Pbj8ypn4Q","nickname":"周建丽","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/Pbj8ypn4Q1466660151351159180"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"v30JWCcQY","nickname":"Jane Chen","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/v30JWCcQY1467084604112441162"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"07JDlu4nE","nickname":"李斐","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/07JDlu4nE1478597604141135986"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"jkirN8Yfq","nickname":"李小黎","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-23T06:51:04.000Z","updatedAt":"2016-06-23T06:51:04.000Z","user":{"id":"E1IoyL5Pj","nickname":"liulin","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/E1IoyL5Pj1474883226760875000"}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"iNj2YO4ib","nickname":"张改红","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/iNj2YO4ib1478597318495575928"}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:33:39.000Z","updatedAt":"2016-06-22T05:33:39.000Z","user":{"id":"qGEj03bpP","nickname":"岳军红","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/FsZ_Ch_lbZLKlfdoxaDlo70_Bcyi"}},{"displayName":"","role":1,"createdAt":"2016-06-22T08:01:57.000Z","updatedAt":"2016-06-22T08:01:57.000Z","user":{"id":"yl8HaPYDF","nickname":"张宁","portraitUri":""}},{"displayName":"","role":1,"createdAt":"2016-06-22T04:35:39.000Z","updatedAt":"2016-06-22T04:35:39.000Z","user":{"id":"40qHVS1mE","nickname":"胡君洁","portraitUri":"http://7xogjk.com1.z0.glb.clouddn.com/40qHVS1mE1466594886916926758"}},{"displayName":"","role":1,"createdAt":"2016-06-22T05:33:39.000Z","updatedAt":"2016-06-22T05:33:39.000Z","user":{"id":"QA4oUTH98","nickname":"张雷","portraitUri":""}}]}
 };
app.get('/group/:groupId/members', function(req, res, next){
  var groupId = req.params.groupId;
  res.send(groupMembers[groupId] || []);
  next();
});


var users = {
  '1002': {
    id: '1002',
    name: '小企鹅',
    portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066'
  },
  '1003': {
    id: '1003',
    name: '飞翔的企鹅',
    portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_'
  },
  '1004': {
    id: '1004',
    name: 'CPU',
    portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041'
  },
  '1005': {
    id: '1005',
    name: '西湖龙井',
    portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A'
  },
  '1001': {
    id: '1001',
    name: '大海飞',
    portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984'
  }
};

app.get('/user/all', function(req, res, next){
  res.send({code:200, result:users});
  next();
});

app.post('/user/login', function(req, res, next){
  res.send({code:200});
  next();
});
app.listen(3587);
console.log('listener port : 3587');
