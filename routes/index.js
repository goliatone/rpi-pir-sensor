'use strict';

var express = require('express');
var router = express.Router();



module.exports = function(app){
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    app.use('/', router);
};
