var rongCloud = require('rongcloud-sdk')

rongCloud.init('n19jmcy9itc4z', 'Dj1sOLsfy2');
var msg = {
    operatorUserId: 'YuHongDa',
    operation: 'operation',
    data: 'YuHongDa',
    message: 'YuHongDa'
};
// rongCloud.message.group.publish('__system__', 'dh862', 'RC:GrpNtf', JSON.stringify(msg), function(err, resultText) {
//     if (err) {
//         console.log(err.response.text);
//     }
//     console.log(resultText);
// });


 // rongCloud.group.create(['yhd1','yhd2'], 'yhd9901', 'First', function(err, resultText) {
 //    console.log(err.response.text);
 // })

 rongCloud.user.getToken('dh1', 'Administrator', '', function(err, res){
    console.log(res)
 });