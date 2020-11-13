const express  = require('express')
const router   = express.Router()
const jwt      = require('jsonwebtoken');
const passport = require('passport')
const { check, validationResult } = require('express-validator/check')

const User    = require('@root/models/user')
const Setting = require('@root/models/setting')
const config  = require('@root/config')
const { saltHashPassword } = require('@root/lib/common/hashing')
const { isAdmin } = require('@root/authentication')

router.post(['/register', '/login'], [
    check('username').exists(),
    check('password').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.post('/login', async function (req, res, next) {
    const {username, password} = req.body
    req.body.passHash = await User._login({username, password})
    req.body.password = null
    next()
})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                ok: false,
                message: info ? info.message : 'login_failed',
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET);
            return res.json({ok: true, token, username: user.username, isAdmin: user.isAdmin});
        });
    })(req, res);
})

router.post('/register', async function (req, res, next) {
    const isRegistrationPublic = await Setting._getByKey('isRegistrationPublic')
    if (isRegistrationPublic)
        return next()
    return isAdmin(req, res, next)
})

router.post('/register', async function(req, res, next) {
    const {username, password} = req.body
    await User._register({username, password})
    res.status(200).json({ok: true, message: 'registration_successful'})
})

module.exports = router