'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('../config');

var app = express();
var server;

var Setup = {};

Setup.addMiddleware = function(){
    app.disable('x-powered-by');

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
};

Setup.addRoutes = function(){
    //Wire routes:
    require('./routes/meta')(app, config);
    require('./routes/index')(app, config);
    require('./routes/config')(app, config);
};

Setup.addErrorHandlers = function(){
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};

Setup.getExpress = function(){
    return app;
};

Setup.getServer = function(){
    return server;
};

Setup.createServer = function(port){
    app.set('port', port || '3000');

    var http = require('http');
    server = http.createServer(app);

    server.listen(port);

    return server;
};

module.exports = Setup;
