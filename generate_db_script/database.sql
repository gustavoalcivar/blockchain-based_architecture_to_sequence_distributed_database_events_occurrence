use master
go

DROP DATABASE IF EXISTS mybank
go

CREATE DATABASE mybank
go

use mybank
go

CREATE TABLE clientes (id INT IDENTITY(1,1) PRIMARY KEY, nombre VARCHAR(50), apellido VARCHAR(50), telefono VARCHAR(20), correo VARCHAR(50))
CREATE TABLE tipo_transaccion (id INT IDENTITY(1,1) PRIMARY KEY, descripcion VARCHAR(255))
CREATE TABLE cuentas_bancarias (id INT IDENTITY(1,1) PRIMARY KEY, moneda VARCHAR(10), id_cliente INT, saldo FLOAT, FOREIGN KEY (id_cliente) REFERENCES clientes(id))
CREATE TABLE transacciones (id INT IDENTITY(1,1) PRIMARY KEY, id_cuenta_bancaria INT, id_tipo_transaccion INT, monto FLOAT, FOREIGN KEY (id_cuenta_bancaria) REFERENCES cuentas_bancarias(id), FOREIGN KEY (id_tipo_transaccion) REFERENCES tipo_transaccion(id))
go

INSERT INTO clientes(nombre, apellido, telefono, correo) values ('Gustavo', 'Alcívar', '0960590338', 'gustavo.alcivar@epn.edu.ec')
go
INSERT INTO clientes(nombre, apellido, telefono, correo) values ('Alfonso', 'Rodríguez', '0960590339', 'gustavoalfonso05@hotmail.com')
go

INSERT INTO tipo_transaccion(descripcion) values('Depósito')
go
INSERT INTO tipo_transaccion(descripcion) values('Retiro')
go

INSERT INTO cuentas_bancarias (moneda, id_cliente, saldo) values('USD', 1, 5120)
go
INSERT INTO cuentas_bancarias (moneda, id_cliente, saldo) values('USD', 2, 2900)
go

select * from mybank.dbo.transacciones
select * from mybank.dbo.cuentas_bancarias
select * from mybank.dbo.tipo_transaccion
select * from mybank.dbo.clientes

select * from externalactivatorqueue

select * from targetqueue

