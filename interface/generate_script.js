fs = require("fs");
const {
	schema,
	database,
	indexPath,
	configTable,
	configColumn,
	configWhereClause,
	parametrization
} = require("./config");

let data = `
use ${database}
go

-- To allow advanced options to be changed.
EXEC sp_configure 'show advanced options', 1
GO
-- To update the currently configured value for advanced options.
RECONFIGURE
GO
-- To enable the feature.
EXEC sp_configure 'xp_cmdshell', 1
GO
-- To update the currently configured value for this feature.
RECONFIGURE
GO
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
  
  let strInsertDelete = "";
  let strUpdate = "";
  table.columns.forEach((item) => {
    strInsertDelete = strInsertDelete + `\\"${item.split("|")[0]}\\":\\"',${item.split("|")[0]},'\\",`;
    strUpdate =
      strUpdate +
      `\\"${item.split("|")[0]}_old\\":\\"',deleted.${item.split("|")[0]},'\\",` +
      `\\"${item.split("|")[0]}_new\\":\\"',inserted.${item.split("|")[0]},'\\",`;
  });
  strInsertDelete = strInsertDelete + `\\"application_time\\":\\"',application_time,'\\",`;
  strInsertDelete = strInsertDelete + `\\"application_user\\":\\"',application_user,'\\"`;
  strUpdate =
    strUpdate +
    `\\"application_time_old\\":\\"',deleted.application_time,'\\",` +
    `\\"application_time_new\\":\\"',inserted.application_time,'\\",`;
    strUpdate =
    strUpdate +
    `\\"application_user_old\\":\\"',deleted.application_user,'\\",` +
    `\\"application_user_new\\":\\"',inserted.application_user,'\\"`;
  strInsertDelete = strInsertDelete.substring(0, strInsertDelete.length);
  strUpdate = strUpdate.substring(0, strUpdate.length);

  data =
    data +
    `
	IF OBJECT_ID ('${table.table}_trigger', 'TR') IS NOT NULL
	BEGIN
	DROP TRIGGER ${schema}.${table.table}_trigger
	END
	GO
	CREATE TRIGGER ${schema}.${table.table}_trigger
	ON ${schema}.${table.table}
	 AFTER INSERT, UPDATE, DELETE AS
	 BEGIN
		declare @transaction nvarchar(4000),
		@data nvarchar(4000),
		@cmd nvarchar(4000),
		@active bit = 0

		select @active = ${configColumn} FROM ${configTable} WHERE ${configWhereClause}
		
		if exists (Select * from inserted) and not exists(Select * from deleted) and @active = 1
		begin
			set @transaction = 'INSERT'
			select @data = concat('${strInsertDelete}') from inserted;
		end
		if exists(SELECT * from inserted) and exists (SELECT * from deleted) and @active = 1
		begin
			set @transaction = 'UPDATE'
			select @data = concat('${strUpdate}') from inserted, deleted;
		end
		If exists(select * from deleted) and not exists(Select * from inserted)  and @active = 1
		begin
			set @transaction = 'DELETE'
			select @data = concat('${strInsertDelete}') from deleted;
		end
		set @cmd = '${indexPath} {\\"metadata\\":{\\"database\\":\\"${database}\\",\\"table\\":\\"${table.table}\\",\\"transaction\\":\\"' + @transaction + '\\",\\"user\\":\\"' + REPLACE(SYSTEM_USER,'\\','_') + '\\"},\\"data\\":{' + @data + '}}'
    BEGIN TRY
      BEGIN TRAN
        EXEC Master..xp_cmdshell @cmd
      COMMIT TRAN
    END TRY
    BEGIN CATCH
      ROLLBACK TRAN;
      THROW; -- raise error to the client
    END CATCH
    END
	 GO
	`;
});

fs.writeFile(`script_${database}.sql`, data, function (err) {
  if (err) return console.log(err);
  console.log(`script_${database}.sql`);
});
