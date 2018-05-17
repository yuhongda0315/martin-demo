var webpush = require('web-push');
var express      = require('express')
var bodyParser = require('body-parser');

var app = express()

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

webpush.setGCMAPIKey(process.env.GCM_API_KEY || null);

app.post('/register', function(req, res){
    res.status(201).send(JSON.stringify({
        code: 201
    }));
});

app.post('/sendNotification', function(req, res){

    var pushSubscription = {
      endpoint: req.body.endpoint,
      TTL: 1,
      keys: {
        p256dh: req.body.key,
        auth: req.body.authSecret
      }
    };
     
    webpush.sendNotification(pushSubscription, 'Your Push Payload Text').then(function(){
      res.end(JSON.stringify({
        code: 200
      }));
    }).catch(function(error) {
      console.log(error);
      res.status(500).send(JSON.stringify({
        code: 500
      }));
    });
});


app.listen(3000)
console.log('listener port : 3000');