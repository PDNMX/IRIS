#!/bin/bash

echo "Install and build server please wait (silent mode)..."
yarn install
yarn build

echo "Install and build client please wait (silent mode)..."
cd client
yarn install
yarn build

exit 0