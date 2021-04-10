const Sqlssb = require("sqlssb");
const { post } = require("axios");
const { xmlToJson } = require("./functions");

const service1 = new Sqlssb({
  user: process.env.DATABASE_USER || "gaar",
  password: process.env.DATABASE_PASSWORD || "gaar",
  server: process.env.DATABASE_SERVER || "localhost",
  database: process.env.DATABASE_NAME || "mybank",
  service: "TargetService",
  queue: "TargetQueue"
})

service1.on("http://audit_blockchail/RequestMessage", ctx => {
  // La interfaz se conecta al servicio que expone el cliente de blockchain
  post(`http://localhost:4000/saveAudit/`, xmlToJson(ctx.messageBody), {
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => console.log(response.data))
    .catch((err) => console.log("err", err));
  });
 
service1.start({ //default settings:
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})