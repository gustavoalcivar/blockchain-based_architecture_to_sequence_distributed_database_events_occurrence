let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const TxnFamilySetting = require('./txnFamilySetting')

/*
    Rule {
        // at this point two rule types are possible:
        //    0. for applying some predicate to an address slice
        //    1. to a specific data byte
        //RuleType: {
        //    ADDRESS_SLICE = 0,
        //    DATA_BYTE = 1
        //},
        type: RuleType.ADDRESS_SLICE,
        // there's the following settings used by one of the two predicates for type == 0
            // begin and end of the slice of address to which this rule should be applied to check if followed
            begin: 0,
            end: 6,
            // one of the following to fields should be present;
            // 1. first is for implying if the rule is followed by evaluating minMax[0] <= X && X < minMax[1]
            // of decimal number base64-encoded in this slice
            minMax: [0, 1],
            // 2. for second the check is (new Regex(regEx)).test(slicedPart)
            regEx: 'e9'
        // for type == 1 there's one possible predicate and its settings are:
            byteIndex: 1,
            minMax: [2, 3] // rule is only followed if second byte (index = 1) equals to 2 (2 <= b && b < 3).
            // using this kind of rule one could determine what enum is there for some field in protobuf
            // (knowing the byte-position of this enum and being sure it's always the same for any encoded message)
    }
*/

const Rule = new Schema({
    type: {
        type: Number,
        required: true
    }, // RuleType enum
    begin: Number,
    end: Number,
    minMax: [Number],
    regEx: String,
    byteIndex: Number,
})

let Message = new Schema({
    txnFamilyPrefix: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rules: {
        type: [Rule],
        default: [],
    },
    isTransactionPayload: {
        type: Boolean,
        default: false
    }
});

Message.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        ret.rules.forEach(rule => {
            delete rule.__v;
            delete rule._id;
        })
    },
})

Message = mongoose.model('Message', Message);

Message._create = messages => new Promise(resolve => {
    Message.create(messages, err => {
        if (err) {
            console.log("Err on creating message:", err);
            throw err
        }
        resolve()
    });
});

Message._remove = (query) => new Promise(resolve => {
    Message.remove(query, (err) => {
        if (err) {
            console.log(err)
            throw err
        }
        resolve()
    })
})

Message._getTxnFamilyPrefixToMessageNames = () => new Promise(resolve => {
    Message.find({}, (err, messages) => {
        if (err) {
            console.log(err)
            throw err
        }
        const txnFamilyPrefixToNames = {}
        messages.forEach(message => {
            txnFamilyPrefixToNames[message.txnFamilyPrefix] = txnFamilyPrefixToNames[message.txnFamilyPrefix] || []
            txnFamilyPrefixToNames[message.txnFamilyPrefix].push(message.name)
        })
        resolve(txnFamilyPrefixToNames)
    })
})

Message._getTxnFamilyPrefixToRulesConfig = () => new Promise(resolve => {
    Message.find({}, async (err, messages) => {
        if (err) {
            console.log(err)
            throw err
        }
        const txnFamilyPrefixToRulesConfig = {}
        await Promise.all(messages.map(async message => {
            message = message.toJSON()
            const txnFamilyPrefix = message.txnFamilyPrefix
            let rulesConfig = txnFamilyPrefixToRulesConfig[txnFamilyPrefix]
            if (!rulesConfig) {
                txnFamilyPrefixToRulesConfig[txnFamilyPrefix] = {
                    protoNameToRules: {},
                    transactionPayloadProtoName: null
                }
                rulesConfig = txnFamilyPrefixToRulesConfig[txnFamilyPrefix]
            }
            rulesConfig.protoNameToRules[message.name] = message.rules
            const txnFamilySetting = await TxnFamilySetting._getByPrefix(txnFamilyPrefix) || {}
            rulesConfig.txnPayloadEncodingType = txnFamilySetting.txnPayloadEncodingType
            rulesConfig.stateElementsEncodingType = txnFamilySetting.stateElementsEncodingType
            const isTxnPayloadProtoEncoded = txnFamilySetting.txnPayloadEncodingType == TxnFamilySetting._EncodingType.PROTO
            if (isTxnPayloadProtoEncoded && message.isTransactionPayload) {
                rulesConfig.transactionPayloadProtoName = message.name
            }
        }))
        resolve(txnFamilyPrefixToRulesConfig)
    })
})

Message._updateRules = ({
    txnFamilyPrefix,
    messageToRules,
    transactionPayloadProtoName
}) => new Promise(async resolve => {
    const updateParams = []
    let i = 0
    const allMessagesNames = []
    for (let message in messageToRules) {
        updateParams.push([{txnFamilyPrefix, name: message}, { $set: { rules: messageToRules[message] } }])
        allMessagesNames.push(message)
        console.log(messageToRules[message], updateParams[i++])
    }
    updateParams.push([{
        txnFamilyPrefix,
        name: { $nin: allMessagesNames },
        rules: { $ne: [] }
    }, {
        $set: { rules: [] }
    }, { multi: true }])
    updateParams.push([{
        txnFamilyPrefix,
        name: { $ne: transactionPayloadProtoName }
    }, {
        $set: { isTransactionPayload: false }
    }, { multi: true }])
    updateParams.push([{
        txnFamilyPrefix,
        name: transactionPayloadProtoName
    }, {
        $set: { isTransactionPayload: true } 
    }])
    await Promise.all(updateParams.map(upd => {
        return new Promise((resolve, reject) => {
            Message.update(...upd, err => {
                if (err)
                    reject(err)
                resolve()
            })
        })
    }))
    resolve()
})

module.exports = Message;
