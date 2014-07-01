var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Sparky() {
    EventEmitter.call(this);
    this.blinking = false;
}
util.inherits(Sparky, EventEmitter);

Sparky.prototype.startBlinking = function() {
    if(!this.blinking) {
        this.emit('startBlinking');
        this.blinking = true;
        var msg = false;

        var red = getRandomNum(0,2);
        var white = getRandomNum(0,2);

        setTimeout(function(){
            this.blinking = false;

            this.emit('endBlinking',{
                red: !!red,
                green: !!white
            });
        }.bind(this),1000);
    }

    function getRandomNum(min, max) {
        return (Math.random() * (max - min) + min) | 0;
    }
};

module.exports = exports = new Sparky();