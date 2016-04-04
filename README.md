### Raspberry Pi PIR 
Simple PoC to collect motion data using Raspberry Pi's.

Flow:

- Develop in your computer.
- Have RPi with `git` and `docker` installed.
- Build `github.com/goliatone/rpi-pir-sensor` in your pi.
- Push image to docker hub.

Currently we are using ssh remote commands to deploy new sensor instances. In the future we want to have a `docker` cluster where you can remotely push 

## Deployment

## Development

You can use `envset` to manage a development environment local to your [Mac] computer. For production, if you don't want to install node in the Pi to run `envset` you can export environmental variables in a script before running your docker instance.

```
$ envset development -- ./bin/daemon
```

If you run the application locally- not in an ARM environment- then the RPi specific code like raspi-io gets stubbed out.

### Docker
The project runs on the Pi using [Hypriot's][1] docker image.

### Environment variables

* `NODE_RPI_ID`: Instance name. We actually use the Raspberry Pi's `hostname`
* `NODE_RPI_GPIO`: GPIO pin j5 connects to.
* `NODE_RPI_ARCH`: Defaults to `arm`. Used to check if we need to run mock mode.
* `NODE_RPI_REPL`: Prevent j5 repel. You need to explicitly disable it. If its running will prevent docker from lifting ok.

* `NODE_INFLUX_USER`: InfluxDB user
* `NODE_INFLUX_PASS`: InfluxDB pass
* `NODE_INFLUX_HOST`: InfluxDB host
* `NODE_INFLUX_PORT`: InfluxDB port
* `NODE_INFLUX_DATABASE`: InfluxDB database name. 
* `NODE_INFLUX_PROTOCOL`: `https` or `http`
* `NODE_INFLUX_SERIES_NAME`: Defaults to `phonebooth`
* `NODE_INFLUX_DRYRUN`: It `true` we do not send payloads to DB.

* `NODE_APP_PORT`: Express port
* `NODE_APP_TYPE`: Metadata information
* `NODE_APP_FLOOR`: Where is deployed [1]
* `NODE_APP_BUILDING`: Where is deployed [1]

[1] This should be either merged and passed as a `NODE_APP_METADATA` string or replaced by a `NODE_APP_LOCATION_UUID`.

* `NODE_DEVICE_UUID`: If not present the app will generate a `UUID` once, and then use the same one- duration of `docker` container.

* `NODE_AGENT_TOKEN`: OAuth token for remote agent
* `NODE_AGENT_ENDPOINT`: Registration endpoint for agent.
* `NODE_AGENT_METADATA`: Registration metadata payload data. We use this to inject data from the host into the container.
* `NODE_DEVICE_TYPE_NAME`: Currently we need this for `manegerie`...

* `NODE_HONEYBADGER_KEY`: honeybadger secret key

Note on environment variables, if you add them to the Dockerfile, it seems to slow down the build process as it has to make a new layer per env var(?!)

```
docker run -v /dev/mem:/dev/mem -v /lib/modules:/lib/modules --cap-add=ALL --privileged -d rpi-pir-sensor
```

To open a shell session:
```
docker run -t -i --rm --privileged --cap-add=ALL -v /lib/modules:/lib/modules -v /dev:/dev goliatone/rpi-pir-sensor /bin/bash
```


#### OPS
The `ops` directory contains a set of commands to interact with docker. 

We build a docker image on a raspberry pi and push the image to docker hub. In order to do so, we need to have credentials on the pi. You can simply `docker login` in your computer:

```
$ docker login --password=Password --username=Username
```

Then you can copy the generated token and place it in the raspberry pi. The token is found at `~/.docker/config.json `. You should place it on the same path.

The `docker-push` will send a built image to a docker hub repository.

<!--
`https://hub.docker.com/r/goliatone/rpi-pir-sensor/`
-->

##### Update RPi 

To update a deployed RPi:

```
./ops/rpi-update --environment=production --context-path=./ops/context --hostname=wee-4
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


TODO: HOW TO DELETE DATA?
```sql
DROP SERIES FROM occupancy."default".phonebooth WHERE id='wee-1'
DROP SERIES FROM occupancy."default".phonebooth
```


### Get RPi serial number

Each RPi has a serial number which we can access:
```
awk '/Serial/{print $3}' /proc/cpuinfo
```

To get MAC address:
```
cat /sys/class/net/eth0/address
```


### Docker and RPi

You can use the [hypriot][hypriot] [flash tool][hft] to burn a version of Debian for RPi with Docker support.

```
$ flash --hostname wee-8 --ssid <ssid> --password <password>
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



### ISSUES
Pi seems to loose connection. Ensure we have `auto eth0`
http://raspberrypi.stackexchange.com/questions/19963/why-the-raspberry-pi-loses-the-ethernet-connection


[hft]:https://github.com/hypriot/flash
[hypriot]:http://blog.hypriot.com/downloads/
