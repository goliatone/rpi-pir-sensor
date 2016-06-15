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

    opts.gpio = parseGPIOs(opts.gpio);

    /*
     * Initialize board. We will use
     * config options to do the reporting
     */
    board.on('ready', function(){
        var motion;
        opts.gpio.map(function(gpio){
            console.log('Initialize motion sensor for GPIO:', gpio);
            motion = new five.Motion(gpio);

            motion.on('calibrated', function(){
                console.log('Sensor calibrated', Date.now());
            });

            //TODO: Should we include also the name/id of the sensor?
            motion.on('motionstart', function(){
                debug('- Motion start');
                app.emit('sensor.event', Sensor.getPayloadFromValue(1));
            });

            motion.on('motionend', function(){
                debug('- Motion end');
                app.emit('sensor.event', Sensor.getPayloadFromValue(0));
            });
        });
    });
};


Sensor.registerRoutes = function(app){};


Sensor.getPayloadFromValue = function sensor$getPayloadFromValue(value){
    return {
        id: Sensor.options.id,
        value: value,
        type: 'motion' + (value ? 'start' : 'end'),
        time: Date.now()
    };
};

module.exports = Sensor;


function parseGPIOs(gpio){
    if(!gpio) return [];
    if(gpio.indexOf('[') !== 0) return [gpio];

    try {
        gpio = JSON.parse(gpio);
    } catch(e){
        console.error('Error parseGPIOs JSON parsing');
        console.error('Expected valid JSON value for gpio');
        console.error('Got:\n', gpio);
        gpio = [];
    }

    return gpio;
}
