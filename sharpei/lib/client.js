var clients = {};

var uid = function() {
    var date = +new Date;
    var id = 'xxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return id;
};

var add = function(ws) {
    clients[uid()] = ws;
};

var sendMessage = function(content) {

};

var handleMessage = function() {

};

module.exports = {
    add: add,
    handleMessage: handleMessage
};