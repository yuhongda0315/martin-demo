// var ldap = require("ldapjs");

// var client = ldap.createClient({
//   url: 'ldap://172.28.38.78:389'
// });
// var username = 'mucldapuser@ceair.com';
// client.bind(username, 'admin123!', function(err) {
//   var opts = {
//     filter: '(email=*@ceair.com)',
//     scope: 'sub',
//     attributes: ['dn']
//   };

//   client.search('dc=ceair,dc=com', opts, function(err, res) {

//     res.on('searchReference', function(referral) {
//       console.log('referral: ' + referral.uris.join());
//     });
//     res.on('error', function(err) {
//       client.unbind();
//       console.error('error: ' + err.message);
//     });
//     res.on('end', function(result) {
//       client.unbind();
//       console.log('status: ' + result.status);
//     });
//   });
// });


var rongcloudSDK = require('rongcloud-sdk');

rongcloudSDK.init( '8luwapkvucoil', 'y0icysjl4h3LWz');
rongcloudSDK.message.private.publish("1001","1002","RC:TxtMsg",JSON.stringify({'content':'1111hello1','extra':'helloExtra'}),"","","json",function( err, resultText ) { 
if( err ) { 
// Handle the error 
console.log(err); 
} 
else { 
var result = JSON.parse( resultText ); 
if( result.code === 200 ) { 
  console.log(result);
//Handle the result.token 
} 
} 
} ); 