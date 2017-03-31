var sharpieInit = (function(win) {
    /**
     * @param {object} callback
     * @param {function} callback.onerror
     * @param {function} callback.onclose   
     */
    var Socket = function(url, callback) {
        var ws = new WebSocket("ws://" + url);
        ws.onopen = function() {

        };
        ws.onmessage = function(ev) {
           console.log(JSON.parse(ev.data));
        };
        ws.onerror = function(ev) {
            callback.onerror(ev);
        };
        ws.onclose = function(ev) {
            callback.onclose(ev);
        };
        return ws;
    };

    var socketInstance = null;

    var join = function(content) {
        
    };

    var quit = function(content) {

    };

    var fetch = function(content) {

    };

    return function(url, callback) {
        socketInstance = Socket(url, callback);
        return {
            join: join,
            quit: quit,
            fetch: fetch
        };
    };
})(window);