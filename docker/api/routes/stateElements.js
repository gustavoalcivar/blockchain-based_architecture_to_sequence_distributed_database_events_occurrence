let express = require('express');
let router = express.Router();
let StateElement = require('@root/models/stateElement')

router.get('/', async function(req, res, next) {
    const dbQuery = {}
    const options = {}
    if (req.query.addresses) {
        const prefixes = req.query.addresses.split(',')
        dbQuery["address"] = {$in: prefixes.map(pref => new RegExp('^' + pref, 'i'))}
    }
    if (req.query.blockIds) {
        const blockIds = req.query.blockIds.split(',')
        dbQuery["blockId"] = {$in: blockIds}
    }
	if (req.query.since) {
        dbQuery["$and"] = []
        const sinceDate = new Date(parseInt(req.query.since));
		dbQuery["$and"].push({createdAt: {$gte: sinceDate}}) 
	}
	if (req.query.isChronologicalOrder == 1) {
        dbQuery["$and"] = dbQuery["$and"] || []
        dbQuery["$and"].push({createdAt: {$ne: null}})  
        options.sort = {createdAt: 1}
	}
    const stateElements = await StateElement._get(dbQuery, options)
    res.send(stateElements)
});

module.exports = router;
