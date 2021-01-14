const schema = "dbo";

const database = "mybank";

const indexPath = "node F:\\vagrant_docker_swarm\\interface\\index.js ";

const configTable = "blockchain_config";

const configColumn = "active";

const configWhereClause = "1 = 1"; // Example: param = 'active_blockchain' AND value = 1

const parametrization = [
  {
    table: "transacciones",
    columns: ["id|int|", "monto|float", "id_cuenta_bancaria|int", "id_tipo_transaccion|int"],
  },
  {
    table: "tipo_transaccion",
    columns: ["id|int|", "descripcion|varchar(255)"],
  },
  {
    table: "cuentas_bancarias",
    columns: ["id|int|", "moneda|varchar(10)", "id_cliente|int", "saldo|float"],
  },
  {
    table: "clientes",
    columns: ["id|int|", "nombre|varchar(50)", "apellido|varchar(50)", "telefono|varchar(20)", "correo|varchar(50)"],
  },
];

module.exports = {
  schema,
  database,
  indexPath,
  configTable,
  configColumn,
  configWhereClause,
  parametrization,
};
