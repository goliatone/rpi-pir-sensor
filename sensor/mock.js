'use strict';

var express = require('express');
var router = express.Router();


var presence = 0;
var movements = [];

var Sensor = {};

Sensor.init = function sensor$init(app, opts){
    console.log('MOCK ON!');
    Sensor.options = opts;

    setInterval(function(){
        var value = getPresence();

        console.log('generate movement:', value);

        app.emit('sensor.event', {
            id: opts.id,
            value: value,
            type: 'motion' + (value ? 'start' : 'end'),
            time: Date.now()
        });
    }, 1000);
};

Sensor.registerRoutes = function(app){
    //This does not work :/ figure out, move to routes and do
    //there.
    router.get('/sensor', function(req, res){
        console.log('HERE!');
        app.emit('sensor.event', {
            type: 'motionmock',
            id: Sensor.options.id,
            value: 23,
            time: Date.now()
        });
        res.send(200);
    });

    app.express.use('/mock', router);
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


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(min, max, weight) {
    return Math.floor(Math.random() * (max - min + 1)) + min > weight;
}

function generateMovements(){
    //generate short period of empty
    var index = randomInt(31, 40);

    var empty = Array.apply(null, new Array(index));
    empty = empty.map(function(){
        return 0;
    });

    //generate long period of busy
    index = randomInt(30, 60);
    var busy = Array.apply(null, new Array(index)).map(function(){
        return weightedRandom(0, 100, 20) ? 1 : 0;
    });

    index = randomInt(10, 20);
    var sparse = Array.apply(null, new Array(index)).map(function(){
        return weightedRandom(0, 100, 80) ? 1 : 0;
    });

    var output = ((([].concat(empty)).concat(busy)).concat(empty)).concat(sparse);

    return output.reverse();
}

function getPresence(){
    if(!movements.length) movements = generateMovements();
    return movements.pop();
}
