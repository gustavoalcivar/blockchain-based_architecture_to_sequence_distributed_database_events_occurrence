#!/bin/bash
node=$( hostname | awk '{ print substr($0,length,1) }' )
if [ $(cat $HOME/blockchain/restart_data) = 1 ] && [ $node = 0 ]
then
    echo "0" > $HOME/blockchain/restart_data
    docker-compose -f $HOME/blockchain/docker/docker-compose-0_0.yml up -d
else
    docker-compose -f $HOME/blockchain/docker/docker-compose-$node.yml up -d
fi
