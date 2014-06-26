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
//var sparky = require('./server/sparky');


/* *****************************
     Start a Socket.IO Server
 */

var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000);

/*
// Listen for events on sparky, and announce them to connected clients.
sparky.on('startBlinking', function(){
    console.log('Sparky Blinks!');
    io.sockets.emit('sparkyStart');
});

sparky.on('endBlinking', function(res){
    console.log('Sparky Says... Red: ' + res.red + ' Green: ' + res.green);
    io.sockets.emit('sparkyResult',res);
});*/
