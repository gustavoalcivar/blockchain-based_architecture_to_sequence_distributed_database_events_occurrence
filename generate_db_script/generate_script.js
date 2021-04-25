fs = require("fs");
const {
	schema,
	database,
	tables
} = require("./config");

const requestTypeMessage = "http://audit_blockchail/RequestMessage";
const responseTypeMessage = "http://audit_blockchail/ResponseMessage";
const contract = "http://audit_blockchail/Contract";
const postEventNotification = "http://schemas.microsoft.com/SQL/Notifications/PostEventNotification";

let data = `
use ${database}
go
ALTER DATABASE [${database}] SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;

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
DROP CONTRACT [${contract}]
DROP MESSAGE TYPE [${responseTypeMessage}]
DROP MESSAGE TYPE [${requestTypeMessage}]
END TRY
BEGIN CATCH
print 'CREATING NEW OBJECTS'
END CATCH
-----------------------------------------------------------------------------------------------------

CREATE MESSAGE TYPE [${requestTypeMessage}]
VALIDATION = WELL_FORMED_XML

CREATE MESSAGE TYPE [${responseTypeMessage}]
VALIDATION = WELL_FORMED_XML

CREATE CONTRACT [${contract}]
(
  [${requestTypeMessage}] SENT BY INITIATOR,
  [${responseTypeMessage}] SENT BY TARGET
)

CREATE QUEUE InitiatorQueue
WITH STATUS = ON

CREATE QUEUE TargetQueue

CREATE SERVICE InitiatorService
ON QUEUE InitiatorQueue
(
  [${contract}]
)

CREATE SERVICE TargetService
ON QUEUE TargetQueue
(
  [${contract}]
)

CREATE QUEUE ExternalActivatorQueue

CREATE SERVICE ExternalActivatorService
ON QUEUE ExternalActivatorQueue
(
    [${postEventNotification}]
)

CREATE EVENT NOTIFICATION EventNotificationTargetQueue
  ON QUEUE TargetQueue
  FOR QUEUE_ACTIVATION
  TO SERVICE 'ExternalActivatorService', 'current database';
`;
tables.forEach((table) => {
  data =
    data +
    `
	IF OBJECT_ID ('tr_insert_${table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_insert_${table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_insert_${table}
	ON ${schema}.${table} FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT '${database}' as '___database___',
      '${table}' as '___table___',
      'INSERT' as '___transaction___',
      REPLACE(SYSTEM_USER,'\\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [${requestTypeMessage}] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_${table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_update_${table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_update_${table}
	ON ${schema}.${table} FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT '${database}' as '___database___',
      '${table}' as '___table___',
      'UPDATE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [${requestTypeMessage}] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_${table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_delete_${table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_delete_${table}
	ON ${schema}.${table} FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000),
    @database_time datetime;

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			select @database_time = getdate();
      set @data = (SELECT '${database}' as '___database___',
      '${table}' as '___table___',
      'DELETE' as '___transaction___',
      REPLACE(SYSTEM_USER,'\\','_') as '___database_user___',
      @database_time as '___database_time___',
      SESSION_CONTEXT(N'application_time') as '___application_time___',
      SESSION_CONTEXT(N'application_user') as '___application_user___',
      HOST_NAME() as '___client_host___',
      @@SERVERNAME as '___database_host___',
      * FROM deleted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [${requestTypeMessage}] (@data);
      COMMIT;
    end
  go
	`;
});

fs.writeFile(`script_${database}.sql`, data, function (err) {
  if (err) return console.log(err);
  console.log(`script_${database}.sql`);
});
