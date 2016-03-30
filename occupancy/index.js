'use strict';

var _occupancy = 0;

var _timeoutId = null;
var _callback = null;
var _timeout = 1 * 60 * 1000;

module.exports.init = function(options, config){
    //initialize occupancy brain
};


module.exports.update = function(event){

    if(event.value === 1){
        stopTimer();
        console.log('move');
        if(_occupancy === 0) return notifyChange(1);
    }
    console.log('stop');
    startTimer();
};

module.exports.onChange = function(cb){
    _callback = cb;
};


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
    _callback(_occupancy);
    console.log('occupancy changed', _occupancy);
}
