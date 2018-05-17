onmessage = function(message){
    var data=message.data;
    var msg = 'Hi from task.js';
    this.postMessage(msg);
}