/* *****************************
        Configure Express
 */
var express = require('express');
var errorHandler = require('errorhandler');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(errorHandler({dumpExceptions: true}));

app.get("/", function (req, res) {
    res.redirect("/index.html");
});


// Import Sparky
//var owled = require('./server/owled');
var owled = require('./server/owled-fake');
//var sparky = require('./server/sparky');

/* *****************************
     Start a Socket.IO Server
 */

var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var redisClient = redis.createClient();
http.listen(3000);

io.on('connect',function(socket){
    var results = redisClient.LRANGE('owled:results',0,25,function(err,res){
        var test = "hi";
        socket.emit('owledHistory',res);
    });
});

// Listen for events on sparky, and announce them to connected clients.
owled.on('startBlinking', function(){
    console.log('Sparky Blinks!');
    io.sockets.emit('owledStart');
});

owled.on('endBlinking', function(res){
    console.log('Owled Says... Red: ' + res.red + ' Green: ' + res.green);
    res.history = getColorString(res);
    io.sockets.emit('owledResult',res);
    redisClient.LPUSH('owled:results' , getColorString(res));
});

function getColorString(res){
    msg = '';
    msg += res.red ? 'RED' : '';
    msg += res.green ? 'GREEN' : '';
    msg = msg.length ? msg : 'OFF';

    return msg;
}

setInterval(function(){
    owled.startBlinking();
},3000);

