'use strict';

var express = require('express');
var router = express.Router();


module.exports = {
    init: function sensor$init(app, opts){
        console.log('MOCK ON!');

        var presence = 0;
        setInterval(function(){
            console.log('Timeout');
            var value = !!((++presence) % 2);
            app.emit('sensor.event', {
                id: opts.id,
                value: value ? 1 : 0,
                type: 'motion' + (value ? 'start' : 'end'),
                time: Date.now()
            });
        }, 1000);

        //This does not work :/ figure out, move to routes and do
        //there.
        router.get('/sensor', function(req, res){
            console.log('HERE!');
            app.emit('sensor.event', {
                type: 'motionmock',
                id: opts.id,
                value: 23,
                time: Date.now()
            });
            res.send(200);
        });

        app.express.use('/mock', router);
    }
};
