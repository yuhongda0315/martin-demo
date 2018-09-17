/**
 * 窗口基类，封装通用的窗口操作
 */

const { BrowserWindow } = require('electron');

/**
 * 基本窗口样式
 * @type {{width: number, height: number, resizable: boolean, frame: boolean, parent: object, modal: boolean}}
 */
const windowStyle = {
    title: '测试', // 窗口标题
    width: 800, // 宽
    height: 600, // 高
    resizable: true, // 窗口大小是否可变
 //   frame: false, // 是否带边框
    parent: null, // 父窗口
    modal: false, // 是否模态窗口
    show: false, // 是否显示窗口
};

/**
 * 窗口类，继承electron的BrowserWindow
 * @extends BrowserWindow
 */
class EucWindow extends BrowserWindow {
    /**
     * 窗口类，继承electron的BrowserWindow
     * @param style 窗口样式
     * @param url
     * @param win
     */
    constructor(style, url, win) {
        const myStyle = Object.assign({}, windowStyle, style);
        super(myStyle);

        win = this;

        // 阻止跳转链接
        this.webContents.on( 'will-navigate', (event)=>{
            event.preventDefault();
        });

        win.webContents.openDevTools({detach:true});

        // 加载网页
        this.loadURL(url);

        this.on('closed', function() {
            win = null;
        });

    }

}

module.exports = EucWindow;