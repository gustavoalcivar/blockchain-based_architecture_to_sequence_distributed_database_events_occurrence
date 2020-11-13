let mongoose = require('mongoose')
let Schema = mongoose.Schema

const { deleteEmptyArrayFields } = require('@root/lib/common/formatting')

let StateElement = new Schema({
    num: Number,
    address: String,
    data: String,
    createdAt: Date,
    blockId: String
})

StateElement = mongoose.model('StateElement', StateElement)

StateElement._create = async (stateElements, callback) => {
    const maxNumStateEl = await StateElement._getMaxNum()
    let curNum = 0
    if (maxNumStateEl)
        curNum = maxNumStateEl.num + 1
    stateElements = stateElements.map(stateEl => ({
        num: curNum++,
        ...stateEl
    }))
    StateElement.create(stateElements, err => {
        if (err)
            console.log("Err on creating stateElements:", err)
        if (callback)
            callback(err)
    })
}

StateElement._getMaxNum = () => new Promise(resolve => {
    StateElement
        .findOne({})
        .sort('-num')
        .exec(function (err, stateElement) {
            if (err)
                console.log("Err on finding max num StateElement:", err)
            resolve(stateElement)
        })
})

StateElement._get = function (params, options) {
    return new Promise(resolve => {
        StateElement.find(deleteEmptyArrayFields(params || {}), null, options, function (err, stateElements) {
            if (err) {
                console.log("Err on getting from stateElements:", err)
                throw err
            }
            resolve(stateElements)
        })
    })
}

StateElement._getLatestOnAddress = (address, callback) => {
  StateElement
    .findOne({address})
    .sort('-createdAt')
    .exec(function (err, stateElement) {
        if (err)
            console.log(err)
        callback(stateElement)
    })
}

StateElement._getHistoryOfAddress = (address, callback) => {
    StateElement.find({address}, null, {sort: {createdAt: -1}}, function (err, stateElements) {
        if (err)
            console.log(err)
        callback(stateElements)
    })
}

module.exports = StateElement
