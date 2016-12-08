var rongCloud = require('rongcloud-sdk');

rongCloud.init('', '');

var users = [];

// var index = 0;
// var invoke = function() {
//     if (index >= users.length) {
//         return;
//     }
//     var user = users[index].user;
//     rongCloud.user.refresh(user.id,
//         user.nickname,
//         user.portraitUri,
//         'json',
//         function(err, result) {
//             console.log(err, result);
//             index++;
//             invoke();
//         });
// };
// invoke();


var index = 0;
var invoke = function() {
    if (index >= users.length) {
        return;
    }
    var user = users[index].user;
    rongCloud.user.info(user.id,
        'json',
        function(err, result) {
            var res = JSON.parse(result);
            if (res.userName == "") {
                console.log(user.id, result);
            }
            index++;
            invoke();
        });
};
invoke();