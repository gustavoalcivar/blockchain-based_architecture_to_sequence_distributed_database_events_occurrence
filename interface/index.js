const { post } = require("axios");
const os = require("os");
const unixTime = require("unix-time");
const node_ip = "192.168.100.200"

let input = process.argv.slice(2).join(" ");

const isJson = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

if (input.trim() !== "{}" && isJson(input)) {
  let jsonInput = JSON.parse(input);
  let today = new Date();
  jsonInput.metadata.host = os.hostname();
  jsonInput.metadata.datetime = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "00")}-${today.getDate().toString().padStart(2, "00")} ${today.getHours().toString().padStart(2, "00")}:${today.getMinutes().toString().padStart(2, "00")}:${today.getSeconds().toString().padStart(2, "00")}.${today.getMilliseconds().toString().padStart(3, "000")}`;
  jsonInput.metadata.unixDatetime = unixTime(new Date()).toString();
  // La interfaz se conecta al servicio que expone el cliente de blockchain (este cliente se encuentra en el nodo0)
  post(`http://${node_ip}:${process.env.PORT || 4000}/saveAudit/`, jsonInput, {
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => console.log(response.data))
    .catch((err) => console.log("err", err));
} else console.log("ERROR: Invalid data", input);
