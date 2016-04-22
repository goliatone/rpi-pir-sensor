'use strict';


var ascoltatori = require('ascoltatori');


module.exports = function(emitter, config){

    ascoltatori.build(config.amqp, function (ascoltatore) {
        console.log('===> AMQP client CONNECTED');

        // config.eventType = occupancy.change
        emitter.on(config.eventType, function(data){
            var topic = buildTopic(data, config);
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
                // console.log('occupancy.status.update', data);
                var topic = buildTopic(data, config);
                ascoltatore.publish(topic, data);
                ascoltatore.publish('occupancy/status/check', data);
            });
            emitter.emit('occupancy.status.request');
        });
    });
};

function buildTopic(data, config){
    //TODO: include location and device info.
    return 'occupancy/change';
}
