'use strict';

var influx = require('influx');
var debug = require('debug')('reporter');

var client,
    buffer = [],
    bufferSize = 10,
    seriesName;

module.exports = {
    init: function(opts){
        debug('Initialize reporter');
        client = influx(opts.db);
        bufferSize = opts.bufferSize || 10;
        seriesName = opts.seriesName || 'phonebooth';
    },
    buffer: function(data){
        if(!client) return debug('buffering data, client not ready');

        buffer.push(data);
        if(buffer.length < bufferSize) return;
        module.exports.store(seriesName, buffer.concat());
        buffer.length = 0;
    },
    store: function(seriesName, points){
        client.writePoints(seriesName, points, function(err, res){
            if(err) console.error('Reporter Error: writePoints', err);
            else debug('Reporter: store OK', res);
        });
    },
    point: function(seriesName, values, tags){
        client.writePoint(seriesName, values, tags, function(err, res){
            if(err) console.error('Reporter Error: writePoint', err);
            else debug('Reporter: store OK', res);
        });
    }
};
