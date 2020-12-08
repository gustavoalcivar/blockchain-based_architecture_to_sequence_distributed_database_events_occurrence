#!/usr/bin/env bash
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
if [ $(cat /vagrant/restart) == 1 ]; then
    echo ***********************************
    echo ***********************************
    echo **-------------------------------**
    echo **-------------------------------**
    echo **----Restarting Blockhain...----**
    echo **-------------------------------**
    echo **-------------------------------**
    echo ***********************************
    echo ***********************************
    docker volume rm -f $(docker volume ls -q)
fi
docker swarm leave -f
docker network prune -f
if [ $1 == 0 ]; then
    echo Swarm Init...
    docker swarm init --listen-addr $20:2377 --advertise-addr $20:2377
    docker swarm join-token --quiet manager > /vagrant/token
    docker network create --attachable --driver overlay audit_network
else
    echo Swarm Join...
    docker swarm join --token $(cat /vagrant/token) $20:2377 --advertise-addr $2$1:2377
fi
echo Start services...
docker-compose -f /vagrant/docker/docker-compose-$1.yml up -d
echo Start services completed