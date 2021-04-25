
use mybank
go
ALTER DATABASE [mybank] SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;

-----------------------------------------------------------------------------------------------------
BEGIN TRY
DROP EVENT NOTIFICATION EventNotificationTargetQueue
  ON QUEUE TargetQueue

DROP SERVICE ExternalActivatorService
DROP QUEUE ExternalActivatorQueue
DROP SERVICE TargetService
DROP SERVICE InitiatorService
DROP QUEUE TargetQueue
DROP QUEUE InitiatorQueue
DROP CONTRACT [http://audit_blockchail/Contract]
DROP MESSAGE TYPE [http://audit_blockchail/ResponseMessage]
DROP MESSAGE TYPE [http://audit_blockchail/RequestMessage]
END TRY
BEGIN CATCH
print 'CREATING NEW OBJECTS'
END CATCH
-----------------------------------------------------------------------------------------------------

CREATE MESSAGE TYPE [http://audit_blockchail/RequestMessage]
VALIDATION = WELL_FORMED_XML

CREATE MESSAGE TYPE [http://audit_blockchail/ResponseMessage]
VALIDATION = WELL_FORMED_XML

CREATE CONTRACT [http://audit_blockchail/Contract]
(
  [http://audit_blockchail/RequestMessage] SENT BY INITIATOR,
  [http://audit_blockchail/ResponseMessage] SENT BY TARGET
)

CREATE QUEUE InitiatorQueue
WITH STATUS = ON

CREATE QUEUE TargetQueue

CREATE SERVICE InitiatorService
ON QUEUE InitiatorQueue
(
  [http://audit_blockchail/Contract]
)

CREATE SERVICE TargetService
ON QUEUE TargetQueue
(
  [http://audit_blockchail/Contract]
)

CREATE QUEUE ExternalActivatorQueue

CREATE SERVICE ExternalActivatorService
ON QUEUE ExternalActivatorQueue
(
    [http://schemas.microsoft.com/SQL/Notifications/PostEventNotification]
)

CREATE EVENT NOTIFICATION EventNotificationTargetQueue
  ON QUEUE TargetQueue
  FOR QUEUE_ACTIVATION
  TO SERVICE 'ExternalActivatorService', 'current database';

	IF OBJECT_ID ('tr_insert_transacciones', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_insert_transacciones
	END
	GO
	CREATE TRIGGER dbo.tr_insert_transacciones
	ON dbo.transacciones FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'transacciones' as '___table___',
      'INSERT' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_transacciones', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_update_transacciones
	END
	GO
	CREATE TRIGGER dbo.tr_update_transacciones
	ON dbo.transacciones FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'transacciones' as '___table___',
      'UPDATE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_transacciones', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_delete_transacciones
	END
	GO
	CREATE TRIGGER dbo.tr_delete_transacciones
	ON dbo.transacciones FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'transacciones' as '___table___',
      'DELETE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go
	
	IF OBJECT_ID ('tr_insert_tipo_transaccion', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_insert_tipo_transaccion
	END
	GO
	CREATE TRIGGER dbo.tr_insert_tipo_transaccion
	ON dbo.tipo_transaccion FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'tipo_transaccion' as '___table___',
      'INSERT' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_tipo_transaccion', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_update_tipo_transaccion
	END
	GO
	CREATE TRIGGER dbo.tr_update_tipo_transaccion
	ON dbo.tipo_transaccion FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'tipo_transaccion' as '___table___',
      'UPDATE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_tipo_transaccion', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_delete_tipo_transaccion
	END
	GO
	CREATE TRIGGER dbo.tr_delete_tipo_transaccion
	ON dbo.tipo_transaccion FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'tipo_transaccion' as '___table___',
      'DELETE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go
	
	IF OBJECT_ID ('tr_insert_cuentas_bancarias', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_insert_cuentas_bancarias
	END
	GO
	CREATE TRIGGER dbo.tr_insert_cuentas_bancarias
	ON dbo.cuentas_bancarias FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'cuentas_bancarias' as '___table___',
      'INSERT' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_cuentas_bancarias', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_update_cuentas_bancarias
	END
	GO
	CREATE TRIGGER dbo.tr_update_cuentas_bancarias
	ON dbo.cuentas_bancarias FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'cuentas_bancarias' as '___table___',
      'UPDATE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_cuentas_bancarias', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_delete_cuentas_bancarias
	END
	GO
	CREATE TRIGGER dbo.tr_delete_cuentas_bancarias
	ON dbo.cuentas_bancarias FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'cuentas_bancarias' as '___table___',
      'DELETE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go
	
	IF OBJECT_ID ('tr_insert_clientes', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_insert_clientes
	END
	GO
	CREATE TRIGGER dbo.tr_insert_clientes
	ON dbo.clientes FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'clientes' as '___table___',
      'INSERT' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_clientes', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_update_clientes
	END
	GO
	CREATE TRIGGER dbo.tr_update_clientes
	ON dbo.clientes FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'clientes' as '___table___',
      'UPDATE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_clientes', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER dbo.tr_delete_clientes
	END
	GO
	CREATE TRIGGER dbo.tr_delete_clientes
	ON dbo.clientes FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [http://audit_blockchail/Contract]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT 'mybank' as '___database___',
      'clientes' as '___table___',
      'DELETE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [http://audit_blockchail/RequestMessage] (@data);
      COMMIT;
    end
  go
	