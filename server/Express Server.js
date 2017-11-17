var express = require('express');
var path = require('path');
var bp = require('body parser');

app = express();

app.get('/', function(req, res){
    console.log(req);
    console.log(res);
    res.sendFile(path.join(__dirname, 'demo.html')
};
