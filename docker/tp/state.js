const { createHash } = require("crypto");

const _hash = (x) =>
  createHash("sha512").update(x).digest("hex").toLowerCase().substring(0, 64);

class AuditState {
  constructor(context) {
    this.context = context;
    this.timeout = 500;
    this.stateEntries = {};
  }

  saveAudit(value) {
    const address = makeAddress(value);
    let stateEntriesSend = {};
    stateEntriesSend[address] = Buffer.from(`Data: ${value}`);
    return this.context
      .setState(stateEntriesSend, this.timeout)
      .then((result) => console.log("Success", result))
      .catch((error) => console.error("Error", error));
  }

  viewAudit(value) {
    let address = makeAddress(value);
    return this.context
      .getState([address], this.timeout)
      .then((stateEntries) => {
        Object.assign(this.stateEntries, stateEntries);
        console.log(this.stateEntries[address].toString());
        return this.stateEntries;
      })
      .bind(this);
  }
}

const makeAddress = (x) =>
  _hash(process.env.TP_FAMILY).substring(0, 6) + _hash(x);

module.exports = AuditState;
