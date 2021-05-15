use mybank
go

declare
@time datetime,
@cnt INT = 0,
@id_cuenta int,
@monto int,
@user varchar(30);
WHILE @cnt < 250
BEGIN
	declare @max int;
	select @max=max(id) from transacciones;
	if @max > 0
	select @time = getdate();
	select @monto = FLOOR(RAND()*(999-1+1)+1);
	select @user = concat('user', FLOOR(RAND()*(10-1+1)+1));
	EXEC sys.sp_set_session_context @key = N'application_time', @value = @time;
	EXEC sys.sp_set_session_context @key = N'application_user', @value = @user;
	update transacciones set monto=@monto where id=@max;
   SET @cnt = @cnt + 1;
END