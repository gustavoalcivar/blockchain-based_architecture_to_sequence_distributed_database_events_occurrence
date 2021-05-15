use mybank
go

declare
@time datetime,
@cnt INT = 0,
@id_borrar int,
@user varchar(30);
WHILE @cnt < 250
BEGIN
	declare @max int;
	select @max=max(id) from transacciones;
	if @max > 0
	BEGIN
		select @time = getdate();
		select @user = concat('user', FLOOR(RAND()*(10-1+1)+1));
		EXEC sys.sp_set_session_context @key = N'application_time', @value = @time;
		EXEC sys.sp_set_session_context @key = N'application_user', @value = @user;
		delete transacciones where id = @max;
	END
   SET @cnt = @cnt + 1;
END