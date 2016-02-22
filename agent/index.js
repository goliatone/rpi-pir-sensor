'use strict';
var extend = require('gextend');
var request = require('request');

module.exports.init = function(config, options){

    if(config.metadata) {
        try {
            var meta = JSON.parse(config.metadata);
            var merged = extend({}, config.payload.metadata, meta);
            config.payload.metadata = merged;
        } catch(e){}
    }

    config.url = (config.url + '').replace(/\/+$/, '') + '/' + config.payload.uuid;
    var access_token = config.token;

    delete config.token;
    delete config.metadata;

    return console.log('REGISTERING', JSON.stringify(config, null, 4));

    request.post({
        url: config.url,
        qs: {access_token: access_token}
    },{
        form: {
            id: config.id,
            uuid: config.uuid,
            status: config.status,
            typeName: config.typeName,
            metadata: config.payload.metadata,
        }
    });
};
