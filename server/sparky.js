var five = require("johnny-five");
var Spark = require("spark-io");
var board = new five.Board({
    io: new Spark({
        deviceId: '53ff77065075535117161387',
        token: 'ccd5329c9d74b1c7af24f3c0d5358ddcdb753279'
    })
});

var sparky = {
    onStartBlinking: function(){},
    onEnd: function(){}
};

board.on("ready", function() {

    button = new five.Button('D5');
    ledred = new five.Led('D1');
    ledwhite = new five.Led('D0');

    board.repl.inject({
        button: button,
        ledred: ledred,
        ledwhite: ledwhite,
    });


    button.on("down", function() {
        //console.log('BEGIN!');
        startBlinking();
        sparky.onStartBlinking();
    });

    var blinking = false;
    ledred.off();
    ledwhite.off();

    function startBlinking() {
        if(!blinking) {
            blinking = true;
            msg = false;

            var redBlinkInterval = getRandomNum(500,1500);
            var whiteBlinkInterval = getRandomNum(500,1500);
            var blinkTime = getRandomNum(5000,10000);

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
                sparky.onEnd({
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