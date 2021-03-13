#!/bin/bash
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker swarm leave -f
docker network prune -f
