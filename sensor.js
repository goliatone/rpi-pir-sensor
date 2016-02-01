'use strict';

var raspi = require('raspi-io');
var five = require('johnny-five');
var extend = require('gextend');
var debug = require('debug')('sensor:gpio');

var board = new five.Board({
    io: new raspi()
});

var DEFAULTS = {
    gpio: 'GPIO21'
};

module.exports = function init(app, opts){
    /*
     * Initialize board. We will use
     * config options to do the reporting
     */
    board.on('ready', function(){
        var motion = new five.Motion(opts.gpio);

        motion.on('motionstart', function(){
            debug('Motion start');
            app.publish({type:'motionstart', id: opts.id});
        });

        motion.on('motionend', function(){
            debug('Motion end');
            app.publish({
                type: 'motionend',
                id: opts.id
            });
        });
    });
};
