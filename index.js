var raspi = require('raspi-io');
var five = require('johnny-five');


var board = new five.Board({
    io: new raspi()
});

board.on('ready', function(){
    var motion = new five.Motion('GPIO21');

    motion.on('calibrated', function(){
        console.log('Sensor calibrated');
    });

    motion.on('motionstart', function(){
        console.log('Motionstart');
        //post({movement:true});
    });

    motion.on('motionend', function(){
        console.log('Motionstart');
    });
});
