'use strict';

var _inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;


var _occupancy = 0;
var _timeoutId = null;
var _callback = null;
var _timeout = 0.5 * 60 * 1000;
var _eventType = 'occupancy.change';


function Occupancy(){
    EventEmitter.call(this);
}
_inherits(Occupancy, EventEmitter);

Occupancy.prototype.init = function(options, config){
    if(options.hasOwnProperty('timeout')) _timeout = options.timeout;
    if(options.hasOwnProperty('eventType')) _eventType = options.eventType;
};

/**
 * Event handler.
 * It gets notified of sensor events.
 *
 * @param  {Object} event Sensor event payload
 * @return {Occupancy}
 */
Occupancy.prototype.update = function(event){

    if(event.value === 1){
        stopTimer();
        console.log('- update: movement detected, occupancy', _occupancy);

        if(_occupancy === 0){
            console.log('- update: notify movement transition');
            return notifyChange(1);
        }

        return;
    }

    _occupancy = 0;

    startTimer();

    return this;
};

var instance = new Occupancy();


function stopTimer(){
    console.log('- stopTimer: clearTimeout. occupancy', _occupancy);
    clearTimeout(_timeoutId);
}

function startTimer(force){
    if(_timeoutId && force !== true) return console.log('- startTimer: exit, occupancy', _occupancy);

    console.log('- startTimer: set timeout %s, occupancy %s', _timeout/1000, _occupancy);
    stopTimer();
    _timeoutId = setTimeout(check.bind(null, 0), _timeout);
}

function check(value){
    console.log('- setTimeout callback: check', value);
    notifyChange(0);
    stopTimer();
}

function notifyChange(value){
    _occupancy = value;
    console.log('==> occupancy changed, set occupancy:', _occupancy);
    instance.emit(_eventType, _occupancy);
}


/*
 * Module exports an instance object.
 */
module.exports = instance;
