FROM node:14-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /server
WORKDIR /server

RUN yarn add global yarn \
&& yarn install --force \
&& yarn build \
&& yarn cache clean

EXPOSE 3000

CMD ["yarn", "start-server-dev"]
