#!/bin/bash
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker volume rm -f $(docker volume ls -q)
docker swarm leave -f
docker network prune -f
