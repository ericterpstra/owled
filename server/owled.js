var five = require("johnny-five");
var Spark = require("spark-io");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Sparky() {
    EventEmitter.call(this);

    this.board = new five.Board({
        io: new Spark({
            deviceId: '53ff77065075535117161387',
            token: 'ccd5329c9d74b1c7af24f3c0d5358ddcdb753279'
        })
    });

    var self = this;
    this.board.on("ready", function(){

        self.button = new five.Button('D5');
        self.ledred = new five.Led('D1');
        self.ledwhite = new five.Led('D0');

        self.board.repl.inject({
            button: self.button,
            ledred: self.ledred,
            ledwhite: self.ledwhite
        });

        self.button.on("down", function() {
            self.startBlinking();
            self.emit('startBlinking');
        });

        self.ledred.off();
        self.ledwhite.off();

        self.emit('boardInitialized');
    });


    this.blinking = false;
}
util.inherits(Sparky, EventEmitter);

Sparky.prototype.startBlinking = function() {
    if(!this.blinking) {
        this.blinking = true;
        var msg = false;

        var redBlinkInterval = getRandomNum(300,1000);
        var whiteBlinkInterval = getRandomNum(300,1000);
        var blinkTime = getRandomNum(3000,4000);

        this.ledred.blink(redBlinkInterval);
        this.ledwhite.blink(whiteBlinkInterval);

        setTimeout(function(){
            //console.log('Stopping Blinking');
            this.ledred.stop();
            this.ledwhite.stop();
            this.blinking = false;

            msg = '';
            msg += this.ledred.value ? 'RED' : '';
            msg += this.ledwhite.value ? 'WHITE' : '';
            msg = msg.length ? msg : 'OFF';

            console.log('Winner is ' + msg);
            this.emit('endBlinking',{
                red: !!this.ledred.value,
                green: !!this.ledwhite.value
            });
        }.bind(this),blinkTime);
    }

    function getRandomNum(min, max) {
        return (Math.random() * (max - min) + min) | 0;
    }
};

//var sparky = new Sparky();
module.exports = exports = new Sparky();

