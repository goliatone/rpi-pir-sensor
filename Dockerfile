FROM hypriot/rpi-iojs:1.6.4
MAINTAINER goliatone <hello@goliatone.com>

RUN apt-get install -y libi2c-dev git
RUN git clone https://github.com/bryan-m-hughes/wiringPi
RUN cd wiringPi && ./build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app/
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app

CMD [ "npm", "start" ]
