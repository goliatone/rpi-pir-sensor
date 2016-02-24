'use strict';

var extend = require('gextend');
var request = require('request');
var debug = require('debug')('sensor:agent');

module.exports.init = function(config, options){

    if(config.metadata) {
        try {
            var meta = JSON.parse(config.metadata);
            var merged = extend({}, config.payload.metadata, meta);
            config.payload.metadata = merged;
        } catch(e){}
    }

    config.url = (config.url + '').replace(/\/+$/, '') + '/' + config.payload.uuid;

    console.log('agent: Registering device with url %s', config.url);

    var accessToken = config.token;

    var payload = {
        uri: config.url,
        qs: { 'access_token': accessToken},
        form: config.payload
    };

    request.post(payload, function(err, httResponse, body){
        if(err) console.error('ERROR', err);
        console.log('agent: device registration payload sent.');
    });
};
