'use strict';
(function(RongChat, dependencies) {
    var components = RongChat.components;
    var global = dependencies.win;
    var util = global._;

    var user = {
        template: `
                 <div class="userinfo">
                    <div class="avater" v-for="user in uesrList">
                        <img :src=user.portrait alt="">
                        <span>{{user.name}}</span>
                    </div>
                </div>
        `,
        data: function() {
            return {
                uesrList: []
            }
        },
        mounted: function(){
            mounted(this);
        }
    };
 
    function mounted(context){
            var chat = context.$root;
            Vue.nextTick(function() {
                var dataService = RongChat.dataService;
                var ChatRoom = dataService.ChatRoom;
                var params = {
                    count: 20
                };
                ChatRoom.get(params, function(error, chatroom){
                        var users = chatroom.userInfos;
                        util.each(users, function(user){
                            context.uesrList.push(user);
                        });
                    });
            });
    }
    components.user = user;
})(RongChat, {
    win: window
});