# Blockchain-based architecture to sequence distributed database events occurrence
## Pre-requisites
- Have 5 Ubuntu 20.04 server virtual machines / servers (4 to be blockchain nodes, 1 to be client with Apache JMeter)
- TCP ports enabled in VM/Servers
    - 1433 -> SQL Server
    - 80 -> http - nginx
    - 4000 -> blockchain client api
    - 3000 -> Grafana
    - 8086 -> Influxdb

## Clone repository
Clone repository and copy sources on each blockchain node
```sh
git clone https://github.com/gustavoalcivar/blockchain-based_architecture_to_sequence_distributed_database_events_occurrence.git
cd blockchain-based_architecture_to_sequence_distributed_database_events_occurrence
```
Configure server's IP's addresses in ./ips
## Install SQL Server
Follow the instructions in [Install SQL Server on Linux](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver15) (remember user and password to connect to database)
## Generate test data
On each blockchain node, connect to SQL Server database engine and execute the script ./generate_db_script/database.sql
## Generate Service Broker objects and triggers in database
To generate objects for test data, on each blockchain node, connect to SQL Server database engine and execute the script ./generate_db_script/script_mybank.sql

To generate object for other database, edit the file ./generate_db_script/config.js with your database information and execute (nodejs is necesary - [NodeJs](https://nodejs.org/))
```
cd generate_db_script
node generate_script.js
```
And on each blockchain node, connect to SQL Server database engine and execute the script ./generate_db_script/script_{database_name}.sql
## Changing database server name
If necesary, change the SQL Server database name by executing
```
EXEC sp_dropserver 'old_name';
GO
EXEC sp_addserver 'sqlserver0', local; -- sqlserver0 is the new name
GO
```
And, check name with
```
select @@SERVERNAME
```
## Install docker and docker-compose
On each blockchain node, execute the script ./scripts/installations.sh
## On first blockchain node
Execute
```sh
sudo ufw disable
sudo hostnamectl set-hostname sqlserver0
sudo apt-get update
sudo apt-get install -y nfs-kernel-server
```
Add following lines in /etc/exports (replace user and IP's)
```
/home/user/blockchain 10.142.0.3(rw,no_subtree_check)
/home/user/blockchain 10.142.0.4(rw,no_subtree_check)
/home/user/blockchain 10.142.0.5(rw,no_subtree_check)
```
Execute
```
sudo exportfs -arv
sudo systemctl enable nfs-kernel-server
sudo systemctl start nfs-kernel-server
```
## On the rest of blockchain nodes
Execute (set the corresponding hostname)
```sh
sudo ufw disable
sudo hostnamectl set-hostname sqlserver1 | sudo hostnamectl set-hostname sqlserver2 | sudo hostnamectl set-hostname sqlserver3
sudo apt-get update
sudo apt-get install -y nfs-common
mkdir -p /path/to/shared/folder/content/
```
Add following line in /etc/fstab (replace user and IP's)
```
10.142.0.2:/home/user/blockchain /path/to/shared/folder/content/ nfs rw 0 0
```
Execute
```
sudo mount -a
```
## Start/restart blockchain
Execute on each node (one command at a time on each server and waiting for each command to finish before executing the next)
```
sh $HOME/blockchain/scripts/restart.sh
```
```
sh $HOME/blockchain/scripts/docker_swarm.sh
```
```
sh $HOME/blockchain/scripts/run.sh
```
To see logs execute
```
sh $HOME/blockchain/scripts/logs.sh
```
To delete and restart blockchain data, edit the file ./restart_data (0 to keep data, 1 to delete data and start new blockchain)
## Stop blockchain
Execute on each node
```
sh $HOME/blockchain/scripts/stop.sh
```
## Start blockchain development mode
Execute on develop machine
```
docker-compose -f docker-compose-dev.yml up --force
```
## Enable/disable triggers in database to test blockchain active/inactive performance
```
-- enable triggers in database
use {database_name}
go
ENABLE TRIGGER ALL On DATABASE
go

-- disable triggers in database
use {database_name}
go
DISABLE TRIGGER ALL ON DATABASE

-- enable triggers in server
use master
go
ENABLE TRIGGER ALL ON SERVER

-- disable triggers in server
use master
go
DISABLE TRIGGER ALL ON SERVER
```
## Client (Apache JMeter machine)
Apache JMeter machine needs Java, Apache JMeter configured - [Apache JMeter get started](https://jmeter.apache.org/usermanual/get-started.html), and JDBC for SQL Server configured in JMeter.
To launch tests from client, open Apache JMeter and open one of the files:
- ./jmeter/prod/SQL_load_insert_test.jmx
- ./jmeter/prod/SQL_load_update_test.jmx
- ./jmeter/prod/SQL_load_delete_test.jmx

Finally execute the test.

### Apache JMeter scripts
#### insert
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';

insert into transacciones(id_cuenta_bancaria, id_tipo_transaccion, monto) values (${__Random(1,2,)},${__Random(1,2,)},${__Random(1,9999,)})
```
#### update
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';
declare @max int;
select @max=max(id) from transacciones;
if @max > 0
update transacciones set monto=${__Random(1,9999,)} where id=@max;
```

#### delete
```
EXEC sys.sp_set_session_context @key = N'application_time', @value = '${__time(yyy-MM-dd HH:mm:ss.SSS,)}';
EXEC sys.sp_set_session_context @key = N'application_user', @value = '${__V(user${__Random(1,10,)})}';

declare @max int;
select @max=max(id) from transacciones;
if @max > 0
delete transacciones where id=@max;
```