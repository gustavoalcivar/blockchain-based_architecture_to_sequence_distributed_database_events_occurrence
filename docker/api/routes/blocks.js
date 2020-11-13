const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')

const Block = require('@root/models/block')
const Transaction = require('@root/models/transaction')

router.get('/', [
    check('recentN').optional().isInt(),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.get('/', function(req, res, next) {
    req._dbQuery = {$and: []}
    if (req.query.ids) {
        const ids = req.query.ids.split(',')
        req._dbQuery["$and"].push({id: {$in: ids}})
    }
    if (req.query.signers) {
        const signers = req.query.signers.split(',')
        req._dbQuery["$and"].push({signerPublicKey: {$in: signers}})
    }
    if (req.query.txnIds) {
        const txnIds = req.query.txnIds.split(',')
        Transaction._get({id: {$in: txnIds}}, txns => {
            const txnsBlockIds = txns.map(txn => txn.blockId)
            req._dbQuery["$and"].push({id: {$in: txnsBlockIds}})
            next()
        })
    } else {
        next()
    }
})

router.get('/', async function(req, res, next) {
    if (req.query.recentN) {
        const amountOfBlocks = parseInt(req.query.recentN)
        const maxNumBlock = await Block._getWithMaxNumber()
        req._dbQuery["num"] = {$gt: maxNumBlock.num - amountOfBlocks}
        next()
    } else {
        next()
    }
})

router.get('/', function(req, res, next) {
    Block._get(req._dbQuery, blocks => {
        res.send(blocks)
    })
})


module.exports = router;
