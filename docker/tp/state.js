const { createHash } = require("crypto");

const _hash = (x) =>
  createHash("sha512").update(x).digest("hex").toLowerCase().substring(0, 64);

class AuditState {
  constructor(context) {
    this.context = context;
    this.timeout = 10000;
    this.stateEntries = {};
  }

  saveAudit(value) {
    const address = makeAddress(value);
    let stateEntriesSend = {};
    stateEntriesSend[address] = Buffer.from(`${value}`);
    return this.context
      .setState(stateEntriesSend, this.timeout)
      .then((result) => console.log("Success", result))
      .catch((error) => console.error("Error", error));
  }

}

const makeAddress = (x) =>
  _hash(process.env.TP_FAMILY).substring(0, 6) + _hash(x);

module.exports = AuditState;
