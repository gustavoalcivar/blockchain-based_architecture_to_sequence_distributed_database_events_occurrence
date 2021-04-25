use mybank
go

declare
@time datetime,
@cnt INT = 0,
@id_borrar int,
@user varchar(30);
WHILE @cnt < 250
BEGIN
	select @id_borrar = min(id) from transacciones;
	if @id_borrar > 0
	BEGIN
		select @time = getdate();
		select @user = concat('user', FLOOR(RAND()*(10-1+1)+1));
		EXEC sys.sp_set_session_context @key = N'application_time', @value = @time;
		EXEC sys.sp_set_session_context @key = N'application_user', @value = @user;
		delete transacciones where id = @id_borrar;
	END
   SET @cnt = @cnt + 1;
END