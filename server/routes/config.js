'use strict';

var express = require('express');
var router = express.Router();



module.exports = function(app, config){
    router.get('/', function(req, res){
        res.render('config/index', config);
    });

    router.post('/update', function(req, res){

        var options = req.body;
        // app.update(options, function(success){
        //     res.send({success: success});
        // });
        res.send({success: true});
    });

    app.use('/config', router);
};
