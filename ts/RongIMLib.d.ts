declare function md5(str: string, key?:string, raw?:string): any;
declare var Modules: any;
declare var require: any;
declare var module: any;
declare var define: any;
declare var exports: any;
declare var dcodeIO: any;
declare var Polling: any;
declare var escape: any;
declare var AMR: any;
declare var PCMData:any;
declare var swfobject: any;
declare var openDatabase: any;
declare var AgoraRTC: any;
declare var Qiniu: any;
declare var plupload: any;
declare var QiniuJsSDK: any;
declare interface AgoraRTC {
    init: any;
    join: any;
    unpublish: any;
    publish: any;
    on: any;
    subscribe: any;
    leave: any;
}
declare class XDomainRequest { }
declare interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    msGetUserMedia: any;
    getUserMedia: any;
    cancelAnimationFrame: any;
    webkitCancelAnimationFrame: any;
    mozCancelAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
}
declare interface Window {
    WebSocket: WebSocket;
    Notifications: any;
    RCCallback: any;
    RongIMClient: any;
    getServerEndpoint: any;
    WEB_XHR_POLLING: any;
    SCHEMETYPE: any;
    XDomainRequest: any;
    JSON: any;
    Modules: any;
    handleFileSelect: any;
    AudioContext: any;
    webkitAudioContext: any;
    webkitURL: any;
}
declare interface Document {
    createStyleSheet: any;
}
declare interface HTMLScriptElement {
    onreadystatechange: any;
    readyState: any;
}
declare interface Date {
    toGMTString: any;
}

declare interface ArrayConstructor {
    forEach: any;
}

declare interface Document {
    attachEvent: any;
    detachEvent: any;
}

declare interface Addon {
    initWithAppkey(appKey: string): void;

    connectWithToken(token: string, userId: string): number;

    reconnect(callback: RongIMLib.ConnectCallback): void;

    logout(): void;

    disconnect(isDisconnect: boolean): void;

    setConnectionStatusListener(listener?: Function): void;

    setOnReceiveMessageListener(listener?: Function): void;

    sendReceiptResponse(conversationType: RongIMLib.ConversationType, targetId: string, sendCallback: RongIMLib.SendMessageCallback): void;

    recallMessage(objectName: string, content: string, push: string, success: Function, error: Function): void;

    sendTypingStatusMessage(conversationType: RongIMLib.ConversationType, targetId: string, messageName: string, sendCallback: RongIMLib.SendMessageCallback): void;

    sendTextMessage(conversationType: RongIMLib.ConversationType, targetId: string, content: string, sendMessageCallback: RongIMLib.SendMessageCallback): void;

    getRemoteHistoryMessages(conversationType: RongIMLib.ConversationType, targetId: string, timestamp: number, count: number, success: Function, error: Function): void;

    hasRemoteUnreadMessages(token: string, callback: RongIMLib.ResultCallback<Boolean>): void;

    getRemoteConversationList(callback: RongIMLib.ResultCallback<RongIMLib.Conversation[]>, conversationTypes: RongIMLib.ConversationType[], count: number): void;

    removeConversation(conversationType: RongIMLib.ConversationType, targetId: string, callback: RongIMLib.ResultCallback<boolean>): void;

    addMemberToDiscussion(discussionId: string, userIdList: string[], callback: RongIMLib.OperationCallback): void;

    createDiscussion(name: string, userIdList: string[], callback: RongIMLib.CreateDiscussionCallback): void;

    getDiscussion(discussionId: string, callback: RongIMLib.ResultCallback<RongIMLib.Discussion>): void;

    quitDiscussion(discussionId: string, callback: RongIMLib.OperationCallback): void;

    removeMemberFromDiscussion(discussionId: string, userId: string, callback: RongIMLib.OperationCallback): void;

    setDiscussionInviteStatus(discussionId: string, status: RongIMLib.DiscussionInviteStatus, callback: RongIMLib.OperationCallback): void;

    setDiscussionName(discussionId: string, name: string, callback: RongIMLib.OperationCallback): void;

    joinGroup(groupId: string, groupName: string, callback: RongIMLib.OperationCallback): void;

    quitGroup(groupId: string, callback: RongIMLib.OperationCallback): void;

    syncGroup(groups: Array<RongIMLib.Group>, callback: RongIMLib.OperationCallback): void;

    joinChatRoom(chatroomId: string, messageCount: number, success: Function, error: Function): void;

    getChatRoomInfo(chatRoomId: string, count: number, order: RongIMLib.GetChatRoomType, callback: RongIMLib.ResultCallback<any>): void;

    quitChatRoom(chatroomId: string, success: Function, error: Function): void;

    addToBlacklist(userId: string, success: Function, error: Function): void;

    getBlacklist(success: Function, error: Function): void;

    getBlacklistStatus(userId: string, success: Function, error: Function): void;

    removeFromBlacklist(userId: string, success: Function, error: Function): void;

    getFileToken(fileType: RongIMLib.FileType, callback: RongIMLib.ResultCallback<string>): void;

    getFileUrl(fileType: RongIMLib.FileType, fileName: string, oriName: string, callback: RongIMLib.ResultCallback<string>): void;

    sendMessage(conversationType: RongIMLib.ConversationType, targetId: string, objectname: string, messageContent: string, pushText: string, appData: string, progress: Function, success: Function, error: Function, mentiondMsg?: any): string;

    registerMessageType(messageType: string, persistentFlag: number): void;

    addConversation(conversation: RongIMLib.Conversation, callback: RongIMLib.ResultCallback<boolean>): void;

    updateConversation(conversation: RongIMLib.Conversation): RongIMLib.Conversation;

    removeConversation(conversationType: RongIMLib.ConversationType, targetId: string): RongIMLib.Conversation;

    insertMessage(conversationType: number, targetId: string, senderUserId: string, objectName: string, content: string, success: Function, error: Function, diection?:number): string;

    deleteMessages(delMsgs: number[]): void;

    getMessage(messageId: string): string;

    updateMessage(message: RongIMLib.Message, callback?: RongIMLib.ResultCallback<RongIMLib.Message>): void;

    clearMessages(conversationType: RongIMLib.ConversationType, targetId: string): void;

    updateMessages(conversationType: RongIMLib.ConversationType, targetId: string, key: string, value: any, callback: RongIMLib.ResultCallback<boolean>): void;

    getConversation(conversationType: RongIMLib.ConversationType, targetId: string): string;

    getConversationList(converTypes: number[]): string;

    clearConversations(conversationType?: number, targetId?: string): void;

    getHistoryMessages(conversationType: RongIMLib.ConversationType, targetId: string, timestamp: number, count: number, objectname:string, direction: boolean): string;

    getRemoteHistoryMessages(conversationType: RongIMLib.ConversationType, targetId: string, timestamp: number, count: number): string;

    getTotalUnreadCount(conversationTypes?: number[]): number;

    getConversationUnreadCount(conversationTypes: RongIMLib.ConversationType[], callback: RongIMLib.ResultCallback<number>): void;

    getUnreadCount(conversationType: RongIMLib.ConversationType, targetId: string): number;

    clearUnreadCount(conversationType: RongIMLib.ConversationType, targetId: string): void;

    clearUnreadCountByTimestamp(conversationType: RongIMLib.ConversationType, targetId: string, timestamp:number) : void;

    setConversationToTop(conversationType: RongIMLib.ConversationType, targetId: string, isTop: boolean): void;

    setConversationHidden(conversationType: RongIMLib.ConversationType, targetId: string,isHidden:boolean):void;

    setMessageExtra(messageId: string, value: string, callback: RongIMLib.ResultCallback<boolean>): void;

    setMessageReceivedStatus(messageId: string, receivedStatus: RongIMLib.ReceivedStatus): void;

    setMessageSentStatus(messageId: string, sentStatus: RongIMLib.SentStatus): void;

    getUploadToken(fileType: RongIMLib.FileType, success: Function, error: Function): string;

    getDownloadUrl(fileType: RongIMLib.FileType, fileName: string, oriName: string, success: Function, error: Function): string;

    getChatroomInfo(chatRoomId: string, count: number, order: RongIMLib.GetChatRoomType, success: Function, error: Function): void;

    searchConversationByContent(conversationTypes: RongIMLib.ConversationType[], keyword: string): string;

    getDeltaTime():number;

    searchMessageByContent(conversationType: RongIMLib.ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: Function): void

    getUserStatus(userId:string, success:Function, error:Function) : void;

    setUserStatus(status:number, success:Function, error:Function) : void;
    
    subscribeUserStatus(userId:string[], success:Function, error:Function) : void;
    
    setOnReceiveStatusListener(listener?:Function) : void;

    setServerInfo(info:any):void;

    getUnreadMentionedMessages(conversationType:RongIMLib.ConversationType, targetId:string):string;

    updateMessageReceiptStatus(conversationType: RongIMLib.ConversationType, targetId: string, timesamp: number):void;

    setMessageContent(messageId: number, content: any, objectName: string):void;

    getConversationNotificationStatus(conversationType:number, targetId:string, success:Function, error:Function):void;

    setConversationNotificationStatus(conversationType:number, targetId:string, status: boolean, success:Function, error:Function):void;

