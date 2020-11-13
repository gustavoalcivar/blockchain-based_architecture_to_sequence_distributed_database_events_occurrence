let mongoose = require('mongoose')
let Schema = mongoose.Schema

const EncodingType = {
    NONE: 'NONE',
    PROTO: 'PROTO',
    CBOR: 'CBOR',
}

const encodingTypes = Object.keys(EncodingType)

let TxnFamilySetting = new Schema({
    txnFamilyPrefix: String,
    txnPayloadEncodingType: {
        type: String,
        enum: encodingTypes,
        default: EncodingType.NONE
    },
    stateElementsEncodingType: {
        type: String,
        enum: encodingTypes,
        default: EncodingType.NONE
    },
})

TxnFamilySetting.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
    },
})

TxnFamilySetting = mongoose.model('TxnFamilySetting', TxnFamilySetting)

TxnFamilySetting._EncodingType = EncodingType

TxnFamilySetting._create = txnFamiliesSettings => new Promise(resolve => {
    TxnFamilySetting.create(txnFamiliesSettings, err => {
        if (err) {
            console.log("Err on creating txnFamiliesSettings:", err)
            throw err
        }
        resolve()
    })
})

TxnFamilySetting._upsert = txnFamiliySetting => new Promise(resolve => {
    TxnFamilySetting.update(
        {txnFamilyPrefix: txnFamiliySetting.txnFamilyPrefix},
        txnFamiliySetting,
        {upsert: true},
        err => {
            if (err) {
                console.log("Err on upserting txnFamilySetting:", err)
                throw err
            }
            resolve()
        }
    )
})

TxnFamilySetting._get = query => new Promise(resolve => {
    TxnFamilySetting.find(query, (err, txnFamilySettings) => {
        if (err) {
            console.log("Err on finding txnFamilySettings:", err)
            throw err
        }
        resolve(txnFamilySettings)
    })
})

TxnFamilySetting._getByPrefix = txnFamilyPrefix => new Promise(resolve => {
    TxnFamilySetting.findOne({txnFamilyPrefix}, (err, txnFamilySetting) => {
        if (err) {
            console.log("Err on finding txnFamilySetting by prefix:", err)
            throw err
        }
        resolve(txnFamilySetting)
    })
})

module.exports = TxnFamilySetting
