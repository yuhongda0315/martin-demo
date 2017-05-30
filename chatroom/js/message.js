'use strict';
(function(RongChat, dependencies) {
    var Vue = dependencies.Vue;
    var global = dependencies.win;
    var util = global._;
    var components = RongChat.components;
    var message = {
        template: `
                <div class="conversation">
                    <div class="message" v-for="message in messageList">
                        <div class="avater">
                            <img v-bind:src.once=message.user.portrait alt="">
                        </div>
                        <div class="info">
                            <div class="content">{{ message.content.content }}</div>
                            <span class="sent-info">{{ message.user.name}}: {{ message.sentTime }}</span>
                        </div>
                    </div>
                    <div class="input-box">
                        <div class="input-toolbar">
                            <i class="icon-rocket" style="display: none;"></i>
                            <label class="switch-btn">
                                <input class="checked-switch" type="checkbox" @click="barrage"/>
                                <span class="text-switch"></span> 
                                <span class="toggle-btn"></span> 
                            </label>      
                        </div>
                        <input type="text" class="input-content" v-model=content placeholder="请输入... Enter 发送"  @keyup.enter="sendMessage"/>
                    </div>
                </div>
        `,
        data: function() {
            return {
                content: '',
                messageList: []
            };
        },
        computed: {
            isBarrage: function(){
                return this.isBarrage;
            }
        },
        mounted: function() {
            mounted(this);
        },
        methods: {
            barrage: barrage,
            sendMessage: function() {
                var context = this;
                var content = context.content;
                if (!content) {
                    return;
                }

                var Message = RongChat.dataService.Message;

                var params = {
                    messageType: 'TextMessage',
                    data: {
                        content: content
                    }
                };
                Message.send(params, function(error) {
                    if (error) {
                        console.error(error);
                    }
                    context.content = '';
                });
            }
        }
    };

    function barrage() {
        var chat = RongChat.chat;
        var isBarrage = chat.isBarrage;
        chat.isBarrage = !isBarrage;
    }

    function showMessages(msgs, context) {
        msgs = util.isArray(msgs) ? msgs : [msgs];
        util.each(msgs, function(msg) {
            context.messageList.push(msg);
        });
    }

    function mounted(context) {
        var chat = context.$root;

        chat.$on('receivedMessage', function(msgs) {
            showMessages(msgs, context);
        });

        Vue.nextTick(function() {
            var dataService = RongChat.dataService;
            var Message = dataService.Message;
            var messageList = Message.get();
            showMessages(messageList, context);
        });
    }
    components.message = message;
})(RongChat, {
    Vue: Vue,
    win: window
});