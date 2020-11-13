#!/usr/bin/env bash
echo Swarm Init...
sudo docker swarm init --listen-addr $10:2377 --advertise-addr $10:2377
sudo docker swarm join-token --quiet manager > /vagrant/token
sudo docker network create --attachable --driver overlay audit_network
echo Docker Pull...
sudo docker-compose -f /vagrant/docker/docker-compose-0.yaml pull -d