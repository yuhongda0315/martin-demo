/**
 * 窗口管理类，单例，负责创建所有窗口，保存窗口实例
 */

const path = require('path');
const os = require('os');
const EucWindow = require('./euc_window');


/**
 * 窗口管理类，单例，负责创建所有窗口，保存窗口实例
 */
class WindowManager {
    constructor() {

        this.main = null;
        this.about = null;
        this.setting = null;
        this.voip = null;
    }

    /**
     * 主窗口
     * @returns {EucWindow}
     */
     createMainWindow(){
        if(this.main) return this.main;


        // 主窗口样式
        const mainStyle = {
            // width: 280,
            // height: 400,
            // resizable: false,
   //         frame: os.platform() !== "win32",
            show: true,
            webPreferences: {
                nodeIntegration: false,
                preload: path.join(__dirname,  'preload.js'),
                webSecurity:false
            }
        };

        this.main = new EucWindow(mainStyle, path.join(__dirname, '../../index.html'), this.main);

        return this.main;
    }


    /**
     * 关于窗口
     * @returns {EucWindow}
     */
    createAboutWindow() {

        if(this.about) return this.about;

        // 关于窗口样式
        const style = {
            width: 288,
            height: 336,
            resizable: false,
            frame: os.platform() !== "win32",
            show: true,
            modal: true,
            parent: this.main
        };

        this.about = new EucWindow(style, path.join(__dirname, '../test.html'), this.about);
        return this.about;
    }

    /**
     * 音视频窗口
     * @returns {EucWindow}
     */
    createVoipWindow() {

        if(this.voip) return this.voip;

        // 关于窗口样式
        const style = {
            width: 704,
            height: 576,
            resizable: false,
           // frame: os.platform() !== "win32",
            show: true,
          //  modal: true,
         //   parent: this.main
        };

        this.voip = new EucWindow(style, path.join(__dirname, '../../voip_client.html'), this.voip);
        return this.voip;
    }
}







module.exports = WindowManager;
