#!/bin/bash

echo "Install and build server please wait (silent mode)..."
yarn install --silent
yarn build

echo "Install and build client please wait (silent mode)..."
cd client
yarn install --silent
yarn build

exit 0