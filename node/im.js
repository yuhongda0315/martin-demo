// const request = require('superagent');

// var appId = '8luwapkvucoil';
// var token = 'CdpH9Q5sSc416THmJMNSW8SkAMimzaj6nB20cRPaYWTm/DLRQaleLDuO6jjDS7gY6ZCNZiX2+eVDhuh8o9Ba2Q==';
// var v = '2.8.27';

// request
//     .post('http://nav.cn.ronghub.com/navi.xml')
//     .type('form')
//     .set({
//         appId: appId,
//         accept: 'text/xml'
//     })
//     .send({
//         token: token
//     })
//     .send({
//         v: v
//     })
//     .end((err, res) => {
//         if (err) {
//             console.log(err.response.text);
//         } else {
//             console.log(res.text);
//         }
//     });


// var request = require('request');

// var appId = '8luwapkvucoil';
// var token = 'CdpH9Q5sSc416THmJMNSW8SkAMimzaj6nB20cRPaYWTm/DLRQaleLDuO6jjDS7gY6ZCNZiX2+eVDhuh8o9Ba2Q==';
// var v = '2.8.27';
// var url = 'http://nav.cn.ronghub.com/navi.json';

// request({
//     url: url,
//     method: 'POST',
//     headers: {
//         appId: appId
//     },
//     body: 'token=' + encodeURIComponent(token) + '&v=' + v
// }, function(error, response, body) {
//     console.log(JSON.parse(body));
// });