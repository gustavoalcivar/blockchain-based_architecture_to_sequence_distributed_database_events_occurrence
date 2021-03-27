# vagrant_docker_swarm
docker-compose -f $HOME/blockchain/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-3.yml logs --tail=30 --follow

EN EL NODO 0
---------------------------------------------------------------------------------------
sudo hostnamectl set-hostname node0
sudo apt-get update
sudo apt-get install -y nfs-kernel-server
sudo nano /etc/exports
Añadir una línea por cada equipo al que se quiera compartir (o con .0 para compartir con toda la red)
/ruta/carpeta/a/compartir 192.168.1.0/24(rw,no_subtree_check,async)
/home/gustavobsc5/blockchain 10.142.0.3(rw,no_subtree_check)
/home/gustavobsc5/blockchain 10.142.0.4(rw,no_subtree_check)
/home/gustavobsc5/blockchain 10.142.0.5(rw,no_subtree_check)
sudo exportfs -arv
sudo systemctl enable nfs-kernel-server
sudo systemctl start nfs-kernel-server


EN LOS DEMÁS NODOS
----------------------------------------------------------------------------------------
sudo hostnamectl set-hostname node0 | sudo hostnamectl set-hostname node1 | sudo hostnamectl set-hostname node2 | sudo hostnamectl set-hostname node3
sudo apt-get update
sudo apt-get install -y nfs-common
mkdir -p /ruta/para/contenido/carpeta/compartida/
mkdir -p /home/gustavobsc5/blockchain/
sudo nano /etc/fstab
Añadir la línea
IP_SERVIDOR:/ruta/carpeta/a/compartir /ruta/para/contenido/carpeta/compartida/ nfs rw,async 0 0
10.142.0.2:/home/gustavobsc5/blockchain /home/gustavobsc5/blockchain/ nfs rw 0 0
sudo mount -a

BLOCKCHAIN
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

# Eliminar todo de docker
sudo docker system prune --all

EN TODOS LOS NODOS
----------------------------------------------------------------------------------------
sh $HOME/blockchain/scripts/restart.sh

EN CADA NODO
---------------------------------------------------------------------------------------
sh $HOME/blockchain/scripts/docker_swarm.sh

EN CADA NODO
------------------------------------------------------------------------------------------
sh $HOME/blockchain/scripts/run.sh

EN EL CLIENTE
---------------------------------------------------------------------------------------
sudo apt-get update
sudo apt-get install -y tightvncserver openjdk-11-jre tasksel
sudo tasksel install xubuntu-desktop
vncserver

Start VNC server
vncserver

Client: Real VNC viewer
https://www.realvnc.com/es/connect/download/viewer/

NOTAS
------------------------------------------------------------------------------------------
Habilitar conexiones externas y login mediante usuario y contraseña en sql server


https://blog.maskalik.com/sql-server-service-broker/scalable-webservice-calls-from-database/

https://www.sqlshack.com/using-the-sql-server-service-broker-for-asynchronous-processing/