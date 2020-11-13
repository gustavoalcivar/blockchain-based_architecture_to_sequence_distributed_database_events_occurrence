const schema = "dbo";

const database = "mybank";

const indexPath = "node F:\\vagrant_docker_swarm\\interface\\index.js ";

const configTable = "blockchain_config";

const configColumn = "active";

const configWhereClause = "1 = 1"; // Example: param = 'active_blockchain' AND value = 1

const parametrization = [
  {
    table: "transacciones",
    columns: ["id", "monto", "id_cuenta_bancaria", "id_tipo_transaccion"],
  },
  {
    table: "tipo_transaccion",
    columns: ["id", "descripcion"],
  },
  {
    table: "cuentas_bancarias",
    columns: ["id", "moneda", "id_cliente", "saldo"],
  },
  {
    table: "clientes",
    columns: ["id", "nombre", "apellido", "telefono", "correo"],
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
