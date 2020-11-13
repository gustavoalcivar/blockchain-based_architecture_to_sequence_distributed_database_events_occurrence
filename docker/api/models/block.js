let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Signer = require('./signer')
const { deleteEmptyArrayFields } = require('@root/lib/common/formatting');

let Block = new Schema({
  id: String,
  num: Number,
  stateHash: String,
  previousBlockId: String,
  signerPublicKey: String,
});

Block = mongoose.model('Block', Block);

Block._create = (block, callback) => {
    Block.create(block, err => {
      if (err)
        console.log("Err on creating block:", err);
      if (callback)
        callback(err)
    });
};

Block._upsert = function (block, callback) {
    Block.findOneAndUpdate({
      id: block.id
    }, block, { upsert: true }, (err, doc) => {
      Signer._upsert({publicKey: block.signerPublicKey}, false, () => callback(err, doc))    
    })
}

function upsertAll(blocks, callback) {
  if (blocks.length > 0) {
    let block = blocks.shift()
    Block._upsert(block, (err, doc) => upsertAll(blocks, callback))
  } else if (callback) {
    return callback()
  }
}

Block._upsertAll = upsertAll;

Block._get = function (params, callback) {
  Block.find(deleteEmptyArrayFields(params), function (err, blocks) {
    if (err)
      console.log("Err on getting from blocks:", err);
    callback(blocks);
  });
}

Block._getById = id => new Promise(resolve => {
  Block.findOne({id}, (err, block) => {
    if (err)
      console.log('Err on finding block by id:', err);
    resolve(block);
  });
});

Block._getByNumber = (num, callback) => {
  Block.findOne({num}, (err, block) => {
    if (err)
      console.log('Err on finding block by number:', err);
    callback(block);
  });
};

Block._remove = (blocks, callback) => {
  let query = {
    '$or': blocks.map(block => ({id: block.id}))
  }
  Block.remove(query, (err) => {
    if (err)
      console.log(err)
    if (callback)
      callback()
  })
}

Block._getWithMaxNumber = () => new Promise(resolve => {
  Block
    .findOne({})
    .sort('-num')
    .exec(function (err, block) {
      if (err)
        console.log(err)
      resolve(block)
    })
})

Block._getAscSortedByNumber = (callback) => {
  Block.find({}, null, {sort: {num: -1}}, function (err, blocks) {
    if (err)
      console.log(err)
    callback(blocks)
  })
}

module.exports = Block;
