let mongoose = require('mongoose')
let Schema = mongoose.Schema

const DetailsField = new Schema({
    label: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    pathHash: {
        type: String,
        required: true,
    },
})

let CustomMenuItem = new Schema({
    id: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    protoMessage: {
        type: String,
        required: true,
    },
    tileLabelPath: {
        type: String,
        default: null,
    },
    tileAvatarPath: {
        type: String,
        default: null,
    },
    detailsFields: {
        type: [DetailsField],
        default: null,
    },
})

CustomMenuItem = mongoose.model('CustomMenuItem', CustomMenuItem)

CustomMenuItem._get = (query) => new Promise(resolve => {
    CustomMenuItem.find(query, (err, customMenuItems) => {
        if (err) {
            console.log(err)
            throw err
        }
        resolve(customMenuItems)
    })
})

CustomMenuItem._remove = (query) => new Promise(resolve => {
    CustomMenuItem.remove(query, (err) => {
        if (err) {
            console.log(err)
            throw err
        }
        resolve()
    })
})

CustomMenuItem._upsert = customMenuItem => new Promise(resolve => {
    CustomMenuItem.findOneAndUpdate({
        id: customMenuItem.id
    }, customMenuItem, { upsert: true }, err => {
        if (err) {
            console.log('Err on upserting customMenuItem:', err)
            return resolve({ok: false, message: 'unknown_error'})
        }
        return resolve({ok: true, message: 'upserted_custom_menu_item'})
    })
})

module.exports = CustomMenuItem
