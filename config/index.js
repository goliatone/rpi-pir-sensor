'use strict';

module.exports = {
    sensor:{
        gpio: process.env.NODE_RPI_GPIO || 'GPIO21'
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
        bufferSize: 10
    },
    app: {
        building: process.env.NODE_APP_BUILDING,
        floor: process.env.NODE_APP_FLOOR,
        type: process.env.NODE_APP_TYPE
    }
};
