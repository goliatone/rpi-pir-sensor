### Raspberry Pi PIR 
Simple PoC to collect motion data using Raspberry Pi's.

### Docker
The project runs on the Pi using [Hypriot's][1] docker image.


### Environment variables

* NODE_RPI_ID
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
* NODE_APP_TYPE
* NODE_APP_FLOOR
* NODE_APP_BUILDING

* NODE_DEVICE_UUID 

Note on environment variables, if you add them to the Dockerfile, it seems to slow down the build process as it has to make a new layer per env var(?!)

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


```
SELECT * from occupancy_test."default".phonebooth
```

```
SELECT count(value) from occupancy_test."default".phonebooth
```

```sql
CREATE RETENTION POLICY daily_retention ON occupancy DURATION 24h REPLICATION 1 DEFAULT
```

```
CREATE CONTINUOUS QUERY cq_30m ON occupancy BEGIN SELECT count(value) AS count INTO occupancy."default".downsampled_count FROM phonebooth GROUP BY time(30m) END
```


```
SELECT count(value) from occupancy_test."default".phonebooth
```

### TODO

- [ ] Persist GUI config changes
- [ ] Publish to AMQP
- [ ] Register with and retrieve config from Menagerie
- [ ] Expose Web Client for each sensor
- [ ] Dynamically name each sensor, use hostname from RPi
- [ ] Have option to autostart service or wait for GUI config
- [ ] Have start/stop controls on GUI


[1]: http://blog.hypriot.com
