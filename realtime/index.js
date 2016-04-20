'use strict';


var ascoltatori = require('ascoltatori');


module.exports = function(emitter, config){

    ascoltatori.build(config, function (ascoltatore) {
        console.log('===> AMQP client CONNECTED');
        emitter.on('occupancy.change', function(data){
            var topic = buildTopic(data, config);
            console.log('occupancy: publish event, topic:', topic);
            //TODO: we should add building, and sensor id to the topic
            ascoltatore.publish(topic, data);
        });
    });
};

function buildTopic(data, config){
    //TODO: include location and device info.
    return 'occupancy/change';
}
