const { TransactionProcessor } = require("sawtooth-sdk/processor");

const AuditHandler = require("./handler");
const transactionProcessor = new TransactionProcessor(`tcp://validator-${process.env.NODE}:4004`);

transactionProcessor.addHandler(new AuditHandler());
transactionProcessor.start();

console.log("Starting audit transaction processor");
console.log(`Connecting to Sawtooth validator at tcp://validator-${process.env.NODE}:4004`);
