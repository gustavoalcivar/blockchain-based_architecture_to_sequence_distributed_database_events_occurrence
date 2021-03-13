#!/bin/bash
sudo chmod -R 777 $HOME/blockchain/
docker swarm init --listen-addr 10.142.0.2:2377 --advertise-addr 10.142.0.2:2377
docker swarm join-token --quiet manager > $HOME/blockchain/token
docker network create --attachable --driver overlay audit_network
