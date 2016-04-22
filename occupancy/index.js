'use strict';

var _inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;


var _occupancy = -1;
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
        clearTimer();
        // console.log('- update: movement detected, occupancy', _occupancy);

        if(_occupancy === 0){
            // console.log('- update: notify movement transition');
            notifyChange(1);
        }

        return;
    }

    startTimer();

    return this;
};

Occupancy.prototype.buildChangeEventPayload = function(value){
    return value;
};

/*
 * Expose an "occupancy" getter in the prototype:
 * `instance.occupancy`
 *
 * Note this is a read only property.
 */
Object.defineProperty(Occupancy.prototype, 'occupancy', {
    get: function(){
        return _occupancy;
    }
});

var instance = new Occupancy();


function clearTimer(){
    // console.log('- clearTimer: clearTimeout. occupancy', _occupancy);
    clearTimeout(_timeoutId);
    _timeoutId = null;
}

function startTimer(){
    if(_timeoutId) return;// console.log('- startTimer: exit, occupancy', _occupancy);
    // console.log('- startTimer: set timeout %s, occupancy %s', _timeout/1000, _occupancy);
    _timeoutId = setTimeout(function(){
        // console.log('- setTimeout callback: check', 0);
        clearTimer();
        notifyChange(0);
    }, _timeout);
}

function notifyChange(value){
    var update = _occupancy !== value;
    _occupancy = value;
    console.log('==> occupancy changed, set occupancy:', _occupancy);
    if(update) instance.emit(_eventType, instance.buildChangeEventPayload(value));
}


/*
 * Module exports an instance object.
 */
module.exports = instance;
