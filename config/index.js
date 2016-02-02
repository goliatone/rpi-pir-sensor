'use strict';
var uuidGenerator = require('singleton-uuid');

//We have GUI to modify some options. We should
//be able to save those and load those values on
//server restarts.
//TODO: We should load cached version of updated props.
//TODO: We should be getting config from menagerie
module.exports = {
    sensor:{
        //Should we use uuid?
        id: process.env.NODE_RPI_ID,
        gpio: process.env.NODE_RPI_GPIO || 'GPIO21'
    },
    device: {
        uuid: uuidGenerator(process.env.NODE_DEVICE_UUID),
        config: {
            building: '_unset_',
            floor: '_unset_'
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
        bufferSize: 10
    },
    app: {
        building: process.env.NODE_APP_BUILDING,
        floor: process.env.NODE_APP_FLOOR,
        type: process.env.NODE_APP_TYPE
    }
};
