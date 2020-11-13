let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Signer = require('./signer')
const { deleteEmptyArrayFields } = require('@root/lib/common/formatting');

let Transaction = new Schema({
    id: String,
    num: Number,    
    blockId: String,
    batchId: String,
    payload: String,
    signerPublicKey: String,
    familyPrefix: String,
});

Transaction = mongoose.model('Transaction', Transaction);

Transaction._create = async (transactions, callback) => {
    const maxNumTransaction = await Transaction._getMaxNum();
    let curNum = 0
    if (maxNumTransaction)
        curNum = maxNumTransaction.num + 1
    transactions = transactions.map(txn => ({
        num: curNum++,
        ...txn
    }))
    Transaction.create(transactions, err => {
        if (err)
            console.log("Err on creating transactions:", err);
        if (callback)
            callback(err)
    });
};

Transaction._getMaxNum = () => new Promise(resolve => {
    Transaction
        .findOne({})
        .sort('-num')
        .exec(function (err, transaction) {
            if (err)
                console.log("Err on finding max num Transaction:", err)
            resolve(transaction)
        });
})

Transaction._get = function (params, callback) {
    Transaction.find(deleteEmptyArrayFields(params), function (err, transactions) {
        if (err)
            console.log("Err on getting from transactions:", err);
        callback(transactions);
    });
}

module.exports = Transaction;
