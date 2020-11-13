let mongoose = require('mongoose')
let Schema = mongoose.Schema

const defaultSettings = {
    isRegistrationPublic: true,
}

let Setting = new Schema({
    key: String,
    // value type may be changed to String if needed
    value: Boolean,
})

Setting = mongoose.model('Setting', Setting)

Setting._create = settings => new Promise(resolve => {
    Setting.create(settings, err => {
        if (err) {
            console.log("Err on creating settings:", err)
            throw err
        }
        resolve()
    })
})

Setting._upsert = function (setting) {
    return new Promise(resolve => {
        Setting.findOneAndUpdate({
            key: setting.key
        }, setting, { upsert: true }, err => {
            if (err) {
                console.log('Err on upserting setting:', err)
                return resolve({ok: false, message: 'unknown_error'})
            }
            return resolve({ok: true, message: 'setting_upserted_successfully'})
        })
    })
}

Setting._get = query => new Promise(resolve => {
    Setting.find(query, (err, settings) => {
        if (err) {
            console.log("Err on getting settings:", err)
            throw err
        }
        const settingsDict = {}
        settings.forEach(({key, value}) => settingsDict[key] = value) 
        resolve(settingsDict)
    })
})

Setting._getByKey = key => new Promise(resolve => {
    Setting.findOne({key}, (err, setting) => {
        if (err) {
            console.log("Err on getting setting by key:", err)
            throw err
        }
        if (!setting)
            return resolve(defaultSettings[key])
        resolve(setting.value)
    })
})

Setting._set = (key, value) => new Promise(async resolve => {
    const res = await Setting._upsert({key, value})
    resolve(res.ok ? {ok: true, message: 'modified_setting_successfully'} : res)
})

module.exports = Setting
