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

/* *****************************
     Start a Socket.IO Server
 */
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000);

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


//require('./server/sparky.js');