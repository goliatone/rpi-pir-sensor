'use strict';

module.exports = process.arch === 'arm' ? require('./rpi') : require('./mock');
