FROM python:3-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /iframe
WORKDIR /iframe

EXPOSE 8080

CMD ["python", "-m", "http.server", "8080"]
