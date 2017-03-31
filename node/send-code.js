var request  = require('superagent');
var xml2js = require('xml2js');
var md5 = require('md5');
 
// var str = 'enterpriseID=10193&loginName=admin&password=30b6c49e3b22a45ffd2d75fef66310ff&content=%E6%B5%8B%E8%AF%95&mobiles=13269772769';
// request
//   .post('http://172.28.34.23:9080/sendSMS.action')
//   .send(str)
//   .end(function(err, res){
//     var parser = new xml2js.Parser();
//     parser.parseString(res.text, function(err, result){
//         var json = eval(result);
//         console.log(json.Response.Result[0]);
//     });
//   });

console.log(md5('muc123456') == '30b6c49e3b22a45ffd2d75fef66310ff');