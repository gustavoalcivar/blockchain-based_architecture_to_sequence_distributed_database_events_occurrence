fs = require("fs");
const {
	schema,
	database,
	parametrization
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
parametrization.forEach((table) => {
  data =
    data +
    `
    IF not exists(SELECT 1 FROM INFORMATION_SCHEMA.columns WHERE table_name='${table.table}' AND column_name='application_time')
    BEGIN
      ALTER TABLE ${table.table} ADD application_time varchar(23)
    END
  IF not exists(SELECT 1 FROM INFORMATION_SCHEMA.columns WHERE table_name='${table.table}' AND column_name='application_user')
    BEGIN
      ALTER TABLE ${table.table} ADD application_user varchar(255)
    END
    `;

  let spParams = "";
  let spColumns = "";
  let spValues = "";
  let spUpdate = "";
  let idColumn = "";
  let idType = "";
  table.columns.forEach((item) => {
    if(item.split("|").length == 2) {
      spParams = spParams + `@${item.split("|")[0]} ${item.split("|")[1]},`;
      spColumns = spColumns + `${item.split("|")[0]},`;
      spValues = spValues + `@${item.split("|")[0]},`;
      spUpdate = spUpdate + `${item.split("|")[0]}=@${item.split("|")[0]},`;
    } else if(item.split("|").length == 3) {
      idColumn = `${item.split("|")[0]}`;
      idType = item.split("|")[1];
    }
  });

  data =
    data +
    `
    IF OBJECT_ID ('insert_${table.table}_store_procedure', 'P') IS NOT NULL
    BEGIN
    DROP PROCEDURE ${schema}.insert_${table.table}_store_procedure
    END
    GO
    CREATE PROCEDURE ${schema}.insert_${table.table}_store_procedure(
    ${spParams}
    @application_time varchar(23),
    @application_user varchar(255)
    )
    AS
     BEGIN
      insert into ${table.table}(${spColumns}application_time,application_user) values(${spValues}@application_time,@application_user)
     END
     GO
    
     IF OBJECT_ID ('update_${table.table}_store_procedure', 'P') IS NOT NULL
     BEGIN
     DROP PROCEDURE ${schema}.update_${table.table}_store_procedure
     END
     GO
     CREATE PROCEDURE ${schema}.update_${table.table}_store_procedure(
      @${idColumn} ${idType},
      ${spParams}
      @application_time varchar(23),
      @application_user varchar(255)
     )
     AS
      BEGIN
       update ${table.table} set ${spUpdate.substring(0, spUpdate.length)}application_time=@application_time,application_user=@application_user where ${idColumn}=@${idColumn}
      END
      GO

      IF OBJECT_ID ('delete_${table.table}_store_procedure', 'P') IS NOT NULL
      BEGIN
      DROP PROCEDURE ${schema}.delete_${table.table}_store_procedure
      END
      GO
      CREATE PROCEDURE ${schema}.delete_${table.table}_store_procedure(
       @${idColumn} ${idType},
       @application_time varchar(23),
       @application_user varchar(255)
      )
      AS
       BEGIN
        delete ${table.table} where ${idColumn}=@${idColumn}
       END
       GO
  `;

  data =
    data +
    `
	IF OBJECT_ID ('tr_insert_${table.table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_insert_${table.table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_insert_${table.table}
	ON ${schema}.${table.table} FOR INSERT AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000);

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			set @data = (SELECT '${database}' as 'database',
      '${table.table}' as 'table',
      'INSERT' as 'transaction',
      REPLACE(SYSTEM_USER,'\\','_') as 'user',
      * FROM inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [${requestTypeMessage}] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_update_${table.table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_update_${table.table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_update_${table.table}
	ON ${schema}.${table.table} FOR UPDATE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000);

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			set @data = (SELECT '${database}' as 'database',
      '${table.table}' as 'table',
      'UPDATE' as 'transaction',
      REPLACE(SYSTEM_USER,'\\','_') as 'user',
      * FROM deleted, inserted FOR XML AUTO, ELEMENTS);

      ;SEND ON CONVERSATION @ch
      MESSAGE TYPE [${requestTypeMessage}] (@data);
      COMMIT;
    end
  go

  IF OBJECT_ID ('tr_delete_${table.table}', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.tr_delete_${table.table}
	END
	GO
	CREATE TRIGGER ${schema}.tr_delete_${table.table}
	ON ${schema}.${table.table} FOR DELETE AS
	 BEGIN
    DECLARE
    @ch UNIQUEIDENTIFIER,
		@data nvarchar(4000);

		BEGIN TRANSACTION;
    BEGIN DIALOG CONVERSATION @ch
      FROM SERVICE [InitiatorService]
      TO SERVICE 'TargetService'
      ON CONTRACT [${contract}]
      WITH ENCRYPTION = OFF;

			set @data = (SELECT '${database}' as 'database',
      '${table.table}' as 'table',
      'DELETE' as 'transaction',
      REPLACE(SYSTEM_USER,'\\','_') as 'user',
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
