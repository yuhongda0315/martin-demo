const RongRTCNode = require("../../Windows/sdk/RongRTCNode.node").RongRTCNode;
var sdk = new RongRTCNode();


exports.appDoSetLogEnabled = function (log_level, log_file) {
    sdk.doSetLogEnabled(log_level, log_file);
};

exports.appDoGetSDKVersion = function () {
    return sdk.doGetSDKVersion();
};

exports.appDoSelectResolution = function (profile_type) {
    return sdk.doSelectResolution(profile_type);
};

exports.appDoInit = function (cmp_ip,cmp_crt,cmp_crt_len,notify,data_notify) {
    return sdk.doInit(cmp_ip,cmp_crt,cmp_crt_len,notify,data_notify);
};

exports.appDoReSetServerConfig = function (cmp_ip,cmp_crt,cmp_crt_len) {
    return sdk.doReSetServerConfig(cmp_ip,cmp_crt,cmp_crt_len);
};

exports.appDoUninit = function () {
    return sdk.doUninit();
};

exports.appDoJoinChannel = function (channel_id,user_id,name,role_type,token,notification_type,resource_type,default_subscribe_resource_type,special_subscribe_resource_type, is_sos) {
    return sdk.doJoinChannel(channel_id,user_id,name,role_type,token,notification_type,resource_type,default_subscribe_resource_type,special_subscribe_resource_type,is_sos);
};

exports.appDoLeaveChannel = function () {
    return sdk.doLeaveChannel();
};
