const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const User = require('@root/models/user')
const { isAdmin } = require('@root/authentication')

router.use(['/'], isAdmin)

router.get('/', async function (req, res, next) {
    const users = await User._getCut({})
    res.status(200).json(users)
})

router.post('/edit', [
    check('id').exists().isNumeric(),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.post('/edit', async function(req, res, next) {
    const result = await User._update(req.body)
    res.status(result.ok ? 200 : 400).json(result)
});

router.post('/add', [
    check('username').exists().isString(),
    check('password').exists().isString(),
    check('isAdmin').optional().isBoolean(),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.post('/add', async function(req, res, next) {
    const {username, password, isAdmin} = req.body
    const userData = {username, password}
    if (isAdmin != null)
        userData.isAdmin = isAdmin
    await User._register(userData)
    res.status(200).json({ok: true, message: 'added_account'})
});

module.exports = router
