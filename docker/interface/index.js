const Sqlssb = require("sqlssb");
const fetch = require("node-fetch");
const { xmlToJson } = require("./functions");

const service1 = new Sqlssb({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  service: "TargetService",
  queue: "TargetQueue"
})

service1.on("http://audit_blockchail/RequestMessage", async ctx => {
  // La interfaz se conecta al servicio que expone el cliente de blockchain
  let res = await fetch(`http://client-${process.env.NODE}:4000/saveAudit/`, {
    method: "post",
    body: JSON.stringify(xmlToJson(ctx.messageBody)),
    headers: { "Content-Type": "application/json" }
  });
  console.log(await res.json());
});
 
service1.start({ //default settings:
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})