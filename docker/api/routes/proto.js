const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
// const { check, validationResult } = require('express-validator/check')

const Message = require('@root/models/message')
const TxnFamilySettings = require('@root/models/txnFamilySetting')
const { isAdmin } = require('@root/authentication')
const { saveAndReloadProtos, getProtoDirStructure, protosDirectoryPath, getJSONDescriptor } = require('@root/lib/proto_processor')

router.get('/', async function(req, res, next) {
    const txnFamilyPrefixToFileNames = await getProtoDirStructure(protosDirectoryPath)
    const descriptorJSON = await getJSONDescriptor()
    const txnFamilyPrefixToRulesConfig = await Message._getTxnFamilyPrefixToRulesConfig()
    const txnFamilySettings = await TxnFamilySettings._get()
    const txnFamilyPrefixToSettings = {}
    txnFamilySettings.forEach(setting => {
        const { txnPayloadEncodingType, stateElementsEncodingType } = setting
        txnFamilyPrefixToSettings[setting.txnFamilyPrefix] = {
            txnPayloadEncodingType,
            stateElementsEncodingType
        }
    })
    res.status(200).json({
        descriptor: descriptorJSON,
        txnFamilyPrefixToFileNames,
        txnFamilyPrefixToRulesConfig,
        txnFamilyPrefixToSettings,
    })
})

router.get('/messages', async function(req, res, next) {
    const txnFamilyPrefixToMessageNames = await Message._getTxnFamilyPrefixToMessageNames()
    res.status(200).json(txnFamilyPrefixToMessageNames)
})

router.use([isAdmin, fileUpload()])

router.post('/', async function(req, res, next) {
    const txnFamilyPrefix = req.body.txnFamilyPrefix
    if (!req.files)
        return res.status(400).json({ok: false, message: 'no_files_received'})
    const files = Object.values(req.files)
                        .filter(file => file.name.endsWith('.proto'))
    // saveAndReloadProtos saves them as files and generates and writes new JSON descriptor
    // and also fills it's scope's variable txnFamilyPrefixToProtos and returns it
    let protoMessages
    try {
        const txnFamilyPrefixToProtos = await saveAndReloadProtos({txnFamilyPrefix, files})
        protoMessages = Object.keys(txnFamilyPrefixToProtos[txnFamilyPrefix])
    } catch (error) {
        return next(error)
    }
    const messages = protoMessages.map(protoName => ({
        name: protoName,
        txnFamilyPrefix,
    }))
    // rewrite Messages data to db
    try {
        await Promise.all([
            Message._remove({txnFamilyPrefix}).catch(err => next(err)),
            Message._create(messages).catch(err => next(err))
        ])
    } catch (error) {
        return next(error)
    }
    res.status(200).json({ok: true, message: 'protos_uploaded_and_processed_successfully'})
})

router.post('/messages', async function(req, res, next) {
    const {
        txnFamilyPrefix,
        txnPayloadEncodingType,
        transactionPayloadProtoName,
        stateElementsEncodingType,
        messages,
    } = req.body
    await TxnFamilySettings._upsert({txnFamilyPrefix, txnPayloadEncodingType, stateElementsEncodingType})
    await Message._updateRules({txnFamilyPrefix, messageToRules: messages, transactionPayloadProtoName})
    res.status(200).json({ok: true, message: 'updated_rules_successfully'})
})

module.exports = router
