(function(dependencies){
    var global = dependencies.win;
    
    var isMaster = (location.search.indexOf("master") > -1);

    var config = {
        chatRoomId: 'RCchatroom001',
        isMaster: isMaster,
        appkey: 'x18ywvqfxjp6c',
        el: '#rongchat'
    };

    global.RongChat = {
        components: {},
        config: config
    };
})({
    win: window
});