# vagrant_docker_swarm

Puertos habilitados GCP:
1433 -> SQL Server
80 -> http - nginx
4000 -> client api
3000 -> Grafana
8086 -> Influxdb

docker-compose -f $HOME/blockchain/docker/docker-compose-0.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-1.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-2.yml logs --tail=30 --follow
docker-compose -f $HOME/blockchain/docker/docker-compose-3.yml logs --tail=30 --follow

tail -f $HOME/blockchain/interface/interface.log

EN EL NODO 0
---------------------------------------------------------------------------------------
sudo ufw disable
sudo hostnamectl set-hostname sqlserver0
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
sudo ufw disable
sudo hostnamectl set-hostname sqlserver1 | sudo hostnamectl set-hostname sqlserver2 | sudo hostnamectl set-hostname sqlserver3
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

sh $HOME/blockchain/scripts/run_interface.sh

EN DESARROLLO
------------------------------------------------------------------------------------------
docker-compose -f docker-compose-dev.yml up --force

NOTAS
------------------------------------------------------------------------------------------
Habilitar conexiones externas y login mediante usuario y contraseña en sql server

CAMBIAR EL NOMBRE DEL HOST EN SQL SERVER
------------------------------------------------------------------------------------------
select @@SERVERNAME

EXEC sp_dropserver 'node0';  
GO  
EXEC sp_addserver 'sqlserver0', local;  
GO


https://blog.maskalik.com/sql-server-service-broker/scalable-webservice-calls-from-database/

https://www.sqlshack.com/using-the-sql-server-service-broker-for-asynchronous-processing/

https://sqa.stackexchange.com/questions/46305/jmeter-how-do-i-run-parallel-jdbc-requests-in-jmeter

https://www.sqlshack.com/es/varias-tecnicas-para-auditar-bases-de-datos-de-sql-server/


# Scripts jmeter

insert
------------------------------------------------------------------------------------------
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';

insert into transacciones(id_cuenta_bancaria, id_tipo_transaccion, monto) values (${__Random(1,2,)},${__Random(1,2,)},${__Random(1,9999,)})
```

update
------------------------------------------------------------------------------------------
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';

update cuentas_bancarias set saldo=${__Random(1,9999,)} where id=${__Random(1,2,)}
```

delete
------------------------------------------------------------------------------------------
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';

declare @id_borrar int
select @id_borrar = min(id) from transacciones
if @id_borrar > 0
delete transacciones where id = @id_borrar
```
