var WebSocket = require('ws').Server,
    url = require('url'),
    client = require('./client');

require('events').EventEmitter.prototype._maxListeners = 100;

socket = new WebSocket({
    port: 8682
});
socket.on('connection', function(ws) {
    client.add(ws);
    ws.on('message', function(message) {
        client.handleMessage(JSON.parse(message), client);
    });
    ws.on('close', function() {

    });
});