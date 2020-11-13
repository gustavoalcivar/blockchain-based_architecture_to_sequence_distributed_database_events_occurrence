let express = require('express');
let router = express.Router();
const { check, validationResult } = require('express-validator/check')

const TxnFamily = require('@root/models/txnFamily')
const { isAdmin } = require('@root/authentication')

router.get('/', function(req, res, next) {
    const dbQuery = {}
    if (req.query.addressPrefixes) {
        const addressPrefixes = req.query.addressPrefixes.split(',')
        dbQuery["addressPrefix"] = {$in: addressPrefixes}
    }
    TxnFamily._get(dbQuery, txnFamilies => {
        res.send(txnFamilies)
    })
});

router.post(['/add', '/edit'], [
    check('addressPrefix').isLength({min: 6, max: 6}),
    check('label').exists()
], isAdmin, function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ ok: false, message: 'incorrect_data', errors: errors.array() });
    }
    next()
})

router.post('/add', function(req, res, next) {
    TxnFamily._create({
        addressPrefix: req.body.addressPrefix,
        label: req.body.label
    }, (ok, msg) => {
        res.status(ok ? 200 : 500).json({ ok, message: msg });
    })
});

router.post('/edit', async function(req, res, next) {
    const { ok, msg } = await TxnFamily._upsert({
        addressPrefix: req.body.addressPrefix,
        label: req.body.label
    })
    return res.status(ok ? 200 : 500).json({ ok, message: msg })
});

module.exports = router;
