let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const { deleteEmptyArrayFields } = require('@root/lib/common/formatting');

let TxnFamily = new Schema({
    addressPrefix: {
        type: String,
        unique: true,
    },
    label: {
        type: String,
        unique: true,
        sparse: true,
    }
});

TxnFamily = mongoose.model('TxnFamily', TxnFamily);

TxnFamily._create = (txnFamily, callback) => {
    TxnFamily.create(txnFamily, err => {
        if (err) {
            console.log("Err on creating txnFamily:", err);
            if (err.code == 11000 && callback)
                return callback(false, "has_transaction_family_with_such_prefix_or_label")
        }
        if (callback)
            callback(true, 'added_txn_family')
    });
};

TxnFamily._upsert = function (txnFamily) {
    return new Promise(resolve => {
        TxnFamily.findOneAndUpdate({
            addressPrefix: txnFamily.addressPrefix
        }, txnFamily, { upsert: true }, err => {
            if (err) {
                console.log('Err on upserting txnFamily:', err)
                return resolve({ok: false, message: 'unknown_error'})
            }
            return resolve({ok: true, message: 'updated_transaction_family'})
        })
    })
}

async function upsertAll(txnFamilies, callback) {
    if (txnFamilies.length > 0) {
        let txnFamily = txnFamilies.shift()
        await TxnFamily._upsert(txnFamily)
        upsertAll(txnFamilies, callback)
    } else if (callback) {
        return callback()
    }
}

TxnFamily._upsertAll = upsertAll;

TxnFamily._get = function (params, callback) {
    TxnFamily.find(deleteEmptyArrayFields(params), function (err, txnFamilies) {
        if (err)
            console.log("Err on getting from txnFamilies:", err);
        callback(txnFamilies);
    });
}

TxnFamily._getByAddressPrefix = (addressPrefix, callback) => {
    TxnFamily.findOne({addressPrefix}, (err, txnFamily) => {
        if (err)
            console.log('Err on finding txnFamily by addressPrefix:', err);
        callback(txnFamily);
    });
};

TxnFamily._remove = (txnFamilies, callback) => {
    let query = {
        '$or': txnFamilies.map(txnFamily => ({addressPrefix: txnFamily.addressPrefix}))
    }
    TxnFamily.remove(query, (err) => {
        if (err)
            console.log(err)
        if (callback)
            callback(err)
    })
}

module.exports = TxnFamily;
