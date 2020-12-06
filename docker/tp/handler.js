const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InternalError } = require("sawtooth-sdk/processor/exceptions");
const { decode } = require("cbor");
const AuditState = require("./state");
const { createHash } = require("crypto");

const _hash = (x) =>
  createHash("sha512").update(x).digest("hex").toLowerCase().substring(0, 64);

class AuditHandler extends TransactionHandler {
  constructor() {
    super(
      process.env.TP_FAMILY,
      [process.env.TP_VERSION],
      [_hash(process.env.TP_FAMILY).substring(0, 6)]
    );
  }

  apply(transactionProcessRequest, context) {
    let payload = decode(transactionProcessRequest.payload);
    //console.log("payload", JSON.parse(payload));
    let auditState = new AuditState(context);
    try {
      if(payload.type === 'save')
        return auditState.saveAudit(payload.data);
      else
        return auditState.viewAudit(payload.data);
    } catch (error) {
      console.log("ERROR", error);
      throw new InternalError();
    }
  }
}

module.exports = AuditHandler;
