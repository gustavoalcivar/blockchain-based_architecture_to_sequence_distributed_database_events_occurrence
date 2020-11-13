let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const { deleteEmptyArrayFields } = require('@root/lib/common/formatting');

let Signer = new Schema({
    publicKey: {
        type: String,
        unique: true
    },
    label: {
        type: String,
        unique: true,
        sparse: true, // to be able to have multiple docs without a label (otherwise 'unique' causes error)
    },
    txnsAmount: {
        type: Number,
        default: 0,
    },
    blocksAmount: {
        type: Number,
        default: 0,
    }
});

Signer = mongoose.model('Signer', Signer);

Signer._create = (signer, callback) => {
    callback = callback || (() => {})
    Signer.create(signer, err => {
        if (err) {
            console.log('Err on creating signer:', err);
            if (err.code == 11000 && callback)
                return callback(false, 'has_signer_with_such_public_key_or_label')
            return callback(false, 'unknown_error')
        }
        callback(true, 'added_signer')
    });
};

Signer._upsert = function (signer, isTxnSigner, callback) {
    callback = callback || (() => {})
    const setQuery = { publicKey: signer.publicKey }
    if (signer.label)
        setQuery.label = signer.label
    const updateQuery = { $set: setQuery }
    if (typeof isTxnSigner === 'boolean')
        updateQuery['$inc'] = { [isTxnSigner ? 'txnsAmount' : 'blocksAmount']: 1 }
    Signer.findOneAndUpdate(
        { publicKey: signer.publicKey },
        updateQuery,
        { upsert: true },
        (err, docs) => {
            if (err) {
                console.log('Err on upserting signer:', err)
                return callback(false, 'unknown_error')
            }
            callback(true, 'updated_signer')
        }
    )
}

function upsertAll(signersConfig, callback) {
    if (signersConfig.length > 0) {
        let signerConfig = signersConfig.shift()
        Signer._upsert(signerConfig.doc, signerConfig.isTxnSigner, () => upsertAll(signersConfig, callback))
    } else if (callback) {
        return callback()
    }
}

Signer._upsertAll = upsertAll;

Signer._get = function (params, callback) {
    Signer.find(deleteEmptyArrayFields(params), function (err, signers) {
        if (err)
            console.log('Err on getting from signers:', err);
        callback(signers);
    });
}

Signer._getByPublicKey = (publicKey, callback) => {
    Signer.findOne({publicKey}, (err, signer) => {
        if (err)
            console.log('Err on finding signer by publicKey:', err);
        callback(signer);
    });
};

Signer._remove = (signers, callback) => {
    let query = {
        '$or': signers.map(signer => ({publicKey: signer.publicKey}))
    }
    Signer.remove(query, (err) => {
        if (err)
            console.log(err)
        if (callback)
            callback(err)
    })
}

module.exports = Signer;
