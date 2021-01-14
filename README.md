# vagrant_docker_swarm
docker-compose -f /vagrant/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-3.yml logs --tail=30 --follow


# Ejemplo de llamada a la blockchain
node F:\vagrant_docker_swarm\interface\index.js  '{\"metadata\":{\"database\":\"mybank\",\"table\":\"transacciones\",\"transaction\":\"INSERT\",\"user\":\"gaar\",\"host\":\"GUSTAVO-PC\",\"datetime\":\"Wed Jan 13 2021 16:46:56 GMT-0500 (Ecuador Time)\",\"unixDatetime\":\"1610574416\"},\"data\":{\"id\":\"13344\",\"monto\":\"6966\",\"id_cuenta_bancaria\":\"1\",\"id_tipo_transaccion\":\"2\",\"application_time\":\"2021-01-13 16:46:53.17\",\"application_user\":\"FVNMI\"}}'
