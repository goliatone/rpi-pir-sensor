'use strict';
var uuidGenerator = require('singleton-uuid');
var winston = require('winston');
//We have GUI to modify some options. We should
//be able to save those and load those values on
//server restarts.
//TODO: We should load cached version of updated props.
//TODO: We should be getting config from menagerie

var transports = [
    new (winston.transports.Console)({
        handleExceptions: true,
        prettyPrint: true,
        silent: false,
        timestamp: true,
        colorize: true,
        json: false,
        /*formatter: function(options) {
            var message = new Date().toLocaleString() + ' ';
            message += options.message || '';
            message += (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            return message;
        }*/
    }),
    new (require('winston-daily-rotate-file'))({
        name: 'error-file',
        filename: 'phonebooth-sensor-error.log',
        level: 'error',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        maxsize: 1024000,
        maxFiles: 10,
        exitOnError: true //default value
    })
];

//Only include honey if we have the key.
if(process.NODE_HONEYBADGER_KEY){
    transports.push(new (winston.transports.Honeybadger)({ apiKey: process.NODE_HONEYBADGER_KEY}))
}

module.exports = {
    sensor: {
        //Should we use uuid?
        id: process.env.NODE_RPI_ID,
        gpio: process.env.NODE_RPI_GPIO || 'GPIO21'
    },
    device: {
        uuid: uuidGenerator(process.env.NODE_DEVICE_UUID),
        config: {
            building: process.env.NODE_APP_BUILDING,
            floor: process.env.NODE_APP_FLOOR
        }
    },
    agent: {
        url: process.env.NODE_AGENT_ENDPOINT,
        token: process.env.NODE_AGENT_TOKEN,
        metadata: process.env.NODE_AGENT_METADATA,
        payload: {
            'uuid': uuidGenerator(process.env.NODE_DEVICE_UUID),
            'name': process.env.NODE_RPI_ID,
            'typeName': process.env.NODE_DEVICE_TYPE_NAME,
            // 'type': 1,
            'status': 'inuse',
            'metadata': {}
        }
    },
    reporter: {
        db: {
            host: process.env.NODE_INFLUX_HOST,
            port: process.env.NODE_INFLUX_PORT,
            username: process.env.NODE_INFLUX_USER,
            password: process.env.NODE_INFLUX_PASS,
            database: process.env.NODE_INFLUX_DATABASE,
            protocol: process.env.NODE_INFLUX_PROTOCOL || 'https'
        },
        seriesName: process.env.NODE_INFLUX_SERIES_NAME || 'presence',
        bufferSize: 10,
        //TODO: We need to sync this and the GUI
        tags: {
            building: process.env.NODE_APP_BUILDING,
            floor: process.env.NODE_APP_FLOOR,
            type: process.env.NODE_APP_TYPE || 'phonebooth'
        }
    },
    app: {},
    logger: {
        //level: process.NODE_ENV === 'development' ? 'error' : 'warn',
        transports: transports
    }
};
