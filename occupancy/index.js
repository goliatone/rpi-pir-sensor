'use strict';

var _occupancy = 0;
var _timeoutId = null;
var _callback = null;
var _timeout = 1 * 60 * 1000;

module.exports.init = function(options, config){
    //initialize occupancy brain
};


module.exports.update = function(event){

    if(event.value === 1) return check(1);

    _occupancy = event.value;

    trackTime();
};

module.exports.onChange = function(cb){
    _callback = cb;
};


function resetOccupancy(){
    clearTimeout(_timeoutId);
}

function trackTime(force){
    if(_timeoutId && !force) return;
    resetOccupancy();
    _timeoutId = setTimeout(check.bind(null, _occupancy), _timeout);
    console.log('set timeout', _timeoutId);
}

function check(value){
    console.log('check', value);
    if(value === _occupancy) return;

    notifyChange(value);

    resetOccupancy();
}

function notifyChange(value){
    _occupancy = value;
    console.log('occupancy changed', _occupancy);
    _callback(_occupancy);
}
