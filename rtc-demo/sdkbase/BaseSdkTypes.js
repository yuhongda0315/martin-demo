/*
 * Media Type
 */
var UserMediaType = {
    UserMediaType_Audio : 0,          // 音频
    UserMediaType_Audio_Video : 1,    // 音视频
};


/*
 * appDoSelectResolution参数profile_type
 */
var VideoResolutionProfile = {
    VideoProfile_288P_15F : 0,		    // 分辨率352*288，帧率15
    VideoProfile_480P_15F : 10,			// 分辨率640*480，帧率15
    VideoProfile_720P_15F : 20,	        // 分辨率1280*720，帧率15
};

/*
 * 返回值
 */
var ResultCode = {
    Success : 0,            // 操作成功
    Failed : 1,             // 操作失败
    CaptureNotFound : 2,    // 没有找到摄像头
    EngineNotInit : 3,      // Blink引擎初没有初始化
    EngineHaveInit : 4,     //Blink引擎已经初始化过
    InvalidArgument : 5,    //参数无效
    InvalidInterface : 6,   //接口无效
};