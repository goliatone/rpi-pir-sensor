'use strict';

var config = require('../config');

function init(c){
    config = c;
}

module.exports.init = init;

function buildTopic(data, type){
    //TODO: include location and device info.
    return ['occupancy',
            config.device.uuid,
            config.sensor.id,
            type
        ].join('/');
}


module.exports.buildTopic = buildTopic;
