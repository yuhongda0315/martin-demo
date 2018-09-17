/**
 * Created by Administrator on 2017/7/4.
 */

var Electron = require('electron');

var baseSdk = require("./../../sdkbase/BaseSdk");

var Buffer222 = require('buffer').Buffer;

process.once('loaded', () => {
    global.Electron = Electron;
    global.baseSdk = baseSdk;
    global.Buffer222 = Buffer222;
});