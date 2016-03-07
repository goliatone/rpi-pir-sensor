'use strict';

var influx = require('influx');
var debug = require('debug')('reporter');

var client,
    buffer = [],
    bufferSize = 10,
    seriesName,
    logger = console;
/*
 * TODO: Make it emit error events.
 */
module.exports = {
    init: function(opts, config){
        debug('Initialize reporter');
        client = influx(opts.db);
        bufferSize = opts.bufferSize || 10;
        seriesName = opts.seriesName || 'phonebooth';
        if(config.logger) logger = config.logger;
    },
    buffer: function(data){
        if(!client) return debug('buffering data, client not ready');

        buffer.push(data);
        if(buffer.length < bufferSize) return;
        module.exports.store(seriesName, buffer.concat());
        buffer.length = 0;
    },
    store: function(seriesName, points){
        if(process.env.NODE_INFLUX_DRYRUN === 'true') {
            return console.log('Influx:store', seriesName, points);
        }
        debug('Reporter: store...');
        client.writePoints(seriesName, points, function(err, res){
            if(err) logger.error('Reporter Error: writePoints', err);
            else debug('Reporter: store OK', res);
        });
    },
    point: function(seriesName, values, tags){
        if(process.env.NODE_INFLUX_DRYRUN === 'true'){
            return console.log('Influx:point', seriesName, values, tags);
        }

        client.writePoint(seriesName, values, tags, function(err, res){
            if(err) logger.error('Reporter Error: writePoint', err);
            else debug('Reporter: store OK', res);
        });
    }
};
