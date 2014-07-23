'use strict';

var Cylon = require('cylon');

function MySphero() {

    var self = this;

    Cylon.api({
        port: "4321"
    });

    Cylon.robot({
        name: 'sphero',
        connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-RBR-RN-SPP' },
        device: {name: 'sphero', driver: 'sphero'},

        work: function(my) {
            //my.sphero.roll(60,1);
            self.doCalibration();
        }
    });

    Cylon.start();
}

MySphero.prototype.changeColor = function() {
    console.log('Changing Sphero Color');
    Cylon.robots.sphero.devices.sphero.setRandomColor(true);
};

MySphero.prototype.rollForward = function() {
    console.log('Rolling Sphero');
    Cylon.robots.sphero.devices.sphero.roll(85,1);
};

MySphero.prototype.doCalibration = function() {
    console.log('Starting Sphero Calibration');
    Cylon.robots.sphero.devices.sphero.startCalibration();
    setTimeout(function(){
        console.log('Ending Sphero Calibration');
        Cylon.robots.sphero.devices.sphero.finishCalibration();
    },8000);
};

// Export the module
module.exports = exports = new MySphero();
