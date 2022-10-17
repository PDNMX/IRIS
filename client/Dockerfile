FROM node:16-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /client
WORKDIR /client

RUN yarn add global yarn \
&& yarn install --force \
&& yarn build \
&& yarn global add serve \
&& yarn cache clean

EXPOSE 3000

CMD ["serve", "-s", "build"]
