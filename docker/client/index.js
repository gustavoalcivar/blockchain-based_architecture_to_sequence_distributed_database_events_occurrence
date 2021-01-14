const {saveAudit, viewBlocks} = require("./server.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Allow', 'GET');
  next();
});

app.post("/saveAudit/", async (req, res) => {
  let data = await saveAudit(req.body);
  if (data.err) res.json(data);
  res.json({ status: data.statusText, link: data.data.link });
});

app.get("/blocks/", async (req, res) => {
  let data = await viewBlocks();
  if (data.err) res.json(data);
  let result = { blocks: [] };
  data.data.data.forEach(block0 => {
    let block = {
      block_num: block0.header.block_num,
      block_hash: block0.header_signature,
      previous_block_hash: block0.header.previous_block_id,
      batches: []
    };
    block0.batches.forEach(batch0 => {
      let batch = { transactions: [] };
      batch0.transactions.forEach(trx0 => {
        let trx = {
          id: trx0.header.payload_sha512,
          family_name: trx0.header.family_name,
          nonce: trx0.header.nonce,
          signer_public_key: trx0.header.signer_public_key
        };
        if(block.block_num !== "0")
          trx.payload = JSON.parse(Buffer.from(trx0.payload, "base64").toString("utf-8").substring(Buffer.from(trx0.payload, "base64").toString("utf-8").indexOf("{"), Buffer.from(trx0.payload, "base64").toString("utf-8").length));
        batch.transactions.push(trx);
      });
      block.batches.push(batch);
    });
    result.blocks.push(block);
  });
  res.json(result);
});

app.listen(process.env.CLIENT_PORT, () =>
  console.log(`Listening port ${process.env.CLIENT_PORT}`)
);
