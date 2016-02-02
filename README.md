### Raspberry Pi PIR 
Simple PoC to collect motion data using Raspberry Pi's.

### Docker
The project runs on the Pi using [Hypriot's][1] docker image.


### Environment variables

* NODE_RPI_GPIO
* NODE_RPI_ARCH

* NODE_INFLUX_HOST
* *NODE_INFLUX_PORT
* NODE_INFLUX_USER
* NODE_INFLUX_PASS
* NODE_INFLUX_DATABASE
* NODE_INFLUX_PROTOCOL
* NODE_INFLUX_SERIES_NAME
* NODE_INFLUX_DRYRUN

* NODE_APP_PORT

* NODE_DEVICE_UUID 

```
docker run -v /dev/mem:/dev/mem -v /lib/modules:/lib/modules --cap-add=ALL --privileged -d rpi-pir-sensor
```


### InfluxDB

Create DB:

```sql
CREATE DATABASE "occupancy"
```


Create user:

```sql
CREATE USER reporter WITH PASSWORD '<password>'
```

Grant write privileges:
```sql
GRANT WRITE ON occupancy TO reporter
```


### TODO

- [ ] Publish to AMQP.
- [ ] Persist GUI config changes
- [ ] Register with and retrieve config from Menagerie


[1]: http://blog.hypriot.com
