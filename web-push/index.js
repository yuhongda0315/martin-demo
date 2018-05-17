var endpoint;
var key;
var authSecret;


var request = function(options, callback){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var result = xhr.responseText || "{}";
      callback && callback(result);
    }
  };

  var method = options.url;
  var url = options.url;
  xhr.open(options.method, url, true);

  var headers = options.headers;
  for(var key in headers) {
    var value = headers[key];
    xhr.setRequestHeader(key, value);
  }
  xhr.send(JSON.stringify(options.body));
};
navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    return registration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription;
        }
        return registration.pushManager.subscribe({
          userVisibleOnly: true
        });
      });
  }).then(function(subscription) {

    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    key = rawKey ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
      '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    authSecret = rawAuthSecret ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
      '';

    endpoint = subscription.endpoint;

    request({
      url: 'http://127.0.0.1:3000/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        endpoint: endpoint,
        key: key,
        authSecret: authSecret,
      }
    });
  });

document.getElementById('doIt').onclick = function() {
  var payload = document.getElementById('notification-payload').value;
  var delay = document.getElementById('notification-delay').value;
  var ttl = document.getElementById('notification-ttl').value;

  request({
    url: 'http://127.0.0.1:3000/sendNotification',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: {
      endpoint: endpoint,
      key: key,
      authSecret: authSecret,
      payload: payload,
      delay: delay,
      ttl: ttl
    }
  });
};