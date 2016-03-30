'use strict';


var ascoltatori = require('ascoltatori');


module.exports = function(emitter, config){

    ascoltatori.build(config, function (ascoltatore) {
        console.log('===> AMQP client CONNECTED');
        emitter.on('occupancy.change', function(data){
            console.log('occupancy: publish event');
            ascoltatore.publish('occupancy/change', data);
        });
    });
};
