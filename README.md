### Raspberry Pi PIR 
Simple PoC to collect motion data using Raspberry Pi's.

### Docker
The project runs on the Pi using [Hypriot's][1] docker image.



```
docker run -v /dev/mem:/dev/mem -v /lib/modules:/lib/modules --cap-add=ALL --privileged -d rpi-pir-sensor
```

[1]: http://blog.hypriot.com
