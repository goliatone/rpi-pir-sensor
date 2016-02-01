'use strict';

var sensor = require('./sensor');
var server = require('./server');
var config = require('./config');
var reporter = require('./reporter');

reporter.init(config.reporter);

var app = {
    publish: function(event){
        reporter.buffer([
            {
                event: event.type,
                value: event.value
            },
            {
                id: event.id,
                building: config.building,
                floor: config.floor,
                type: config.type || 'phonebooth'
            }
        ]);
    }
};



//Server: We should be able to change configuration on
//GUI/Client and then reboot app.
server.start(function(){
    /*
     * Sensor uses app to publish events.
     */
    sensor.init(app, config.sensor);
});