    getConnectionStatus(): number;

    setDeviceId(deviceId: string):void;

    setEnvironment(isPrivate: boolean):void;

    getVoIPKey(engineType: number, channelName: string, extra: string, success: Function, error: Function):void;

    getAccounts(): any;

    clearRemoteHistoryMessages(conversationType: number, targetId:string, timestamp: number, success: Function, error: Function): any;
}

declare module RongIMLib {
    interface OperationCallback {
        onError(error: ErrorCode): void;
        onSuccess(info?: any): void;
    }
    interface ResultCallback<T> {
        onError(error: ErrorCode): void;
        onSuccess(result: T, atched?: any): void;
    }
    interface ConnectCallback extends ResultCallback<string> {
        onSuccess(userId: string): void;
        onTokenIncorrect(): void;
        onError(error: any): void;
    }
    interface CreateDiscussionCallback extends ResultCallback<string> {
        onSuccess(discussionId: string): void;
    }
    interface GetBlacklistCallback extends ResultCallback<string[]> {
        onSuccess(userIds: string[]): void;
    }
    interface GetNotificationQuietHoursCallback {
        onError(error: ErrorCode): void;
        onSuccess(startTime: string, spanMinutes: number): void;
    }
    interface SendImageMessageCallback {
    }
    interface SendMessageCallback {
        onError(error: ErrorCode, result?: Message): void;
        onSuccess(result?: Message): void;
        onBefore(messageId: any): void;
    }
    interface GetHistoryMessagesCallback {
        onError(error: ErrorCode): void;
        onSuccess(result: Message[], hasMoreMessages?: boolean): void;
    }
}
declare module RongIMLib {
    class PublicServiceMap {
        publicServiceList: Array<any>;
        constructor();
        get(publicServiceType: ConversationType, publicServiceId: string): PublicServiceProfile;
        add(publicServiceProfile: PublicServiceProfile): void;
        replace(publicServiceProfile: PublicServiceProfile): void;
        remove(conversationType: ConversationType, publicServiceId: string): void;
    }
    class ConversationMap {
        conversationList: Array<Conversation>;
        constructor();
        get(conversavtionType: number, targetId: string): Conversation;
        add(conversation: Conversation): void;
        replace(conversation: Conversation): void;
        remove(conversation: Conversation): void;
    }
    class CheckParam {
        static _instance: CheckParam;
        static getInstance(): CheckParam;
        logger(code: any, funcName: string, msg: string): void;
        check(f: any, position: string, d?: any, c?: any): void;
        getType(str: string): string;
        checkCookieDisable(): boolean;
    }
    class LimitableMap {
        map: any;
        keys: any;
        limit: number;
        constructor(limit?: number);
        set(key: string, value: any): void;
        get(key: string): number;
        remove(key: string): void;
    }
    class RongAjax {
        options: any;
        xmlhttp: any;
        constructor(options: any);
        send(callback: any): void;
    }
    class RongUtil {
        static noop(): void;
        static isEmpty(obj: any): boolean;
        static MD5(str: string, key?: string, raw?: string): any;
        static isObject(obj: any): boolean;
        static isArray(array: any): boolean;
        static isFunction(fun: any): boolean;
        static stringFormat(tmpl: string, vals: any): string;
        static forEach(obj: any, callback: Function): void;
        static extend(source: any, target: any, callback?: any, force?: boolean): any;
        static createXHR(): any;
        static request(opts: any): void;
        static formatProtoclPath(config: any): string;
        static supportLocalStorage(): boolean;
        static rename(origin: any, newNames: any): any;
        static some(arrs: any, callback: Function): boolean;
    }
    class RongObserver {
        watchers: {
            [key: string]: any;
        };
        genUId(key: string): string;
        watch(params: any): void;
        notify(params: any): void;
        remove(): void;
    }
}
declare module RongIMLib {
    enum MentionedType {
        ALL = 1,
        PART = 2,
    }
    enum MethodType {
        CUSTOMER_SERVICE = 1,
        RECALL = 2,
    }
    enum BlacklistStatus {
        IN_BLACK_LIST = 0,
        NOT_IN_BLACK_LIST = 1,
    }
    enum ConnectionChannel {
        XHR_POLLING = 0,
        WEBSOCKET = 1,
        HTTP = 0,
        HTTPS = 1,
    }
    enum CustomerType {
        ONLY_ROBOT = 1,
        ONLY_HUMAN = 2,
        ROBOT_FIRST = 3,
        HUMAN_FIRST = 4,
    }
    enum GetChatRoomType {
        NONE = 0,
        SQQUENCE = 1,
        REVERSE = 2,
    }
    enum ConnectionStatus {
        CONNECTED = 0,
        CONNECTING = 1,
        DISCONNECTED = 2,
        KICKED_OFFLINE_BY_OTHER_CLIENT = 6,
        NETWORK_UNAVAILABLE = 3,
        DOMAIN_INCORRECT = 12,
        CONNECTION_CLOSED = 4,
    }
    enum ConversationNotificationStatus {
        DO_NOT_DISTURB = 0,
        NOTIFY = 1,
    }
    enum ConversationType {
        NONE = 0,
        PRIVATE = 1,
        DISCUSSION = 2,
        GROUP = 3,
        CHATROOM = 4,
        CUSTOMER_SERVICE = 5,
        SYSTEM = 6,
        APP_PUBLIC_SERVICE = 7,
        PUBLIC_SERVICE = 8,
    }
    enum DiscussionInviteStatus {
        OPENED = 0,
        CLOSED = 1,
    }
    enum ErrorCode {
        RECALL_MESSAGE = 25101,
        SEND_FREQUENCY_TOO_FAST = 20604,
        RC_MSG_UNAUTHORIZED = 20406,
        RC_DISCUSSION_GROUP_ID_INVALID = 20407,
        FORBIDDEN_IN_GROUP = 22408,
        NOT_IN_DISCUSSION = 21406,
        NOT_IN_GROUP = 22406,
        NOT_IN_CHATROOM = 23406,
        FORBIDDEN_IN_CHATROOM = 23408,
        RC_CHATROOM_USER_KICKED = 23409,
        RC_CHATROOM_NOT_EXIST = 23410,
        RC_CHATROOM_IS_FULL = 23411,
        RC_CHATROOM_PATAMETER_INVALID = 23412,
        CHATROOM_GET_HISTORYMSG_ERROR = 23413,
        CHATROOM_NOT_OPEN_HISTORYMSG_STORE = 23414,
        TIMEOUT = -1,
        UNKNOWN = -2,
        JOIN_IN_DISCUSSION = 21407,
        CREATE_DISCUSSION = 21408,
        INVITE_DICUSSION = 21409,
        GET_USERINFO_ERROR = 23407,
        REJECTED_BY_BLACKLIST = 405,
        RC_NET_CHANNEL_INVALID = 30001,
        RC_NET_UNAVAILABLE = 30002,
        RC_MSG_RESP_TIMEOUT = 30003,
        RC_HTTP_SEND_FAIL = 30004,
        RC_HTTP_REQ_TIMEOUT = 30005,
        RC_HTTP_RECV_FAIL = 30006,
        RC_NAVI_RESOURCE_ERROR = 30007,
        RC_NODE_NOT_FOUND = 30008,
        RC_DOMAIN_NOT_RESOLVE = 30009,
        RC_SOCKET_NOT_CREATED = 30010,
        RC_SOCKET_DISCONNECTED = 30011,
        RC_PING_SEND_FAIL = 30012,
        RC_PONG_RECV_FAIL = 30013,
        RC_MSG_SEND_FAIL = 30014,
        RC_CONN_ACK_TIMEOUT = 31000,
        RC_CONN_PROTO_VERSION_ERROR = 31001,
        RC_CONN_ID_REJECT = 31002,
        RC_CONN_SERVER_UNAVAILABLE = 31003,
        RC_CONN_USER_OR_PASSWD_ERROR = 31004,
        RC_CONN_NOT_AUTHRORIZED = 31005,
        RC_CONN_REDIRECTED = 31006,
        RC_CONN_PACKAGE_NAME_INVALID = 31007,
        RC_CONN_APP_BLOCKED_OR_DELETED = 31008,
        RC_CONN_USER_BLOCKED = 31009,
        RC_DISCONN_KICK = 31010,
        RC_DISCONN_EXCEPTION = 31011,
        RC_QUERY_ACK_NO_DATA = 32001,
        RC_MSG_DATA_INCOMPLETE = 32002,
        BIZ_ERROR_CLIENT_NOT_INIT = 33001,
        BIZ_ERROR_DATABASE_ERROR = 33002,
        BIZ_ERROR_INVALID_PARAMETER = 33003,
        BIZ_ERROR_NO_CHANNEL = 33004,
        BIZ_ERROR_RECONNECT_SUCCESS = 33005,
        BIZ_ERROR_CONNECTING = 33006,
        MSG_ROAMING_SERVICE_UNAVAILABLE = 33007,
        MSG_INSERT_ERROR = 33008,
        MSG_DEL_ERROR = 33009,
        CONVER_REMOVE_ERROR = 34001,
        CONVER_GETLIST_ERROR = 34002,
        CONVER_SETOP_ERROR = 34003,
        CONVER_TOTAL_UNREAD_ERROR = 34004,
        CONVER_TYPE_UNREAD_ERROR = 34005,
        CONVER_ID_TYPE_UNREAD_ERROR = 34006,
        CONVER_CLEAR_ERROR = 34007,
        CLEAR_HIS_ERROR = 34010,
        CLEAR_HIS_TYPE_ERROR = 34008,
        CLEAR_HIS_TIME_ERROR = 34011,
        CONVER_GET_ERROR = 34009,
        GROUP_SYNC_ERROR = 35001,
        GROUP_MATCH_ERROR = 35002,
        CHATROOM_ID_ISNULL = 36001,
        CHARTOOM_JOIN_ERROR = 36002,
        CHATROOM_HISMESSAGE_ERROR = 36003,
        BLACK_ADD_ERROR = 37001,
        BLACK_GETSTATUS_ERROR = 37002,
        BLACK_REMOVE_ERROR = 37003,
        DRAF_GET_ERROR = 38001,
        DRAF_SAVE_ERROR = 38002,
        DRAF_REMOVE_ERROR = 38003,
        SUBSCRIBE_ERROR = 39001,
        QNTKN_FILETYPE_ERROR = 41001,
        QNTKN_GET_ERROR = 41002,
        COOKIE_ENABLE = 51001,
        GET_MESSAGE_BY_ID_ERROR = 61001,
        HAVNODEVICEID = 24001,
        DEVICEIDISHAVE = 24002,
        SUCCESS = 0,
        FEILD = 24009,
        VOIPISNULL = 24013,
        NOENGINETYPE = 24010,
        NULLCHANNELNAME = 24011,
        VOIPDYANMICERROR = 24012,
        NOVOIP = 24014,
        INTERNALERRROR = 24015,
        VOIPCLOSE = 24016,
        CLOSE_BEFORE_OPEN = 51001,
        ALREADY_IN_USE = 51002,
        INVALID_CHANNEL_NAME = 51003,
        VIDEO_CONTAINER_IS_NULL = 51004,
        DELETE_MESSAGE_ID_IS_NULL = 61001,
        CANCEL = 1,
        REJECT = 2,
        HANGUP = 3,
        BUSYLINE = 4,
        NO_RESPONSE = 5,
        ENGINE_UN_SUPPORTED = 6,
        NETWORK_ERROR = 7,
        REMOTE_CANCEL = 11,
        REMOTE_REJECT = 12,
        REMOTE_HANGUP = 13,
        REMOTE_BUSYLINE = 14,
        REMOTE_NO_RESPONSE = 15,
        REMOTE_ENGINE_UN_SUPPORTED = 16,
        REMOTE_NETWORK_ERROR = 17,
        VOIP_NOT_AVALIABLE = 18,
    }
    enum VoIPMediaType {
        MEDIA_AUDIO = 1,
        MEDIA_VEDIO = 2,
    }
    enum MediaType {
        IMAGE = 1,
        AUDIO = 2,
        VIDEO = 3,
        FILE = 100,
    }
    enum MessageDirection {
        SEND = 1,
        RECEIVE = 2,
    }
    enum FileType {
        IMAGE = 1,
        AUDIO = 2,
        VIDEO = 3,
        FILE = 4,
    }
    enum RealTimeLocationErrorCode {
        RC_REAL_TIME_LOCATION_NOT_INIT = -1,
        RC_REAL_TIME_LOCATION_SUCCESS = 0,
        RC_REAL_TIME_LOCATION_GPS_DISABLED = 1,
        RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT = 2,
        RC_REAL_TIME_LOCATION_IS_ON_GOING = 3,
        RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT = 4,
        RC_REAL_TIME_LOCATION_JOIN_FAILURE = 5,
        RC_REAL_TIME_LOCATION_START_FAILURE = 6,
        RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE = 7,
    }
    enum RealTimeLocationStatus {
        RC_REAL_TIME_LOCATION_STATUS_IDLE = 0,
        RC_REAL_TIME_LOCATION_STATUS_INCOMING = 1,
        RC_REAL_TIME_LOCATION_STATUS_OUTGOING = 2,
        RC_REAL_TIME_LOCATION_STATUS_CONNECTED = 3,
    }
    enum ReceivedStatus {
        READ = 1,
        LISTENED = 2,
        DOWNLOADED = 4,
        RETRIEVED = 8,
        UNREAD = 0,
    }
    enum ReadStatus {
        READ = 1,
        LISTENED = 2,
        DOWNLOADED = 4,
        RETRIEVED = 8,
        UNREAD = 0,
    }
    enum SearchType {
        EXACT = 0,
        FUZZY = 1,
    }
    enum SentStatus {
        SENDING = 10,
        FAILED = 20,
        SENT = 30,
        RECEIVED = 40,
        READ = 50,
        DESTROYED = 60,
    }
    enum ConnectionState {
        ACCEPTED = 0,
        UNACCEPTABLE_PROTOCOL_VERSION = 1,
        IDENTIFIER_REJECTED = 2,
        SERVER_UNAVAILABLE = 3,
        TOKEN_INCORRECT = 4,
        NOT_AUTHORIZED = 5,
        REDIRECT = 6,
        PACKAGE_ERROR = 7,
        APP_BLOCK_OR_DELETE = 8,
        BLOCK = 9,
        TOKEN_EXPIRE = 10,
        DEVICE_ERROR = 11,
    }
}
declare module RongIMLib {
    class RongIMEmoji {
        static emojis: any[];
        private static emojiFactory;
        private static regExpTag;
        private static regExpName;
        private static size;
        private static url;
        private static pixelRatio;
        private static supportEmoji;
        private static initCSS();
        private static createBTag(position);
        private static createSpan(emojiObj);
        private static calculateUTF(d);
        static init(emoji?: any): void;
        static emojiToSymbol(str: string): string;
        static symbolToEmoji(str: string): string;
        static symbolToHTML(str: string): string;
        static emojiToHTML(str: string): string;
    }
}
declare module RongIMLib {
    class RCUploadLib {
        static _instance: RCUploadLib;
        private store;
        private listener;
        private uploadType;
        private conversationType;
        private targetId;
        constructor(imgOpts: any, fileOpts: any);
        static init(imgOpts: any, fileOpts: any): void;
        static getInstance(): RCUploadLib;
        static getFileUrl(info: any): string;
        static uploadAjax(base64: string, callback: Function): void;
        static imageCompressToBase64(file: any, callback: any): void;
        setListeners(listener: any): void;
        createOptions(opts: any, type: string): void;
        start(conversationType: ConversationType, targetId: string): void;
        cancel(fileId: string): void;
        cancelAll(callback: any): void;
        reload(image: string, file: string): void;
        postImage(base64: string, file: any, conversationType: ConversationType, targetId: string, callback: any): void;
        uploadFactory(opts: any): void;
        createMessage(opts: any, file: any, callback: Function): void;
        private getThumbnail(obj, area, callback);
        private getFullPath(file);
    }
}
declare module RongIMLib {
    class RongUploadLib implements UploadProvider {
        private static _instance;
        private listener;
        private uploadType;
        private store;
        private usingKey;
        private conversationType;
        private targetId;
        private options;
        static init(imgOpts: any, fileOpts: any): void;
        static imageCompressToBase64(file: any, callback: any): void;
        constructor(imgOpts: any, fileOpts: any);
        static getInstance(): RongUploadLib;
        setListeners(listener: any): void;
        start(conversationType: ConversationType, targetId: string): void;
        cancel(fileId: any): void;
        cancelAll(callback: any): void;
        reload(image: string, file: string): void;
        destroy(): void;
        postImage(base64: string, file: any, conversationType: ConversationType, targetId: string, callback: any): void;
        createOptions(opts: any, type: string): void;
        createUploadFactory(opts: any, type: number): any;
        createMessage(option: any, file: any, callback: any): void;
        private getThumbnail(obj, area, callback);
        private getBackground;
        private startCalcToken();
        private getFullPath(file);
    }
}
declare module RongIMLib {
    class Upload {
        static getFileInfo(): void;
        static defineUpload(): void;
        static converToBase64(file: any, callback: Function): void;
        postBase64(data: any, callback: Function): void;
    }
}
declare module RongIMLib {
    class RongIMVoice {
        private static notSupportH5;
        private static element;
        private static isInit;
        static init(): void;
        static play(data: string, duration: number, callback?: any): void;
        static stop(base64Data: string): void;
        static preLoaded(base64Data: string, callback: any): void;
        static onprogress(): void;
        private static checkInit(position);
        private static thisMovie();
        private static onCompleted(duration);
        private static base64ToBlob(base64Data, type);
    }
}
declare module RongIMLib {
    class RongCallLib implements VoIPProvider {
        _memorySessions: any;
        static _instance: RongCallLib;
        static _rongIMClient: RongIMClient;
        constructor(opt: any);
        static init(opt: any): void;
        static getInstance(): RongCallLib;
        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, callback: any): void;
        hungupCall(converType: ConversationType, targetId: string, reason: ErrorCode): void;
        joinCall(mediaType: VoIPMediaType, callback: any): void;
        changeMediaType(converType: ConversationType, targetId: string, mediaType: VoIPMediaType, callback: OperationCallback): void;
        mute(callback: Function): void;
        unmute(callback: Function): void;
        audioToVideo(conversationType: ConversationType, targetId: string, callback: any): void;
        videoToAudio(conversationType: ConversationType, targetId: string, callback: any): void;
        private switchMedia(info);
        getSummaryMessage(message: Message): SummaryMessage;
        closeRemoteStream(stream?: any): void;
        isEmptyObject(): boolean;
        initLocalStream(uId: string, mediaType: VoIPMediaType): void;
        displayStream(stream?: any): void;
        generateVideoProfile(): string;
        onReceived(message: Message): boolean;
        private sendMessage(converType, targetId, msg, callback?);
    }
}
declare module RongIMLib {
    class RongIMClient {
        static Protobuf: any;
        static LogFactory: {
            [s: string]: any;
        };
        static MessageType: {
            [s: string]: any;
        };
        static MessageParams: {
            [s: string]: any;
        };
        static RegisterMessage: {
            [s: string]: any;
        };
        static _memoryStore: any;
        static isNotPullMsg: boolean;
        static _storageProvider: StorageProvider;
        static _dataAccessProvider: DataAccessProvider;
        static _voipProvider: VoIPProvider;
        private static _instance;
        static bridge: any;
        static userStatusObserver: RongObserver;
        static getInstance(): RongIMClient;
        static showError(errorInfo: any): void;
        static userStatusListener: Function;
        static logger(params: any): void;
        static logCallback(callback: any, funcName: string): {
            onSuccess: any;
            onError: (errorCode: ErrorCode) => void;
        };
        static logSendCallback(callback: any, funcName: string): {
            onSuccess: any;
            onError: (errorCode: ErrorCode, result: Message) => void;
            onBefore: any;
        };
        static init(appKey: string, dataAccessProvider?: DataAccessProvider, options?: any, callback?: Function): void;
        static initApp(config: any, callback: Function): void;
        static connect(token: string, callback: ConnectCallback, userId?: string): void;
        static reconnect(callback: ConnectCallback, config?: any): void;
        static registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;
        static setConnectionStatusListener(listener: ConnectionStatusListener): void;
        static setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;
        logout(): void;
        disconnect(): void;
        startCustomService(custId: string, callback: any, groupId?: string): void;
        stopCustomeService(custId: string, callback: any): void;
        switchToHumanMode(custId: string, callback: any): void;
        evaluateRebotCustomService(custId: string, isRobotResolved: boolean, sugest: string, callback: any): void;
        evaluateHumanCustomService(custId: string, humanValue: number, sugest: string, callback: any): void;
        private sendCustMessage(custId, msg, callback);
        getCurrentConnectionStatus(): ConnectionStatus;
        getConnectionChannel(): ConnectionChannel;
        getStorageProvider(): string;
        setFilterMessages(msgFilterNames: string[]): void;
        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>): void;
        getCurrentUserId(): string;
        getDeltaTime(): number;
        getMessage(messageId: string, callback: ResultCallback<Message>): void;
        deleteLocalMessages(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        deleteRemoteMessages(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void;
        deleteMessages(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void;
        sendLocalMessage(message: Message, callback: SendMessageCallback): void;
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?: any): void;
        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void;
        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;
        sendStatusMessage(messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>): void;
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;
        sendRecallMessage(content: any, sendMessageCallback: SendMessageCallback): void;
        insertMessage(conversationType: ConversationType, targetId: string, senderUserId: string, content: Message, callback: ResultCallback<Message>): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, objectname?: string, direction?: boolean): void;
        setMessageContent(messageId: number, content: any, objectName: string): void;
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;
        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp: number, callback: ResultCallback<boolean>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        clearLocalStorage(callback: any): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageUId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageStatus(conersationType: ConversationType, targetId: string, timestamp: number, status: string, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
        clearTextMessageDraft(conversationType: ConversationType, targetId: string): boolean;
        getTextMessageDraft(conversationType: ConversationType, targetId: string): string;
        saveTextMessageDraft(conversationType: ConversationType, targetId: string, value: string): boolean;
        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void;
        clearConversations(callback: ResultCallback<boolean>, ...conversationTypes: ConversationType[]): void;
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;
        pottingConversation(tempConver: any): void;
        addConversation(conversation: Conversation, callback: any): void;
        private sortConversationList(conversationList);
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number, isGetHiddenConvers: boolean): void;
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number, isGetHiddenConvers: boolean): void;
        updateConversation(conversation: Conversation): Conversation;
        createConversation(conversationType: number, targetId: string, converTitle: string): Conversation;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationHidden(conversationType: ConversationType, targetId: string, isHidden: boolean): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void;
        getConversationNotificationStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<ConversationNotificationStatus>): void;
        setConversationNotificationStatus(conversationType: ConversationType, targetId: string, notificationStatus: ConversationNotificationStatus, callback: ResultCallback<ConversationNotificationStatus>): void;
        getNotificationQuietHours(callback: GetNotificationQuietHoursCallback): void;
        removeNotificationQuietHours(callback: OperationCallback): void;
        setNotificationQuietHours(startTime: string, spanMinutes: number, callback: OperationCallback): void;
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;
        quitDiscussion(discussionId: string, callback: OperationCallback): void;
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;
        setChatroomHisMessageTimestamp(chatRoomId: string, timestamp: number): void;
        getChatRoomHistoryMessages(chatRoomId: string, count: number, order: number, callback: ResultCallback<Message>): void;
        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;
        quitChatRoom(chatroomId: string, callback: OperationCallback): void;
        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any): void;
        getPublicServiceList(callback: ResultCallback<PublicServiceProfile[]>): void;
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>): void;
        private pottingPublicSearchType(bussinessType, searchType);
        searchPublicService(searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>): void;
        searchPublicServiceByType(publicServiceType: ConversationType, searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>): void;
        subscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback): void;
        unsubscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback): void;
        addToBlacklist(userId: string, callback: OperationCallback): void;
        getBlacklist(callback: GetBlacklistCallback): void;
        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;
        removeFromBlacklist(userId: string, callback: OperationCallback): void;
        getFileToken(fileType: FileType, callback: ResultCallback<string>): void;
        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void;
        addRealTimeLocationListener(conversationType: ConversationType, targetId: string, listener: RealTimeLocationListener): void;
        getRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        getRealTimeLocationCurrentState(conversationType: ConversationType, targetId: string): void;
        getRealTimeLocationParticipants(conversationType: ConversationType, targetId: string): void;
        joinRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        quitRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        startRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        updateRealTimeLocationStatus(conversationType: ConversationType, targetId: string, latitude: number, longitude: number): void;
        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, callback: ResultCallback<ErrorCode>): void;
        joinCall(mediaType: VoIPMediaType, callback: ResultCallback<ErrorCode>): void;
        hungupCall(converType: ConversationType, targetId: string, reason: ErrorCode): void;
        changeMediaType(converType: ConversationType, targetId: string, mediaType: VoIPMediaType, callback: OperationCallback): void;
        getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): any;
        clearListeners(): void;
        getUserStatus(userId: string, callback: ResultCallback<UserStatus>): void;
        setUserStatus(status: number, callback: ResultCallback<boolean>): void;
        setUserStatusListener(params: any, callback: Function): void;
    }
}
declare module RongIMLib {
    enum Qos {
        AT_MOST_ONCE = 0,
        AT_LEAST_ONCE = 1,
        EXACTLY_ONCE = 2,
        DEFAULT = 3,
    }
    enum Type {
        CONNECT = 1,
        CONNACK = 2,
        PUBLISH = 3,
        PUBACK = 4,
        QUERY = 5,
        QUERYACK = 6,
        QUERYCON = 7,
        SUBSCRIBE = 8,
        SUBACK = 9,
        UNSUBSCRIBE = 10,
        UNSUBACK = 11,
        PINGREQ = 12,
        PINGRESP = 13,
        DISCONNECT = 14,
    }
    class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
        static _ReceiveMessageListener: any;
        connectionStatus: number;
        url: string;
        self: any;
        delOnChangedCount: number;
        constructor(address: any, cb: any, self: Client);
        writeAndFlush(val: any): void;
        reconnect(callback: any): void;
        disconnect(status: number): void;
    }
    class Socket {
        static XHR_POLLING: string;
        static WEBSOCKET: string;
        socket: any;
        _events: any;
        currentURL: string;
        static getInstance(): Socket;
        connect(url: string, cb: any): any;
        createServer(): any;
        getTransport(transportType: string): any;
        send(data: any): void;
        onMessage(data: any): void;
        disconnect(status: number): this;
        reconnect(): any;
        checkTransport(): string;
        fire(x: any, args?: any): this;
        on(x: any, func: any): this;
        removeEvent(x: any, fn: any): this;
        _encode(x: any): {
            url: string;
            data: any;
        };
    }
    class Client {
        timeoutMillis: number;
        timeout_: number;
        appId: string;
        token: string;
        sdkVer: string;
        apiVer: any;
        channel: Channel;
        handler: any;
        userId: string;
        reconnectObj: any;
        heartbeat: any;
        pullMsgHearbeat: any;
        chatroomId: string;
        static userInfoMapping: any;
        SyncTimeQueue: any;
        cacheMessageIds: any;
        constructor(token: string, appId: string);
        resumeTimer(): void;
        pauseTimer(): void;
        connect(_callback: any): void;
        checkSocket(callback: any): void;
        keepLive(): void;
        clearHeartbeat(): void;
        publishMessage(_topic: any, _data: any, _targetId: any, _callback: any, _msg: any): void;
        queryMessage(_topic: string, _data: any, _targetId: string, _qos: any, _callback: any, pbtype: any): void;
        invoke(isPullMsg?: boolean, chrmId?: string, offlineMsg?: boolean): void;
        syncTime(_type?: any, pullTime?: any, chrmId?: string, offlineMsg?: boolean): void;
        __init(f: any): void;
    }
    class Bridge {
        static _client: Client;
        static getInstance(): Bridge;
        connect(appKey: string, token: string, callback: any): Client;
        setListener(_changer: any): void;
        reconnect(callabck: any): void;
        disconnect(): void;
        queryMsg(topic: any, content: any, targetId: string, callback: any, pbname?: string): void;
        pubMsg(topic: number, content: string, targetId: string, callback: any, msg: any, methodType?: number): void;
    }
    class MessageHandler {
        map: any;
        syncMsgMap: any;
        _onReceived: any;
        connectCallback: any;
        _client: Client;
        constructor(client: Client);
        putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any;
        setConnectCallback(_connectCallback: any): void;
        onReceived(msg: any, pubAckItem?: any, offlineMsg?: boolean, leftCount?: number): void;
        handleMessage(msg: any): void;
    }
}
declare module RongIMLib {
    class MessageCallback {
        timeoutMillis: number;
        timeout: any;
        onError: any;
        constructor(error: any);
        resumeTimer(): void;
        pauseTimer(): void;
        readTimeOut(isTimeout: boolean): void;
    }
    class CallbackMapping {
        publicServiceList: Array<PublicServiceProfile>;
        profile: PublicServiceProfile;
        static getInstance(): CallbackMapping;
        pottingProfile(item: any): void;
        mapping(entity: any, tag: string): any;
    }
    class PublishCallback extends MessageCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any);
        process(_status: number, messageUId: string, timestamp: number, _msg: any, messageId: number): void;
        readTimeOut(x?: any): void;
    }
    class QueryCallback extends MessageCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any);
        process(status: number, data: any, serverTime: any, pbtype: any): void;
        readTimeOut(x?: any): void;
    }
    class ConnectAck extends MessageCallback {
        _client: Client;
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any, client: Client);
        process(status: number, userId: string, timestamp: number): void;
        readTimeOut(x?: any): void;
    }
}
declare module RongIMLib {
    class Navigation {
        static Endpoint: any;
        constructor();
        connect(appId?: string, token?: string, callback?: any): Client;
        getServerEndpoint(_token: string, _appId: string, _onsuccess?: any, _onerror?: any, unignore?: any): void;
    }
}
declare module RongIMLib {
    class BaseMessage {
        _name: string;
        _header: Header;
        _headerCode: any;
        lengthSize: any;
        constructor(arg: any);
        read(In: any, length: number): void;
        write(Out: any): any;
        getHeaderFlag(): any;
        getLengthSize(): any;
        toBytes(): any;
        isRetained(): boolean;
        setRetained(retain: any): void;
        setQos(qos: any): void;
        setDup(dup: boolean): void;
        isDup(): boolean;
        getType(): number;
        getQos(): any;
        messageLength(): number;
        writeMessage(out: any): void;
        readMessage(In: any, length: number): void;
        init(args: any): void;
    }
    class ConnectMessage extends BaseMessage {
        _name: string;
        CONNECT_HEADER_SIZE: number;
        protocolId: string;
        binaryHelper: BinaryHelper;
        protocolVersion: number;
        clientId: any;
        keepAlive: any;
        appId: any;
        token: any;
        cleanSession: any;
        willTopic: any;
        will: any;
        willQos: any;
        retainWill: any;
        hasAppId: any;
        hasToken: any;
        hasWill: any;
        constructor(header: RongIMLib.Header);
        messageLength(): number;
        readMessage(stream: any): any;
        writeMessage(out: any): RongIMStream;
    }
    class ConnAckMessage extends BaseMessage {
        _name: string;
        status: any;
        userId: string;
        MESSAGE_LENGTH: number;
        timestrap: number;
        binaryHelper: BinaryHelper;
        constructor(header: any);
        messageLength(): number;
        readMessage(_in: RongIMStream, msglength: number): void;
        writeMessage(out: any): RongIMStream;
        setStatus(x: any): void;
        setUserId(_userId: string): void;
        getStatus(): any;
        getUserId(): string;
        setTimestamp(x: number): void;
        getTimestamp(): number;
    }
    class DisconnectMessage extends BaseMessage {
        _name: string;
        status: any;
        MESSAGE_LENGTH: number;
        binaryHelper: BinaryHelper;
        constructor(header: any);
        messageLength(): number;
        readMessage(_in: any): void;
        writeMessage(Out: any): void;
        setStatus(x: any): void;
        getStatus(): any;
    }
    class PingReqMessage extends BaseMessage {
        _name: string;
        constructor(header?: RongIMLib.Header);
    }
    class PingRespMessage extends BaseMessage {
        _name: string;
        constructor(header: RongIMLib.Header);
    }
    class RetryableMessage extends BaseMessage {
        _name: string;
        messageId: any;
        binaryHelper: BinaryHelper;
        constructor(argu: any);
        messageLength(): number;
        writeMessage(Out: any): any;
        readMessage(_in: any, msgLength?: number): void;
        setMessageId(_messageId: number): void;
        getMessageId(): any;
    }
    class PubAckMessage extends RetryableMessage {
        status: any;
        msgLen: number;
        date: number;
        millisecond: number;
        messageUId: string;
        timestamp: number;
        binaryHelper: BinaryHelper;
        _name: string;
        constructor(header: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setStatus(x: any): void;
        setTimestamp(timestamp: number): void;
        setMessageUId(messageUId: string): void;
        getStatus(): any;
        getDate(): number;
        getTimestamp(): number;
        getMessageUId(): string;
    }
    class PublishMessage extends RetryableMessage {
        _name: string;
        topic: any;
        data: any;
        targetId: string;
        date: any;
        binaryHelper: BinaryHelper;
        syncMsg: boolean;
        constructor(header: any, two?: any, three?: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setTopic(x: any): void;
        setData(x: any): void;
        setTargetId(x: any): void;
        setDate(x: any): void;
        setSyncMsg(x: boolean): void;
        getSyncMsg(): boolean;
        getTopic(): any;
        getData(): any;
        getTargetId(): string;
        getDate(): any;
    }
    class QueryMessage extends RetryableMessage {
        topic: any;
        data: any;
        targetId: any;
        binaryHelper: BinaryHelper;
        _name: string;
        constructor(header: any, two?: any, three?: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setTopic(x: any): void;
        setData(x: any): void;
        setTargetId(x: any): void;
        getTopic(): any;
        getData(): any;
        getTargetId(): any;
    }
    class QueryConMessage extends RetryableMessage {
        _name: string;
        constructor(messageId: any);
    }
    class QueryAckMessage extends RetryableMessage {
        _name: string;
        data: any;
        status: any;
        date: any;
        binaryHelper: BinaryHelper;
        constructor(header: RongIMLib.Header);
        readMessage(In: any, msgLength: number): void;
        getData(): any;
        getStatus(): any;
        getDate(): any;
        setDate(x: any): void;
        setStatus(x: any): void;
        setData(x: any): void;
    }
}
declare module RongIMLib {
    class MessageOutputStream {
        out: RongIMLib.RongIMStream;
        constructor(_out: any);
        writeMessage(msg: RongIMLib.BaseMessage): void;
    }
    class MessageInputStream {
        msg: any;
        flags: any;
        header: Header;
        isPolling: boolean;
        In: any;
        _in: any;
        constructor(In: any, isPolling?: boolean);
        readMessage(): any;
    }
    class Header {
        type: number;
        retain: boolean;
        qos: any;
        dup: boolean;
        syncMsg: boolean;
        constructor(_type: any, _retain?: any, _qos?: any, _dup?: any);
        getSyncMsg(): boolean;
        getType(): number;
        encode(): any;
        toString(): string;
    }
    class BinaryHelper {
        writeUTF(str: string, isGetBytes?: any): any;
        readUTF(arr: any): string;
        convertStream(x: any): RongIMStream;
        toMQttString(str: string): any;
    }
    class RongIMStream {
        pool: any;
        position: number;
        writen: number;
        poolLen: number;
        binaryHelper: BinaryHelper;
        constructor(arr: any);
        check(): boolean;
        readInt(): number;
        readLong(): number;
        readTimestamp(): number;
        readUTF(): any;
        readByte(): any;
        read(bytesArray?: any): any;
        write(_byte: any): any;
        writeChar(v: any): void;
        writeUTF(str: string): void;
        toComplements(): any;
        getBytesArray(isCom: boolean): any;
    }
}
declare module RongIMLib {
    interface Transportation {
        createTransport(url: string, method: string): any;
        send(data: any, url?: string, method?: string): any;
        onData(data?: any): string;
        onClose(ev?: any): any;
        onError(error: any): void;
        disconnect(): void;
    }
}
declare module RongIMLib {
    class SocketTransportation implements Transportation {
        url: string;
        connected: boolean;
        isClose: boolean;
        socket: WebSocket;
        queue: Array<any>;
        empty: any;
        _socket: Socket;
        _status: number;
        constructor(_socket: Socket);
        createTransport(url: string, method?: string): any;
        send(data: any): any;
        onData(data: any): string;
        onClose(ev: any): any;
        onError(error: any): void;
        addEvent(): void;
        doQueue(): void;
        disconnect(status?: number): void;
        reconnect(): void;
    }
}
declare module RongIMLib {
    class PollingTransportation implements Transportation {
        empty: Function;
        queue: Array<any>;
        sendxhr: any;
        xhr: any;
        socket: Socket;
        url: string;
        connected: boolean;
        pid: string;
        constructor(socket: Socket);
        createTransport(url: string, method?: string): any;
        private requestFactory(url, method, multipart?);
        private getRequest(url, isconnect?);
        send(data: any): void;
        onData(data?: any, header?: any): string;
        XmlHttpRequest(): any;
        onClose(): void;
        disconnect(): void;
        reconnect(): void;
        onSuccess(responseText: string, isconnect?: any): void;
        onError(): void;
    }
}
declare var typeMapping: {
    [s: string]: any;
}, registerMessageTypeMapping: {
    [s: string]: any;
}, HistoryMsgType: {
    [s: number]: any;
}, disconnectStatus: {
    [s: number]: any;
};
declare module RongIMLib {
    class Transportations {
        static _TransportType: string;
    }
    class MessageUtil {
        static sign: any;
        static checkStorageSize(): boolean;
        static getFirstKey(obj: any): string;
        static isEmpty(obj: any): boolean;
        static ArrayForm(typearray: any): Array<any>;
        static ArrayFormInput(typearray: any): Uint8Array;
        static indexOf(arr?: any, item?: any, from?: any): number;
        static isArray(obj: any): boolean;
        static forEach(arr: any, func: any): (arr: any, func: any) => void;
        static remove(array: any, func: any): void;
        static int64ToTimestamp(obj: any, isDate?: boolean): any;
        static messageParser(entity: any, onReceived?: any, offlineMsg?: boolean): any;
    }
    class MessageIdHandler {
        static messageId: number;
        static init(): void;
        static messageIdPlus(method: any): any;
        static clearMessageId(): void;
        static getMessageId(): number;
    }
    class RongInnerTools {
        static convertUserStatus(entity: any): any;
    }
}
declare module RongIMLib {
    interface ConnectionStatusListener {
        onChanged(status: number): void;
    }
    interface OnReceiveMessageListener {
        onReceived(message: Message, left: number): void;
    }
    interface RealTimeLocationListener {
        onError(errorCode: RealTimeLocationErrorCode): void;
        onParticipantsJoin(userId: string): void;
        onParticipantsQuit(userId: string): void;
        onReceiveLocation(latitude: number, longitude: number, userId: string): void;
        onStatusChange(status: RealTimeLocationStatus): void;
    }
}
declare module RongIMLib {
    abstract class MessageContent {
        messageName: string;
        constructor(data?: any);
        static obtain(): MessageContent;
        abstract encode(): string;
    }
    abstract class NotificationMessage extends MessageContent {
    }
    abstract class StatusMessage extends MessageContent {
    }
    interface UserInfoAttachedMessage {
        user: UserInfo;
    }
    interface ExtraAttachedMessage {
        extra: string;
    }
    class ModelUtil {
        static modelClone(object: any): any;
        static modleCreate(fields: string[], msgType: string): any;
    }
}
declare module RongIMLib {
    class CustomerStatusMessage implements MessageContent {
        messageName: string;
        status: number;
        constructor(message: any);
        static obtain(): CustomerStatusMessage;
        encode(): string;
    }
    class ChangeModeResponseMessage implements MessageContent {
        messageName: string;
        code: number;
        data: any;
        msg: string;
        constructor(message: any);
        static obtain(): ChangeModeResponseMessage;
        encode(): string;
    }
    class ChangeModeMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        constructor(message: any);
        static obtain(): ChangeModeMessage;
        encode(): string;
    }
    class CustomerStatusUpdateMessage implements MessageContent {
        messageName: string;
        serviceStatus: string;
        sid: string;
        constructor(message: any);
        static obtain(): CustomerStatusUpdateMessage;
        encode(): string;
    }
    class HandShakeMessage implements MessageContent {
        messageName: string;
        groupid: string;
        constructor(message?: any);
        static obtain(): HandShakeMessage;
        encode(): string;
    }
    class CustomerContact implements MessageContent {
        messageName: string;
        page: any;
        nickName: string;
        routingInfo: any;
        info: any;
        requestInfo: any;
        constructor(message: any);
        encode(): string;
    }
    class EvaluateMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        source: number;
        suggest: string;
        isresolve: boolean;
        type: number;
        constructor(message: any);
        static obtain(): EvaluateMessage;
        encode(): string;
    }
    class HandShakeResponseMessage implements MessageContent {
        messageName: string;
        msg: string;
        status: number;
        data: any;
        constructor(message: any);
        static obtain(): HandShakeResponseMessage;
        encode(): string;
    }
    class SuspendMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        constructor(message: any);
        static obtain(): SuspendMessage;
        encode(): string;
    }
    class TerminateMessage implements MessageContent {
        messageName: string;
        code: number;
        msg: string;
        sid: string;
        constructor(message: any);
        static obtain(): TerminateMessage;
        encode(): string;
    }
}
declare module RongIMLib {
    class IsTypingStatusMessage implements StatusMessage {
        messageName: string;
        constructor(data: string);
        encode(): string;
        getMessage(): any;
    }
}
declare module RongIMLib {
    class InformationNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        message: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(message: string): InformationNotificationMessage;
        encode(): string;
    }
    class CommandMessage implements MessageContent, ExtraAttachedMessage {
        data: string;
        extra: string;
        name: string;
        messageName: string;
        constructor(message: any);
        static obtain(data: string): CommandMessage;
        encode(): string;
    }
    class ContactNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        static CONTACT_OPERATION_ACCEPT_RESPONSE: string;
        static CONTACT_OPERATION_REJECT_RESPONSE: string;
        static CONTACT_OPERATION_REQUEST: string;
        operation: string;
        targetUserId: string;
        sourceUserId: string;
        message: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(operation: string, sourceUserId: string, targetUserId: string, message: string): InformationNotificationMessage;
        encode(): string;
    }
    class ProfileNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        operation: string;
        data: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(operation: string, data: string): ProfileNotificationMessage;
        encode(): string;
    }
    class CommandNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        data: string;
        name: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(name: string, data: string): CommandNotificationMessage;
        encode(): string;
    }
    class DiscussionNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        extension: string;
        type: number;
        isHasReceived: boolean;
        operation: string;
        messageName: string;
        constructor(message: any);
        encode(): string;
    }
    class GroupNotificationMessage implements MessageContent {
        messageName: string;
        operatorUserId: string;
        operation: string;
        message: string;
        data: any;
        extra: string;
        constructor(msg: any);
        encode(): string;
    }
}
declare module RongIMLib {
    class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        content: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(text: string): TextMessage;
        encode(): string;
    }
    class TypingStatusMessage implements MessageContent {
        typingContentType: string;
        data: string;
        messageName: string;
        constructor(message: any);
        static obtain(typingContentType: string, data: string): TypingStatusMessage;
        encode(): string;
    }
    class ReadReceiptMessage implements MessageContent {
        lastMessageSendTime: number;
        messageUId: string;
        type: number;
        messageName: string;
        constructor(message: any);
        static obtain(messageUId: string, lastMessageSendTime: number, type: ConversationType): ReadReceiptMessage;
        encode(): string;
    }
    class VoiceMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        content: string;
        duration: number;
        extra: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(base64Content: string, duration: number): VoiceMessage;
        encode(): string;
    }
    class RecallCommandMessage implements MessageContent {
        messageName: string;
        messageUId: string;
        conversationType: ConversationType;
        targetId: string;
        sentTime: number;
        extra: string;
        user: UserInfo;
        constructor(message: any);
        encode(): string;
    }
    class ImageMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        content: string;
        imageUri: string;
        extra: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(content: string, imageUri: string): ImageMessage;
        encode(): string;
    }
    class LocationMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        latitude: number;
        longitude: number;
        poi: string;
        content: string;
        extra: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(latitude: number, longitude: number, poi: string, content: string): LocationMessage;
        encode(): string;
    }
    class RichContentMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        title: string;
        content: string;
        imageUri: string;
        extra: string;
        url: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(title: string, content: string, imageUri: string, url: string): RichContentMessage;
        encode(): string;
    }
    class JrmfReadPacketMessage implements MessageContent {
        messageName: string;
        message: JrmfReadPacketMessage;
        constructor(message: any);
        encode(): string;
    }
    class JrmfReadPacketOpenedMessage implements MessageContent {
        messageName: string;
        message: JrmfReadPacketOpenedMessage;
        constructor(message: any);
        encode(): string;
    }
    class UnknownMessage implements MessageContent {
        message: UnknownMessage;
        messageName: string;
        constructor(message: any);
        encode(): string;
    }
    class PublicServiceCommandMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        menuItem: PublicServiceMenuItem;
        content: string;
        extra: string;
        mentionedInfo: MentionedInfo;
        messageName: string;
        constructor(message: any);
        static obtain(item: PublicServiceMenuItem): PublicServiceCommandMessage;
        encode(): string;
    }
    class PublicServiceMultiRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        user: UserInfo;
        richContentMessages: Array<RichContentMessage>;
        messageName: string;
        constructor(messages: Array<RichContentMessage>);
        encode(): any;
    }
    class SyncReadStatusMessage implements MessageContent {
        messageName: string;
        lastMessageSendTime: number;
        constructor(message: any);
        encode(): string;
    }
    class ReadReceiptRequestMessage implements MessageContent {
        messageName: string;
        messageUId: string;
        constructor(message: any);
        encode(): string;
    }
    class ReadReceiptResponseMessage implements MessageContent {
        messageName: string;
        receiptMessageDic: any;
        constructor(message: any);
        encode(): string;
    }
    class PublicServiceRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        user: UserInfo;
        richContentMessage: RichContentMessage;
        messageName: string;
        constructor(message: RichContentMessage);
        encode(): any;
    }
    class FileMessage implements MessageContent {
        user: UserInfo;
        messageName: string;
        name: string;
        size: number;
        type: string;
        fileUrl: string;
        extra: string;
        constructor(message: any);
        static obtain(msg: any): FileMessage;
        encode(): string;
    }
    class AcceptMessage implements MessageContent {
        messageName: string;
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any);
        encode(): string;
    }
    class RingingMessage implements MessageContent {
        messageName: string;
        callId: string;
        constructor(message: any);
        encode(): string;
    }
    class SummaryMessage implements MessageContent {
        messageName: string;
        caller: string;
        inviter: string;
        mediaType: VoIPMediaType;
        memberIdList: string[];
        startTime: number;
        connectedTime: number;
        duration: number;
        status: ErrorCode;
        constructor(message: any);
        encode(): string;
    }
    class HungupMessage implements MessageContent {
        messageName: string;
        callId: string;
        reason: string;
        constructor(message: any);
        encode(): string;
    }
    class InviteMessage implements MessageContent {
        messageName: string;
        callId: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        inviteUserIds: string[];
        extra: string;
        constructor(message: any);
        encode(): string;
    }
    class MediaModifyMessage implements MessageContent {
        messageName: string;
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any);
        encode(): string;
    }
    class MemberModifyMessage implements MessageContent {
        messageName: string;
        modifyMemType: number;
        callId: string;
        caller: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        extra: string;
        inviteUserIds: string[];
        existedMemberStatusList: string[];
        constructor(message: any);
        encode(): string;
    }
}
declare module RongIMLib {
    class ChannelInfo {
        Id: string;
        Key: string;
        constructor(Id: string, Key: string);
    }
    class UserStatus {
        platform: string[];
        online: boolean;
        status: number;
        constructor(platform?: string[], online?: boolean, status?: number);
    }
    class MentionedInfo {
        constructor(type?: MentionedType, userIdList?: string[], mentionedContent?: string);
    }
    class DeleteMessage {
        msgId: string;
        msgDataTime: number;
        direct: number;
        constructor(msgId?: string, msgDataTime?: number, direct?: number);
    }
    class CustomServiceConfig {
        constructor(isBlack?: boolean, companyName?: string, companyUrl?: string);
    }
    class CustomServiceSession {
        constructor(uid?: string, cid?: string, pid?: string, isQuited?: boolean, type?: number, adminHelloWord?: string, adminOfflineWord?: string);
    }
    class Conversation {
        conversationTitle: string;
        conversationType: ConversationType;
        draft: string;
        isTop: boolean;
        latestMessage: any;
        latestMessageId: string;
        notificationStatus: ConversationNotificationStatus;
        objectName: string;
        receivedStatus: ReceivedStatus;
        receivedTime: number;
        senderUserId: string;
        senderUserName: string;
        sentStatus: SentStatus;
        sentTime: number;
        targetId: string;
        unreadMessageCount: number;
        senderPortraitUri: string;
        isHidden: boolean;
        mentionedMsg: any;
        hasUnreadMention: boolean;
        _readTime: number;
        constructor(conversationTitle?: string, conversationType?: ConversationType, draft?: string, isTop?: boolean, latestMessage?: any, latestMessageId?: string, notificationStatus?: ConversationNotificationStatus, objectName?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, senderUserName?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, unreadMessageCount?: number, senderPortraitUri?: string, isHidden?: boolean, mentionedMsg?: any, hasUnreadMention?: boolean, _readTime?: number);
        setTop(): void;
    }
    class Discussion {
        creatorId: string;
        id: string;
        memberIdList: string[];
        name: string;
        isOpen: boolean;
        constructor(creatorId?: string, id?: string, memberIdList?: string[], name?: string, isOpen?: boolean);
    }
    class Group {
        id: string;
        name: string;
        portraitUri: string;
        constructor(id: string, name: string, portraitUri: string);
    }
    class Message {
        content: MessageContent;
        conversationType: ConversationType;
        extra: string;
        objectName: string;
        messageDirection: MessageDirection;
        messageId: string;
        receivedStatus: ReceivedStatus;
        receivedTime: number;
        senderUserId: string;
        sentStatus: SentStatus;
        sentTime: number;
        targetId: string;
        messageType: string;
        messageUId: string;
        isLocalMessage: boolean;
        offLineMessage: boolean;
        receiptResponse: any;
        constructor(content?: MessageContent, conversationType?: ConversationType, extra?: string, objectName?: string, messageDirection?: MessageDirection, messageId?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, messageType?: string, messageUId?: string, isLocalMessage?: boolean, offLineMessage?: boolean, receiptResponse?: any);
    }
    class MessageTag {
        isCounted: boolean;
        isPersited: boolean;
        constructor(isCounted: boolean, isPersited: boolean);
        getMessageTag(): number;
    }
    class PublicServiceMenuItem {
        id: string;
        name: string;
        type: ConversationType;
        sunMenuItems: Array<PublicServiceMenuItem>;
        url: string;
        constructor(id?: string, name?: string, type?: ConversationType, sunMenuItems?: Array<PublicServiceMenuItem>, url?: string);
    }
    class PublicServiceProfile {
        conversationType: ConversationType;
        introduction: string;
        menu: Array<PublicServiceMenuItem>;
        name: string;
        portraitUri: string;
        publicServiceId: string;
        hasFollowed: boolean;
        isGlobal: boolean;
        constructor(conversationType?: ConversationType, introduction?: string, menu?: Array<PublicServiceMenuItem>, name?: string, portraitUri?: string, publicServiceId?: string, hasFollowed?: boolean, isGlobal?: boolean);
    }
    class UserInfo {
        id: string;
        name: string;
        portraitUri: string;
        constructor(id: string, name: string, portraitUri: string);
    }
}
declare module RongIMLib {
    interface DataAccessProvider {
        init(appKey: string, callback?: Function): void;
        connect(token: string, callback: ConnectCallback, userId?: string): void;
        reconnect(callback: ConnectCallback, config?: any): void;
        logout(): void;
        disconnect(): void;
        setConnectionStatusListener(listener: ConnectionStatusListener): void;
        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;
        clearListeners(): void;
        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void;
        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;
        sendRecallMessage(conent: any, sendMessageCallback: SendMessageCallback, user?: UserInfo): void;
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number, isGetHiddenConvers?: boolean): void;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;
        quitDiscussion(discussionId: string, callback: OperationCallback): void;
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;
        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;
        setChatroomHisMessageTimestamp(chatRoomId: string, timestamp: number): void;
        getChatRoomHistoryMessages(chatRoomId: string, count: number, order: number, callback: ResultCallback<Message>): void;
        quitChatRoom(chatroomId: string, callback: OperationCallback): void;
        addToBlacklist(userId: string, callback: OperationCallback): void;
        getBlacklist(callback: GetBlacklistCallback): void;
        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;
        removeFromBlacklist(userId: string, callback: OperationCallback): void;
        getFileToken(fileType: FileType, callback: ResultCallback<string>): void;
        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void;
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?: any): void;
        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;
        updateConversation(conversation: Conversation): Conversation;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;
        getMessage(messageId: string, callback: ResultCallback<Message>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number, isGetHiddenConvers?: boolean): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, objectname?: string, directrion?: boolean): void;
        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void;
        setConversationHidden(conversationType: ConversationType, targetId: string, isHidden: boolean): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void;
        getDelaTime(): number;
        setServerInfo(info: any): void;
        getUserStatus(userId: string, callback: ResultCallback<UserStatus>): void;
        setUserStatus(status: number, callback: ResultCallback<boolean>): void;
        setUserStatusListener(params: any, callback: Function): void;
        subscribeUserStatus(userIds: string[], callback?: ResultCallback<boolean>): void;
        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp: number, callback: ResultCallback<boolean>): void;
        getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): any;
        setMessageStatus(conersationType: ConversationType, targetId: string, timestamp: number, status: string, callback: ResultCallback<boolean>): void;
        setMessageContent(messageId: number, content: any, objectName: string): void;
        getConversationNotificationStatus(params: any, callback: any): void;
        setConversationNotificationStatus(params: any, callback: any): void;
        getCurrentConnectionStatus(): number;
        setDeviceId(deviceId: string): void;
        setEnvironment(isPrivate: boolean): void;
        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>): void;
        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any): void;
        getPublicServiceProfile(publicServiceType: number, publicServiceId: string, callback: any): void;
    }
}
declare module RongIMLib {
    class ServerDataProvider implements DataAccessProvider {
        userStatusListener: Function;
        init(appKey: string, callback?: Function): void;
        connect(token: string, callback: ConnectCallback): void;
        reconnect(callback: ConnectCallback, config?: any): void;
        logout(): void;
        disconnect(): void;
        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void;
        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;
        sendRecallMessage(content: any, sendMessageCallback: SendMessageCallback): void;
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number): void;
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;
        quitDiscussion(discussionId: string, callback: OperationCallback): void;
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;
        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;
        quitChatRoom(chatroomId: string, callback: OperationCallback): void;
        setChatroomHisMessageTimestamp(chatRoomId: string, timestamp: number): void;
        getChatRoomHistoryMessages(chatRoomId: string, count: number, order: number, callback: any): void;
        setMessageStatus(conversationType: ConversationType, targetId: string, timestamp: number, status: string, callback: ResultCallback<Boolean>): void;
        addToBlacklist(userId: string, callback: OperationCallback): void;
        getBlacklist(callback: GetBlacklistCallback): void;
        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;
        removeFromBlacklist(userId: string, callback: OperationCallback): void;
        getFileToken(fileType: FileType, callback: ResultCallback<string>): void;
        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void;
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?: any): void;
        setConnectionStatusListener(listener: ConnectionStatusListener): void;
        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;
        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;
        updateConversation(conversation: Conversation): Conversation;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        getMessage(messageId: string, callback: ResultCallback<Message>): void;
        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, messageIds: DeleteMessage[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number, isHidden?: boolean): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        setMessageContent(messageId: number, content: any, objectname: string): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp: number, callback: ResultCallback<boolean>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void;
        getConversationNotificationStatus(params: any, callback: any): void;
        setConversationNotificationStatus(params: any, callback: any): void;
        getUserStatus(userId: string, callback: ResultCallback<UserStatus>): void;
        setUserStatus(status: number, callback: ResultCallback<boolean>): void;
        subscribeUserStatus(userIds: string[], callback?: ResultCallback<boolean>): void;
        setUserStatusListener(params: any, callback?: Function): void;
        clearListeners(): void;
        setServerInfo(info: any): void;
        getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): any;
        setConversationHidden(conversationType: ConversationType, targetId: string, isHidden: boolean): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
        getAllConversations(callback: ResultCallback<Conversation[]>): void;
        getConversationByContent(keywords: string, callback: ResultCallback<Conversation[]>): void;
        getMessagesFromConversation(conversationType: ConversationType, targetId: string, keywords: string, callback: ResultCallback<Message[]>): void;
        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void;
        getDelaTime(): number;
        getCurrentConnectionStatus(): number;
        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>): void;
        setDeviceId(deviceId: string): void;
        setEnvironment(isPrivate: boolean): void;
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>): void;
        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any): void;
    }
}
declare module RongIMLib {
    class VCDataProvider implements DataAccessProvider {
        addon: Addon;
        messageListener: OnReceiveMessageListener;
        connectListener: ConnectionStatusListener;
        userId: string;
        connectCallback: ConnectCallback;
        useConsole: boolean;
        constructor(addon: any);
        init(appKey: string): void;
        connect(token: string, callback: ConnectCallback, userId?: string): void;
        setServerInfo(info: any): void;
        logout(): void;
        disconnect(): void;
        clearListeners(): void;
        setConnectionStatusListener(listener: ConnectionStatusListener): void;
        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;
        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;
        setMessageStatus(conversationType: ConversationType, targetId: string, timestamp: number, status: string, callback: ResultCallback<Boolean>): void;
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number, isGetHiddenConvers: boolean): void;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        joinChatRoom(chatRoomId: string, messageCount: number, callback: OperationCallback): void;
        quitChatRoom(chatRoomId: string, callback: OperationCallback): void;
        addToBlacklist(userId: string, callback: OperationCallback): void;
        getBlacklist(callback: GetBlacklistCallback): void;
        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;
        removeFromBlacklist(userId: string, callback: OperationCallback): void;
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?: any): void;
        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;
        addMessage(conversationType: ConversationType, targetId: string, message: any, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;
        getMessage(messageId: string, callback: ResultCallback<Message>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number, isGetHiddenConvers?: boolean): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        setMessageContent(messageId: number, content: any, objectName: string): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, objectname?: string, direction?: boolean): void;
        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void;
        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp: number, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void;
        setConversationHidden(conversationType: ConversationType, targetId: string, isHidden: boolean): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
        getFileToken(fileType: FileType, callback: ResultCallback<any>): void;
        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<any>): void;
        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void;
        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;
        setChatroomHisMessageTimestamp(chatRoomId: string, timestamp: number): void;
        getChatRoomHistoryMessages(chatRoomId: string, count: number, order: number, callback: ResultCallback<Message>): void;
        getDelaTime(): number;
        getUserStatus(userId: string, callback: ResultCallback<UserStatus>): void;
        setUserStatus(status: number, callback: ResultCallback<boolean>): void;
        subscribeUserStatus(userIds: string[], callback: ResultCallback<boolean>): void;
        setUserStatusListener(params: any, callback: Function): void;
        getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): any;
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;
        sendRecallMessage(content: any, sendMessageCallback: SendMessageCallback): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        reconnect(callback: ConnectCallback): void;
        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;
        quitDiscussion(discussionId: string, callback: OperationCallback): void;
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;
        setDeviceId(deviceId: string): void;
        setEnvironment(isPrivate: boolean): void;
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;
        updateConversation(conversation: Conversation): Conversation;
        getConversationNotificationStatus(params: any, callback: any): void;
        setConversationNotificationStatus(params: any, callback: any): void;
        getCurrentConnectionStatus(): number;
        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>): void;
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>): void;
        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any): void;
        private buildMessage(result);
        private buildConversation(val);
    }
}
declare module RongIMLib {
    interface StorageProvider {
        _host: string;
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        getItemKey(composedStr: string): string;
        removeItem(composedKey: string): void;
        clearItem(): void;
        onOutOfQuota(): number;
    }
    interface ComposeKeyFunc {
        (object: any): string;
    }
    interface VoIPProvider {
        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, callback: ResultCallback<ErrorCode>): void;
        hungupCall(converType: ConversationType, targetId: string, reason: ErrorCode): void;
        joinCall(mediaType: VoIPMediaType, callback: ResultCallback<ErrorCode>): void;
        onReceived(message: Message): boolean;
        changeMediaType(converType: ConversationType, targetId: string, mediaType: VoIPMediaType, callback: OperationCallback): void;
    }
}
declare module RongIMLib {
    class MemeoryProvider implements StorageProvider {
        _host: string;
        _memeoryStore: any;
        prefix: string;
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        removeItem(composedKey: string): void;
        getItemKey(regStr: string): any;
        clearItem(): void;
        onOutOfQuota(): number;
    }
}
declare module RongIMLib {
    class LocalStorageProvider implements StorageProvider {
        prefix: string;
        _host: string;
        constructor();
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        getItemKey(composedStr: string): string;
        removeItem(composedKey: string): void;
        clearItem(): void;
        onOutOfQuota(): number;
    }
}
declare module RongIMLib {
    class UserDataProvider implements StorageProvider {
        oPersist: any;
        opersistName: string;
        keyManager: string;
        _host: string;
        prefix: string;
        constructor();
        setItem(key: string, value: any): void;
        getItem(key: string): string;
        removeItem(key: string): void;
        getItemKey(composedStr: string): string;
        clearItem(): void;
        onOutOfQuota(): number;
    }
}
declare module RongIMLib {
    interface UploadProvider {
        setListeners(listeners: any): void;
        start(conversationType: ConversationType, targetId: string): void;
        cancel(file: any): void;
        reload(image: string, file: string): void;
        destroy(): void;
        postImage(base64: string, file: any, conversationType: ConversationType, targetId: string, callback: any): void;
    }
}
declare module RongIMLib {
    class FeatureDectector {
        script: any;
        head: any;
        constructor(callback?: any);
    }
}
declare module RongIMLib {
    class FeaturePatcher {
        patchAll(): void;
        patchForEach(): void;
        patchJSON(): void;
    }
}
declare module RongIMLib {
}
