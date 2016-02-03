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

module.exports = {
    init: function sensor$init(app, opts){
        /*
         * Initialize board. We will use
         * config options to do the reporting
         */
        board.on('ready', function(){
            var motion = new five.Motion(opts.gpio);

            motion.on('motionstart', function(){
                debug('- Motion start');
                app.emit('sensor.event', {
                    type:'motionstart',
                    id: opts.id,
                    value: 1,
                    time: Date.now()
                });
            });

            motion.on('motionend', function(){
                debug('- Motion end');
                app.emit('sensor.event', {
                    type: 'motionend',
                    id: opts.id,
                    value: 0,
                    time: Date.now()
                });
            });
        });
    }
};
