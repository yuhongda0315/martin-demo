'use strict';
(function(RongChat, dependencies) {
    var components = RongChat.components;

    var message = components.message;
    var user = components.user;
    var routers = [{
        path: '/',
        component: message
    }, {
        path: '/message/:viewer',
        name: 'message',
        component: message
    }, {
        path: '/user/:viewer',
        name: 'user',
        component: user
    }];

    RongChat.routers = routers;
})(RongChat, null);