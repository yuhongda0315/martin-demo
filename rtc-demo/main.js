/**
 * 主程序入口
 */

const path = require('path');
const { app, Menu, BrowserWindow, crashReporter, globalShortcut } = require('electron');
const WindowManager = require('./main_process/window/window_manager.js');

// // 启动崩溃采集
// crashReporter.start({
//     productName: 'V6',
//     companyName: '10086',
//     submitURL: 'http://10.10.40.130:1127/post',
//     autoSubmit: true
// });

app.on('ready', function () {
    // 封掉菜单栏
    Menu.setApplicationMenu(null);

    // 窗口管理，存到BrowserWindow作为全局变量
    BrowserWindow.windowManager = new WindowManager();
    BrowserWindow.windowManager.createMainWindow();

    // 托盘，存到BrowserWindow作为全局变量
    BrowserWindow.tray = require('./main_process/window/tray.js');

    // 注册快捷键，用于打开当前窗口的调试
    globalShortcut.register('ctrl+shift+alt+e', function() {
        let win = BrowserWindow.getFocusedWindow();
        if(win){
            win.webContents.openDevTools({detach:true});
        }
    });
});


app.on('will-quit', function() {
    console.log('即将退出');
});
app.on('before-quit', function() {
    console.log('退出前');
});





