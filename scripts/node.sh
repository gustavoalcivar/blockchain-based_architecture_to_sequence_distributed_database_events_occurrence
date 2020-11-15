#!/usr/bin/env bash
echo Install Docker...
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get -y install docker-ce
echo Install Docker Compose...
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
if [ $1 == 0 ]; then
    echo Swarm Init...
    sudo docker swarm init --listen-addr $20:2377 --advertise-addr $20:2377
    sudo docker swarm join-token --quiet manager > /vagrant/token
    sudo docker network create --attachable --driver overlay audit_network
else
    echo Swarm Join...
    sudo docker swarm join --token $(cat /vagrant/token) $20:2377 --advertise-addr $2$1:2377
fi
echo Sawtooth Pull...
sudo docker-compose -f /vagrant/docker/docker-compose-$1.yml pull -q
echo Sawtooth Build...
sudo docker-compose -f /vagrant/docker/docker-compose-$1.yml build -q