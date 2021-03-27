#!/bin/bash
node=$( hostname | awk '{ print substr($0,length,1) }' )
if [ $node = 0 ]
then
    sudo chmod -R 777 $HOME/blockchain/
    docker swarm init --listen-addr $(cat $HOME/blockchain/ips/ip0):2377 --advertise-addr $(cat $HOME/blockchain/ips/ip0):2377
    docker swarm join-token --quiet manager > $HOME/blockchain/token
    docker network create --attachable --driver overlay audit_network
else
    docker swarm join --token $(cat $HOME/blockchain/token) $(cat $HOME/blockchain/ips/ip0):2377 --advertise-addr $(cat $HOME/blockchain/ips/ip$node):2377
fi
