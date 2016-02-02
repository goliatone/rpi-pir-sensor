'use strict';

var arch = process.env.NODE_RPI_ARCH || 'arm';
module.exports = process.arch === arch ? require('./rpi') : require('./mock');
