# vagrant_docker_swarm
docker-compose -f /vagrant/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f /vagrant/docker/docker-compose-3.yml logs --tail=30 --follow


# Ejemplo de llamada a la blockchain
node F:\vagrant_docker_swarm\interface\index.js  '{\"metadata\":{\"database\":\"mybank\",\"table\":\"transacciones\",\"transaction\":\"INSERT\",\"user\":\"gaar\",\"host\":\"GUSTAVO-PC\",\"datetime\":\"Wed Jan 13 2021 16:46:56 GMT-0500 (Ecuador Time)\",\"unixDatetime\":\"1610574416\"},\"data\":{\"id\":\"13344\",\"monto\":\"6966\",\"id_cuenta_bancaria\":\"1\",\"id_tipo_transaccion\":\"2\",\"application_time\":\"2021-01-13 16:46:53.17\",\"application_user\":\"FVNMI\"}}'


EN EL NODO 0
---------------------------------------------------------------------------------------
sudo apt-get install nfs-kernel-server
sudo nano /etc/exports
Añadir una línea por cada equipo al w¡q se quiera compartir (o con .0 para compartir con toda la red)
/ruta/carpeta/a/compartir 192.168.1.0/24(rw,no_subtree_check,async)
sudo exportfs -arv
sudo systemctl enable nfs-kernel-server
sudo systemctl start nfs-kernel-server


EN TODOS LOS NODOS
----------------------------------------------------------------------------------------
sudo apt install nfs-common
sudo mkdir -P /ruta/para/contenido/carpeta/compartida/
sudo nano /etc/fstab
Añadir la línea
IP_SERVIDOR:/ruta/carpeta/a/compartir /ruta/para/contenido/carpeta/compartida/ nfs rw,async 0 0
sudo mount -a

BLOCKCHAIN
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

EN TODOS LOS NODOS
----------------------------------------------------------------------------------------
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker volume rm -f $(docker volume ls -q)
docker swarm leave -f
docker network prune -f

EN EL NODO 0
---------------------------------------------------------------------------------------
sudo chmod -R 777 /home/gustavobsc5/docker/
docker swarm init --listen-addr 10.142.0.2:2377 --advertise-addr 10.142.0.2:2377
docker swarm join-token --quiet manager > /home/gustavobsc5/docker/token
docker network create --attachable --driver overlay audit_network

EN LOS DEMÁS NODOS
----------------------------------------------------------------------------------------
docker swarm join --token $(cat /home/gustavobsc5/docker/token) 10.142.0.2:2377 --advertise-addr 10.142.0.3:2377

docker swarm join --token $(cat /home/gustavobsc5/docker/token) 10.142.0.2:2377 --advertise-addr 10.142.0.4:2377

docker swarm join --token $(cat /home/gustavobsc5/docker/token) 10.142.0.2:2377 --advertise-addr 10.142.0.5:2377

EN CADA NODO
------------------------------------------------------------------------------------------
docker-compose -f /home/gustavobsc5/docker/docker-compose-0.yml up

docker-compose -f /home/gustavobsc5/docker/docker-compose-1.yml up

docker-compose -f /home/gustavobsc5/docker/docker-compose-2.yml up

docker-compose -f /home/gustavobsc5/docker/docker-compose-3.yml up
