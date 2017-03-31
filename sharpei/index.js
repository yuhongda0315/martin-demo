var express = require('express'),
    sharpei = require('./lib/sharpei');

var app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function(req, res, next) {
    res.set({
        'Content-Type': 'text/html'
    });
    res.sendfile('./index.html');
});
app.get('/:folder/:name', function(req, res, next) {
    var path = "./" + req.params.folder + "/" + req.params.name;
    res.sendfile(path);
});

app.listen(9898)
console.log('listener port : 9898');