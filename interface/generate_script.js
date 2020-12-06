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
  let strInsertDelete = "";
  let strUpdate = "";
  table.columns.forEach((item) => {
    strInsertDelete = strInsertDelete + `\\"${item}\\":\\"',${item},'\\",`;
    strUpdate =
      strUpdate +
      `\\"${item}_old\\":\\"',deleted.${item},'\\",` +
      `\\"${item}_new\\":\\"',inserted.${item},'\\",`;
  });
  strInsertDelete = strInsertDelete.substring(0, strInsertDelete.length - 1);
  strUpdate = strUpdate.substring(0, strUpdate.length - 1);

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
		set @cmd = '${indexPath} {\\"type\\":\\"save\\",\\"metadata\\":{\\"database\\":\\"${database}\\",\\"table\\":\\"${table.table}\\",\\"transaction\\":\\"' + @transaction + '\\",\\"user\\":\\"' + REPLACE(SYSTEM_USER,'\\','_') + '\\"},\\"data\\":{' + @data + '}}'
		EXEC Master..xp_cmdshell @cmd
	 END
	 GO
	`;
});

fs.writeFile(`script_${database}.sql`, data, function (err) {
  if (err) return console.log(err);
  console.log(`script_${database}.sql`);
});
