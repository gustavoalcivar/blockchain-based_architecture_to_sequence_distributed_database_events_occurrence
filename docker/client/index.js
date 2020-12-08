const {saveAudit, viewBlocks} = require("./server.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/saveAudit/", async (req, res) => {
  let data = await saveAudit(req.body);
  if (data.err) res.json(data);
  res.json({ status: data.statusText, link: data.data.link });
});

app.get("/blocks/", async (req, res) => {
  let data = await viewBlocks();
  if (data.err) res.json(data);
  res.json({ data: data.data.data });
});

app.listen(process.env.CLIENT_PORT, () =>
  console.log(`Listening port ${process.env.CLIENT_PORT}`)
);
