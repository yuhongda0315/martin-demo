var serviceWorker = navigator.serviceWorker;
serviceWorker.register('sw-push.js')
  .then(reg => {
    console.log('SW registered!', reg);
    reg.update();
    Notification.requestPermission();
  }).then(() => {
      serviceWorker.controller.postMessage({
        topic: 'notify',
        opts: {
          appkey: '8luwapkvucoil',
          token: 'TYNNVWpizr/23FXmq1I8rbrkPG6U/xPk3zvPIWf9le0Ft3u/nBdfKN51dKfA4hllDJ2T5/iexcI8TXMh8CCjnPq2I3apBmAF',
          server: 'http://120.92.13.85:8235',
          sdkver: '2.3.0'
        }
      });
  }).catch(err => {
    console.error(err);
  });