'use strict';


var ascoltatori = require('ascoltatori');
var buildTopic = require('./topics').buildTopic;

module.exports.init = function $initialize(emitter, config){

    ascoltatori.build(config.amqp, function (ascoltatore) {
        console.log('===> AMQP client CONNECTED');
        console.log('AMQP config', JSON.stringify(config.amqp, null, 4));

        // config.eventType = occupancy.change
        emitter.on(config.eventType, function(data){
            var topic = buildTopic(data, 'change');
            console.log('occupancy: publish event, topic:', topic);
            //TODO: we should add building, and sensor id to the topic
            ascoltatore.publish(topic, data);
        });

        /*
         * we are being requested an update on our status.
         */
        ascoltatore.subscribe('occupancy/status', function(){
            //TODO: emitter should be a global dispatcher so we
            //can use wherever.
            emitter.once('occupancy.status.update', function(data){
                console.log('occupancy.status.update', data);
                var topic = buildTopic(data, 'change');
                ascoltatore.publish(topic, data);
                ascoltatore.publish('occupancy/status/check', data);
            });
            emitter.emit('occupancy.status.request');
        });
    });
};
