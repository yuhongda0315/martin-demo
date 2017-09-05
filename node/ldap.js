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


var fs = require('fs');
var request = require('request');

var source = 'https://rongcloud-file.cn.ronghub.com/d0432048c5b2cbc5c5.json?attname=module-conf.json&e=2147483647&token=livk5rb3__JZjCtEiMxXpQ8QscLxbNLehwhHySnX:rc7LajEQhUUmUvPEHGyxGOyeiRQ=';

var downloadProcess = (file) => {

	var local = './module-conf.json';

	var promise = new Promise((resolve, reject) => {
		var received_bytes = 0;
		var total_bytes = 0;

		var req = request({
			method: 'GET',
			uri: source
		});

		var out = fs.createWriteStream(local);
		req.pipe(out);

		req.on('response', (data) => {
			total_bytes = parseInt(data.headers['content-length']);
		});

		req.on('data', (chunk) => {
			received_bytes += chunk.length;
		});

		req.on('error', (error) => {
			console.log(error);
			reject();
		});

		req.on('end', () => {
			resolve();
		});
	});
	return promise;
};

downloadProcess().then(function(){
	console.log('successfully.');
});