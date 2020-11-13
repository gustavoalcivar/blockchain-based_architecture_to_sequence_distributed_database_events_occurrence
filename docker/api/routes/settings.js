const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const { isAdmin } = require('@root/authentication')
const Setting = require('@root/models/setting')

router.use(isAdmin)

router.get('/', async function (req, res, next) {
    const settings = await Setting._get({})
    res.status(200).json(settings)
})

router.post('/set', [
    check('key').exists(),
    check('key').isString(),
    check('value').exists(),
    check('value').isBoolean(),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.post('/set', async function (req, res, next) {
    const { key, value } = req.body
    const result = await Setting._set(key, value)
    if (!result.ok)
        throw new Error(result.message)
    res.status(200).json(result)
})

module.exports = router