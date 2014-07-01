var five = require("johnny-five");
var Spark = require("spark-io");
var board = new five.Board({
    io: new Spark({
        deviceId: '53ff77065075535117161387',
        token: 'ccd5329c9d74b1c7af24f3c0d5358ddcdb753279'
    })
});
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Sparky() {
    EventEmitter.call(this);
}
util.inherits(Sparky, EventEmitter);
var sparky = new Sparky();

board.on("ready", function() {

    button = new five.Button('D5');
    ledred = new five.Led('D1');
    ledwhite = new five.Led('D0');

    board.repl.inject({
        button: button,
        ledred: ledred,
        ledwhite: ledwhite
    });


    button.on("down", function() {
        //console.log('BEGIN!');
        startBlinking();
        sparky.emit('startBlinking');
    });

    var blinking = false;
    ledred.off();
    ledwhite.off();

    function startBlinking() {
        if(!blinking) {
            blinking = true;
            msg = false;

            var redBlinkInterval = getRandomNum(200,1000);
            var whiteBlinkInterval = getRandomNum(200,1000);
            var blinkTime = getRandomNum(3000,4000);

            ledred.blink(redBlinkInterval);
            ledwhite.blink(whiteBlinkInterval);

            setTimeout(function(){
                //console.log('Stopping Blinking');
                ledred.stop();
                ledwhite.stop();
                blinking = false;

                msg = '';
                msg += ledred.value ? 'RED' : '';
                msg += ledwhite.value ? 'WHITE' : '';
                msg = msg.length ? msg : 'OFF';

                console.log('Winner is ' + msg);
                sparky.emit('endBlinking',{
                    red: !!ledred.value,
                    green: !!ledwhite.value
                });
            },blinkTime);
        }
    }


    function getRandomNum(min, max) {
        return (Math.random() * (max - min) + min) | 0;
    }
});

module.exports = sparky;