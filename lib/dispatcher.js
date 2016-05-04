'use strict';

var EventEmitter = require('events').EventEmitter;
var dispatcher = new EventEmitter();
dispatcher.count = new Date();
module.exports = dispatcher;
