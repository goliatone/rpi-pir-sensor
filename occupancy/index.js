'use strict';

var _inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;


var _occupancy = 0;

var _timeoutId = null;
var _callback = null;
var _timeout = 0.5 * 60 * 1000;



function Occupancy(){
    EventEmitter.call(this);
}
_inherits(Occupancy, EventEmitter);

Occupancy.prototype.init = function(options, config){
    if(options.hasOwnProperty('timeout')) _timeout = options.timeout;
};

Occupancy.prototype.update = function(event){

    if(event.value === 1){
        stopTimer();
        console.log('move');
        if(_occupancy === 0) return notifyChange(1);
    }
    console.log('stop');
    startTimer();
};

Occupancy.prototype.onChange = function(cb){
    _callback = cb;
};


var instance = new Occupancy();
module.exports = instance;

function stopTimer(){
    clearTimeout(_timeoutId);
}

function startTimer(force){
    if(_timeoutId && !force) return console.log('exit');
    stopTimer();
    _timeoutId = setTimeout(check.bind(null, 0), _timeout);
    console.log('set timeout');
}

function check(value){
    console.log('check', value);
    notifyChange(0);
    stopTimer();
}

function notifyChange(value){
    _occupancy = value;
    console.log('occupancy changed', _occupancy);
    instance.emit('occupancy.change', _occupancy);
}
