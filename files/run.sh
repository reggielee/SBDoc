#!/usr/bin/env bash

chmod 777 /docker_data
mkdir -m 777 -p /docker_data/mongodb
/usr/bin/mongod -f /etc/mongod.conf &
sleep 5
cd /opt/SBDoc && npm start