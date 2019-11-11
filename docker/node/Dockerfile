# = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
# Script steps:
#   1. Install image form node:version
#   2. Create and set work directory in container
#   3. Copy all the current files in work directory
#   4. Start app
# = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
# Scripts:
#   - Build image
#       docker build -t iris ./
#   - Run container
#       docker run -it -p 3000:3000 --rm 22591877fab5
#
# Refer to .docker/scripts.txt for more commands ;)

FROM node
ENV IRIS_HOME /iris-production

RUN mkdir $IRIS_HOME
WORKDIR $IRIS_HOME
COPY . $IRIS_HOME

CMD yarn start-server-lib;