var serviceWorker = navigator.serviceWorker;
serviceWorker.register('sw-push.js')
  .then(reg => {
    console.log('SW registered!', reg);
    reg.update();
    Notification.requestPermission();

    serviceWorker.addEventListener('controllerchange', () => {
    serviceWorker.controller.postMessage({
        topic: 'notify',
        opts: {
          appkey: '8luwapkvucoil',
          token: '+drDnoaSFUc16THmJMNSW8SkAMimzaj6nB20cRPaYWTXhIiM2IspAPkUejp9kmaaEgDANdo6gtfIf/e5MXMHJw==',
          server: 'https://comet.cn.ronghub.com:8233',
          sdkver: '2.3.0'
        }
      });
  });
  }).catch(err => {
    console.error(err);
  });