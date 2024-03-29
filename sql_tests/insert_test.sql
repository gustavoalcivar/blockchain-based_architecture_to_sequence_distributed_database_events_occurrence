use mybank
go

declare
@time datetime,
@cnt INT = 0,
@id_cuenta int,
@id_transaccion int,
@monto int,
@user varchar(30);
WHILE @cnt < 250
BEGIN
	select @time = getdate();
	select @id_cuenta = FLOOR(RAND()*(2-1+1)+1);
	select @id_transaccion = FLOOR(RAND()*(2-1+1)+1);
	select @monto = FLOOR(RAND()*(999-1+1)+1);
	select @user = concat('user', FLOOR(RAND()*(10-1+1)+1));
	EXEC sys.sp_set_session_context @key = N'application_time', @value = @time;
	EXEC sys.sp_set_session_context @key = N'application_user', @value = @user;
	insert into transacciones(id_cuenta_bancaria, id_tipo_transaccion, monto) values (@id_cuenta,@id_transaccion,@monto);
   SET @cnt = @cnt + 1;
END