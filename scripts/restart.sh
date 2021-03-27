#!/bin/bash
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker swarm leave -f
docker network prune -f
if [ $(cat $HOME/blockchain/restart_data) = 1 ]
then
    echo ****************************************
    echo ****************************************
    echo **------------------------------------**
    echo **------------------------------------**
    echo **----Restarting blockhain data...----**
    echo **------------------------------------**
    echo **------------------------------------**
    echo ****************************************
    echo ****************************************
    docker volume rm -f $(docker volume ls -q)
fi