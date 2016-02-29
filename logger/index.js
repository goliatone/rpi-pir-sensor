'use strict';

var winston = require('winston');

var logger;

module.exports.init = function(config){
    if(logger) return logger;

    logger = new (winston.Logger)(config);

    //This is ugly :/
    config.logger = logger;

    return logger;
};