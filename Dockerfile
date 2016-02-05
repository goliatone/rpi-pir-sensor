FROM hypriot/rpi-iojs:1.6.4
MAINTAINER goliatone <hello@goliatone.com>

#Actually what we want to do is just make libic2 and git available
RUN apt-get update && apt-get install -y libi2c-dev git
RUN git clone https://github.com/bryan-m-hughes/wiringPi
RUN cd wiringPi && ./build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

#set timezone
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# RUN echo "America/New_York" > /etc/timezone
# RUN dpkg-reconfigure -f noninteractive tzdata

EXPOSE 3000

CMD ["/usr/src/app/bin/daemon"]
