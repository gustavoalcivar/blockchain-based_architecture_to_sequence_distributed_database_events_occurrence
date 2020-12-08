# vagrant_docker_swarm
docker-compose -f /vagrant/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-3.yml logs --tail=30 --follow


# Ejemplo de llamada a la blockchain
node F:\vagrant_docker_swarm\interface\index.js  '{\"metadata\":{\"database\":\"mybank\",\"table\":\"transacciones\",\"transaction\":\"insert\",\"user\":\"gex_alcivarga\"},\"trx_data\":{\"id\": \"66\"}}'

