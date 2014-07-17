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
var owled = require('./server/owled');
//var owled = require('./server/owled-fake');

/* *****************************
     Start a Socket.IO Server
 */

var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var redisClient = redis.createClient();
http.listen(3000);

var autoBlinking = false;
var blinkInterval;
io.on('connect',function(socket){

    var results = redisClient.LRANGE('owled:results',0,25,function(err,res){
        socket.emit('owledHistory',res);
    });

    socket.on('doAutoBlink',function(data){
        if(!autoBlinking && data) {
            autoBlinking = true;
            blinkInterval = setInterval(function(){
                owled.startBlinking();
            },5000);
        }

        if(autoBlinking && !data) {
            clearInterval(blinkInterval);
            autoBlinking = false;
        }
    })
});

// Listen for events on owled, and announce them to all connected clients.
owled.on('startBlinking', function(){
    console.log('owLED Blinks!');
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