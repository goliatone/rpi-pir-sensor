### Raspberry Pi PIR 
Simple PoC to collect motion data using Raspberry Pi's.

### Docker
The project runs on the Pi using [Hypriot's][1] docker image.


### Environment variables

* NODE_RPI_GPIO

* NODE_INFLUX_HOST
* *NODE_INFLUX_PORT
* NODE_INFLUX_USER
* NODE_INFLUX_PASS
* NODE_INFLUX_DATABASE
* NODE_INFLUX_PROTOCOL
* NODE_INFLUX_SERIES_NAME

* NODE_APP_PORT

* NODE_DEVICE_UUID 

```
docker run -v /dev/mem:/dev/mem -v /lib/modules:/lib/modules --cap-add=ALL --privileged -d rpi-pir-sensor
```

[1]: http://blog.hypriot.com
