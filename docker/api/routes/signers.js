let express = require('express');
let router = express.Router();
const { check, validationResult } = require('express-validator/check')

let Signer = require('@root/models/signer')
const { isAdmin } = require('@root/authentication')

router.get('/', function(req, res, next) {
  const dbQuery = {}
  if (req.query.publicKeys) {
      const publicKeys = req.query.publicKeys.split(',')
      dbQuery["publicKey"] = {$in: publicKeys}
  }
  Signer._get(dbQuery, signers => {
      res.send(signers)
  })
});

router.post(['/add', '/edit'], [
  check('publicKey').isLength({min: 66, max: 66}),
  check('label').exists()
], isAdmin, function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, message: 'incorrect_data', errors: errors.array() });
  }
  next()
})

router.post('/add', function(req, res, next) {
  Signer._create({
    publicKey: req.body.publicKey,
    label: req.body.label
  }, (ok, msg) => {
    return res.status(ok ? 200 : 500).json({ ok, message: msg })
  })
});

router.post('/edit', function(req, res, next) {
  Signer._upsert({
    publicKey: req.body.publicKey,
    label: req.body.label
  }, null, (ok, msg) => {
    return res.status(ok ? 200 : 500).json({ ok, message: msg })
  })
});

module.exports = router;
