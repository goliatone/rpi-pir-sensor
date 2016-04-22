'use strict';

var raspi = require('raspi-io');
var five = require('johnny-five');
var extend = require('gextend');
var debug = require('debug')('sensor:gpio');

function getRepl(){
    if(process.env.NODE_RPI_REPL === 'true') return true;
    return false;
}

var board = new five.Board({
    io: new raspi(),
    repl: getRepl()
});

var DEFAULTS = {
    gpio: 'GPIO21'
};

var Sensor = {};

Sensor.init = function sensor$init(app, opts){
    Sensor.options = opts;
    /*
     * Initialize board. We will use
     * config options to do the reporting
     */
    board.on('ready', function(){
        var motion = new five.Motion(opts.gpio);

        motion.on('motionstart', function(){
            debug('- Motion start');
            app.emit('sensor.event', Sensor.getPayloadFromValue(1));
        });

        motion.on('motionend', function(){
            debug('- Motion end');
            app.emit('sensor.event', Sensor.getPayloadFromValue(0));
        });
    });
};

Sensor.getPayloadFromValue = function sensor$getPayloadFromValue(value){
    return {
        id: Sensor.options.id,
        value: value,
        type: 'motion' + (value ? 'start' : 'end'),
        time: Date.now()
    };
};

module.exports = Sensor;
