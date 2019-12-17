FROM node:lts-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /server
WORKDIR /server

RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean

EXPOSE 3000

CMD ["yarn", "start-server-dev"]
