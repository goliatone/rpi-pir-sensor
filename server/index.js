'use strict';
var EventEmitter = require('events');
var _inherits = require('util').inherits;
/**
 * Module dependencies.
 */

var Setup = require('./setup');
var debug = require('debug')('phonebooth-sensor:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || process.env.NODE_APP_PORT || '3000');


/**
 * Listen on provided port, on all network interfaces.
 */
function App(){
    EventEmitter.call(this);
}

_inherits(App, EventEmitter);

App.prototype.start = function(opt){

    this.express = Setup.getExpress();

    this.emit('server.pre-middleware');
    Setup.addMiddleware();
    this.emit('server.post-middleware');

    this.emit('server.pre-routes');
    Setup.addRoutes();
    this.emit('server.post-routes');

    this.emit('server.pre-error-handlers');
    Setup.addErrorHandlers();
    this.emit('server.post-error-handlers');

    this.server = Setup.createServer(port);

    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onReady.bind(this));

    return this;
};
/**
 * Event listener for HTTP server "listening" event.
 */
App.prototype.onReady = function(){
    var addr = this.server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    this.emit('server.ready');
};


/**
 * Event listener for HTTP server "error" event.
 */
App.prototype.onError = function(error){
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

module.exports = App;
module.exports.createServer = function(){
    var instance = new App();
    return instance;
};


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
