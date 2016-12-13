/**
 * @namespace DataModel
 * @property {object}  User         - [用户模型]{@link User} 
 * @property {object}  Group        - {@link GroupModel} 
 * @property {object}  Friend       - 好友模型
 * @property {object}  Conversation - 会话模型
 * @property {object}  Message      - 消息模型
 * @property {object}  Status       - 状态模型
 @example
    var config = {};
    var options = {};
    var _instance = RongDataModel.init(config, options);
 */

(function() {

    /**
       @namespace User
    */

    /**
        用户模型数据接口
        @namespace UserProvider
    */
    var UserDataProvider = {
         /** 
            获取用户信息
            @memberof UserProvider 
            @param {string} userId 用户 Id 
        */
        get:function(userId){}
    };

    
    var UserModel = (function() {
        /** 
            获取用户信息
            @memberof User 
            @param {string} userId 用户 Id 
            @see {@link UserProvider}
        */
        var get = function(userId){

        };
    })();
    

    return {
        UserModel:UserModel
    };
})();
