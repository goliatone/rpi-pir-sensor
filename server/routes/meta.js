'use strict';


var express = require('express');
var router = express.Router();

module.exports = function(app){

    router.get('/health', function(req, res, next){
        res.send(200);
    });

    app.use('/meta', router);
};
