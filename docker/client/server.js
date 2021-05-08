const { createContext, CryptoFactory } = require("sawtooth-sdk/signing");
const { encode } = require("cbor");
const { protobuf } = require("sawtooth-sdk");
const { createHash } = require("crypto");
const fetch = require("node-fetch");

const context = createContext("secp256k1");
const privateKey = context.newRandomPrivateKey();
const signer = new CryptoFactory(context).newSigner(privateKey);

const _hash = (x) =>
  createHash("sha512").update(x).digest("hex").toLowerCase().substring(0, 64);

const sendRequest = async payload => {
  const payloadBytes = encode(JSON.stringify(payload));
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: process.env.TP_FAMILY,
    familyVersion: process.env.TP_VERSION,
    inputs: [_hash(process.env.TP_FAMILY).substring(0, 6)],
    outputs: [_hash(process.env.TP_FAMILY).substring(0, 6)],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash("sha512").update(payloadBytes).digest("hex"),
    nonce: new Date().toString(),
  }).finish();

  const signature = signer.sign(transactionHeaderBytes);

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes,
  });

  const transactions = [transaction];

  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();

  headerSignature = signer.sign(batchHeaderBytes);

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: headerSignature,
    transactions: transactions,
  });

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch],
  }).finish();

  let data;
  do {
    const res = await fetch(`http://rest-api-${process.env.NODE}:8008/batches`, {
      method: "post",
      body: batchListBytes,
      headers: { "Content-Type": "application/octet-stream" }
    });
    data = await res.json();
  } while(data.error != undefined);
  return data;
}

const saveAudit = async data => {
  return await sendRequest(data);
};

const viewBlocks = async (head) => {
  const res = await fetch(`http://rest-api-${process.env.NODE}:8008/blocks?limit=10${head ? '&head=' + head : ''}`);
  return await res.json();
}

module.exports = {saveAudit, viewBlocks};
