/// <reference path="./RongIMLib.d.ts" />
var Merda;
(function (Merda) {
    var Client = /** @class */ (function () {
        function Client() {
        }
        Client.init = function (params) {
            RongIMLib.RongIMClient.init('appkey');
        };
        return Client;
    }());
    Merda.Client = Client;
})(Merda || (Merda = {}));
