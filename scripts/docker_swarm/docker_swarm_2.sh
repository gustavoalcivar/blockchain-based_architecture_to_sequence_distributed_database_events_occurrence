#!/bin/bash
docker swarm join --token $(cat $HOME/blockchain/token) 10.142.0.2:2377 --advertise-addr 10.142.0.4:2377
