var five = require("johnny-five");
var Spark = require("spark-io");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Owled() {
    EventEmitter.call(this);

    /*
    // Spark Core (http://spark.io) board init
    this.board = new five.Board({
        io: new Spark({
            deviceId: process.env.SPARK_DEVICE_ID,
            token: process.env.SPARK_TOKEN
        })
    });
    */

    // Arduino board init
    this.board = new five.Board();

    var self = this;
    this.board.on("ready", function(){

        // Pins are specific to how your board is wired and the device you are using.

        /* Spark Core pins
        self.button = new five.Button('D5');
        self.ledred = new five.Led('D1');
        self.ledwhite = new five.Led('D0');
        */

        // Arduino pins
        self.button = new five.Button(13);
        self.ledred = new five.Led(11);
        self.ledwhite = new five.Led(6);

        // Inject devices into the Johnny-Five REPL
        self.board.repl.inject({
            button: self.button,
            ledred: self.ledred,
            ledwhite: self.ledwhite
        });

        self.button.on("down", function() {
            self.startBlinking();
        });

        self.ledred.off();
        self.ledwhite.off();

        self.emit('boardInitialized');
    });

    this.blinking = false;
}
util.inherits(Owled, EventEmitter);

Owled.prototype.startBlinking = function() {
    if(!this.blinking) {
        this.emit('startBlinking');
        this.blinking = true;

        var redBlinkInterval = getRandomNum(300,800);
        var whiteBlinkInterval = getRandomNum(300,800);
        var blinkTime = getRandomNum(3000,4000);

        this.ledred.blink(redBlinkInterval);
        this.ledwhite.blink(whiteBlinkInterval);

        setTimeout(function(){
            this.ledred.stop();
            this.ledwhite.stop();
            this.blinking = false;

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

// Export the module
module.exports = exports = new Owled();

