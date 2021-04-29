#!/bin/bash
node=$( hostname | awk '{ print substr($0,length,1) }' )
docker-compose -f $HOME/blockchain/docker/docker-compose-$node.yml down
