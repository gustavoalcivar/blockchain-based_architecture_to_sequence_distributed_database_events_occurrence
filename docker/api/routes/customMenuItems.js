const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const CustomMenuItem = require('@root/models/customMenuItems')
const { isAdmin } = require('@root/authentication')

router.use(isAdmin)

router.get('/', async function(req, res, next) {
    const customMenuItems = await CustomMenuItem._get({})
    res.status(200).json(customMenuItems)
})

router.post('/set', [
    check('id').exists().isInt(),
    check([
        'label',
        'protoMessage',
        'tileAvatarPath',
        'tileLabelPath'
    ]).exists().isString(),
    check('detailsFields').exists().isArray(),
    check([
        'detailsFields[*].label',
        'detailsFields[*].path',
        'detailsFields[*].pathHash',
    ]).exists().isString(),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        const firstErr = errors.array()[0]
        return next(Error(firstErr.msg))
    }
    next()
})

router.post('/set', async function(req, res, next) {
    const {ok, message} = await CustomMenuItem._upsert(req.body)
    return res.status(ok ? 200 : 500).json({ok, message})
})

module.exports = router
