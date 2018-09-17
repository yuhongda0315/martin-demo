/**
 * 托盘的处理
 * 导出的是实例
 */
const {Tray, BrowserWindow, Menu} = require('electron');
const path = require('path');

let appTray = new Tray(path.join(__dirname, '../img/logo.ico'));
let contextMenu = Menu.buildFromTemplate([
    {
        label: '关于',
        click: function (/* item, focusedWindow */) {
            BrowserWindow.windowManager.createAboutWindow();
        }
    },
    {
        label: '退出',
        click: function (/* item, focusedWindow */) {
            BrowserWindow.windowManager.main.close();
        }
    }
]);
appTray.setToolTip('测试');
appTray.setContextMenu(contextMenu);
appTray.on('click', (/* event, bounds */)=> {
    if(BrowserWindow.windowManager.main && !BrowserWindow.windowManager.main.isDestroyed()) {
        BrowserWindow.windowManager.main.show();
    }
});

module.exports = appTray;
