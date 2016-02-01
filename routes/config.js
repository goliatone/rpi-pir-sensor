'use strict';

var express = require('express');
var router = express.Router();



module.exports = function(app){
    router.get('/', function(req, res){
        res.render('index');
    });

    router.post('/update', function(req, res){
        res.send({success: true});
    });

    app.use('/config', router);
};
