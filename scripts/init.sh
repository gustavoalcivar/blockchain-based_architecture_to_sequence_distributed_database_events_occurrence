#!/usr/bin/env bash
echo Uninstall old Docker version...
sudo apt-get remove -y docker docker-engine docker.io containerd runc
echo Install Docker...
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker vagrant
echo Install Docker Compose...
sudo curl -s -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
echo Docker Pull...
docker-compose -f /vagrant/docker/docker-compose-$1.yml pull -q
echo Docker Build...
docker-compose -f /vagrant/docker/docker-compose-$1.yml build -q