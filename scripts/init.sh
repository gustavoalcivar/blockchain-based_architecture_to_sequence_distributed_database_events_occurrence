#!/usr/bin/env bash
echo Docker Pull...
docker-compose -f /vagrant/docker/docker-compose-$1.yml pull -q
echo Docker Build...
docker-compose -f /vagrant/docker/docker-compose-$1.yml build -q