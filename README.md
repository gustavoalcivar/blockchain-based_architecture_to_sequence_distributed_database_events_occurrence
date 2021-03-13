# vagrant_docker_swarm
docker-compose -f $HOME/blockchain/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-3.yml logs --tail=30 --follow


# Ejemplo de llamada a la blockchain
node F:\vagrant_docker_swarm\interface\index.js  '{\"metadata\":{\"database\":\"mybank\",\"table\":\"transacciones\",\"transaction\":\"INSERT\",\"user\":\"gaar\",\"host\":\"GUSTAVO-PC\",\"datetime\":\"Wed Jan 13 2021 16:46:56 GMT-0500 (Ecuador Time)\",\"unixDatetime\":\"1610574416\"},\"data\":{\"id\":\"13344\",\"monto\":\"6966\",\"id_cuenta_bancaria\":\"1\",\"id_tipo_transaccion\":\"2\",\"application_time\":\"2021-01-13 16:46:53.17\",\"application_user\":\"FVNMI\"}}'


EN EL NODO 0
---------------------------------------------------------------------------------------
sudo apt-get install -y nfs-kernel-server
sudo nano /etc/exports
Añadir una línea por cada equipo al w¡q se quiera compartir (o con .0 para compartir con toda la red)
/ruta/carpeta/a/compartir 192.168.1.0/24(rw,no_subtree_check,async)
sudo exportfs -arv
sudo systemctl enable nfs-kernel-server
sudo systemctl start nfs-kernel-server


EN LOS DEMÁS NODOS
----------------------------------------------------------------------------------------
sudo apt-get install -y nfs-common
sudo mkdir -P /ruta/para/contenido/carpeta/compartida/
sudo nano /etc/fstab
Añadir la línea
IP_SERVIDOR:/ruta/carpeta/a/compartir /ruta/para/contenido/carpeta/compartida/ nfs rw,async 0 0
sudo mount -a

BLOCKCHAIN
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

# Eliminar todo de docker
sudo docker system prune --all

EN TODOS LOS NODOS
----------------------------------------------------------------------------------------
sh $HOME/blockchain/scripts/restart/restart.sh
OR
sh $HOME/blockchain/scripts/restart/restart_delete_data.sh

EN CADA NODO
---------------------------------------------------------------------------------------
sh $HOME/blockchain/scripts/docker_swarm/docker_swarm_0.sh
sh $HOME/blockchain/scripts/docker_swarm/docker_swarm_1.sh
sh $HOME/blockchain/scripts/docker_swarm/docker_swarm_2.sh
sh $HOME/blockchain/scripts/docker_swarm/docker_swarm_3.sh

EN CADA NODO
------------------------------------------------------------------------------------------

sh $HOME/blockchain/scripts/run/run_0.sh
OR
sh $HOME/blockchain/scripts/run/run_0_0.sh

sh $HOME/blockchain/scripts/run/run_1.sh
sh $HOME/blockchain/scripts/run/run_2.sh
sh $HOME/blockchain/scripts/run/run_3.sh

NOTAS
------------------------------------------------------------------------------------------
Habilitar conexiones externas y login mediante usuario y contraseña en sql server
