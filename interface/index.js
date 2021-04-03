const Sqlssb = require("sqlssb");
const { post } = require("axios");
const { xmlToJson } = require("./functions");
const { hostname } = require("os");
const unixTime = require("unix-time");

const service1 = new Sqlssb({
  user: process.env.DATABASE_USER || "user",
  password: process.env.DATABASE_PASSWORD || "password",
  server: process.env.DATABASE_SERVER || "localhost",
  database: process.env.DATABASE_NAME || "database",
  service: "TargetService",
  queue: "TargetQueue"
})

service1.on("http://audit_blockchail/RequestMessage", ctx => {
  let json = xmlToJson(ctx.messageBody);
  let today = new Date();
  json.host = hostname();
  json.datetime = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "00")}-${today.getDate().toString().padStart(2, "00")} ${today.getHours().toString().padStart(2, "00")}:${today.getMinutes().toString().padStart(2, "00")}:${today.getSeconds().toString().padStart(2, "00")}.${today.getMilliseconds().toString().padStart(3, "000")}`;
  json.unixDatetime = unixTime(new Date()).toString();
  // La interfaz se conecta al servicio que expone el cliente de blockchain
  post(`http://localhost:4000/saveAudit/`, json, {
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => console.log(response.data))
    .catch((err) => console.log("err", err));
  });
 
service1.start({ //default settings:
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})