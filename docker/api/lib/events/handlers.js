const http = require('@root/lib/common/http')
const { decodeStateChangeList } = require('./encoding')
const { blockchain } = require('@root/config')
const { requestEventCatchUp } = require('./subscriber')
const notifyer = require('./notifyer')
const { familyNameToAddressPrefix } = require('@root/lib/common/hashing')

const Block = require('@root/models/block');
const Transaction = require('@root/models/transaction');
const StateElement = require('@root/models/stateElement');
const TxnFamily = require('@root/models/txnFamily');

/*
let lastBlocksTree = {}
let blockIdsTree = {}
let stateDeltas = {}

function removeBlockAndDescendantsExceptId (removedBlockId, id) {
  const removedBlock = lastBlocksTree[removedBlockId]
  delete lastBlocksTree[removedBlockId]
  blockIdsTree[removedBlockId].forEach(descendantBlockId => {
    if (descendantBlockId != id)
      removeBlockAndDescendantsExceptId(descendantBlockId, '')
  })
  return removedBlock
}

function addLeafBlockAndPopTopBlock (block) {
  const prevBlockId = block.previous_block_id
  lastBlocksTree[block.block_id] = block;
  if (!blockIdsTree[prevBlockId])
    blockIdsTree[prevBlockId] = []
  blockIdsTree[prevBlockId].push(block.block_id)

  const maxHeight = 5
  let currentBlock = block
  let expectedCurrentHeight = 0
  currentBlock.height = 0
  let visitedDescendantBlockId = ''
  while (currentBlock && (!currentBlock.height || currentBlock.height == expectedCurrentHeight)) {
    if (currentBlock.height == maxHeight) {
      return removeBlockAndDescendantsExceptId(currentBlock, visitedDescendantBlockId)
    }
    expectedCurrentHeight += 1
    visitedDescendantBlockId = currentBlock.block_id
    currentBlock = lastBlocksTree[block.previous_block_id]
  }
  return undefined
}

function saveStateDelta (blockchainId, stateDelta, correspondingBlockId) {
  const stateChangeList = decodeStateChangeList(stateDelta.data).stateChanges
  stateDeltas[correspondingBlockId] = stateChangeList.map(delta => {
    delta.value = decodeSingleStateElData({
      data: delta.value,
      address: delta.address
    })[0]
    return delta
  })
}

function handleBlockCommit (blockchainId, blockCommit) {
  let block = {}
  blockCommit.attributes.forEach(attr => {
    block[attr.key] = attr.value
  })
  const topBlock = addLeafBlockAndPopTopBlock(block)
  if (topBlock)
    applyDeltasToDB(blockchainId, stateDeltas[topBlock.block_id])
}*/

let stateElementsQueue = []
const blocksQueue = []
const isBlockFresh = {}

async function fetchInitialSettingsStateElementAndAddToQueue () {
  const stateElements = await StateElement._get()
  if (stateElements.length === 0) {
    const {ok, body: stateRes} = await http.get(`${blockchain.REST_API_URL}${blockchain.STATE_PATH}?address=000000`)
    if (!ok) return;
    const initialSettingsStateElement = JSON.parse(stateRes)["data"][0]
    stateElementsQueue.push({
      ...initialSettingsStateElement,
      createdAt: null,
      blockId: '0000000000000000'
    })
  }
}

function extractStateElementsAndAddToQueue (stateDelta, correspondingBlockId, isFresh) {
  const stateChangeList = decodeStateChangeList(stateDelta.data).stateChanges
  const stateElements = stateChangeList.map(delta => ({ // delta = {value: .., address: .., type: ...}
    address: delta.address,
    data: delta.type == 1 ? delta.value.toString('base64') : null,
    createdAt: isFresh ? new Date() : null,
    blockId: correspondingBlockId
  }))
  stateElementsQueue = stateElementsQueue.concat(stateElements)
}

async function processNextStateElementsBatch () {
  const stateElements = stateElementsQueue.slice()
  stateElementsQueue = []
  await Promise.all(stateElements.map(el => TxnFamily._upsert({
    addressPrefix: el.address.slice(0, 6)
  })))
  if (stateElements.length)
    StateElement._create(stateElements)
}

// it's a separate func bc it's used in handling POST on /blocks 
function transformBlockDataBeforeDB (blockData) {
  const transactions = []
  const block = {
    id: blockData["header_signature"],
    num: blockData["header"]["block_num"],
    stateHash: blockData["header"]["state_root_hash"],
    previousBlockId: blockData["header"]["previous_block_id"],
    signerPublicKey: blockData["header"]["signer_public_key"]
  }
  const familyNameToPrefix = {}
  blockData["batches"].forEach((batch) => {
    batch["transactions"].forEach((txn) => {
      const txnFamilyName = txn["header"]["family_name"]
      if (!familyNameToPrefix[txnFamilyName]) {
        if (txnFamilyName === 'sawtooth_settings')
          familyNameToPrefix[txnFamilyName] = '000000'
        else
          familyNameToPrefix[txnFamilyName] = familyNameToAddressPrefix(txnFamilyName)
      }
      transactions.push({
        id: txn["header_signature"],
        blockId: blockData["header_signature"],
        batchId: batch["header_signature"],
        payload: txn["payload"],
        signerPublicKey: txn["header"]["signer_public_key"],
        familyPrefix: familyNameToPrefix[txnFamilyName],
      })
    })
  })
  return { block, transactions }
}

function extractBlockAndAddToQueue (blockCommit, isFresh) {
  let block = {}
  blockCommit.attributes.forEach(attr => {
    block[attr.key] = attr.value
  })
  console.log('before handling', block['block_num'])
  isBlockFresh[block["block_id"]] = isFresh
  blocksQueue.push(block)
}

async function getAndHandleActualBlock (blockData, hasUnprocessedBlocks) {
  const maxNumberBlock = await Block._getWithMaxNumber()
  const receivedBlockFromDB = await Block._getById(blockData["block_id"])
  console.log('handling', blockData['block_num'])
  const receivedBlockIsSequent = maxNumberBlock && maxNumberBlock.id != blockData["previous_block_id"]
  if ((receivedBlockFromDB || receivedBlockIsSequent) && !hasUnprocessedBlocks) {
    console.log(`(receivedBlockFromDB || receivedBlockIsSequent) && !hasUnprocessedBlocks`)
    console.log(`(${receivedBlockFromDB} || ${receivedBlockIsSequent}) && !${hasUnprocessedBlocks}`)
    console.log('catching up on received block')
    return requestEventCatchUp([maxNumberBlock.id])
  }
  const url = blockchain.REST_API_URL + blockchain.BLOCKS_PATH + "/" + blockData["block_id"]
  const { ok, body: blockInfoJSON } = await http.get(url)
  if (!ok) return;
  const blockInfo = JSON.parse(blockInfoJSON)["data"]
  const { block, transactions } = transformBlockDataBeforeDB(blockInfo)
  Block._upsert(block, () => {
    Transaction._create(transactions.slice(), (errs) => {
      // errs: {txnId1: mongoErr1, ...}
      if (isBlockFresh[block["block_id"]])
        notifyer.notifyOn(transactions.filter(txn => !errs[txn.id]))
    })
  })
}

function processNextBlock () {
  const block = blocksQueue.shift()
  if (block)
    getAndHandleActualBlock(block, blocksQueue.length > 0)
}

setInterval(processNextStateElementsBatch, 300)
setInterval(processNextBlock, 300)

module.exports = {
  // stateDelta: saveStateDelta,
  // blockCommit: handleBlockCommit,
  stateDelta: extractStateElementsAndAddToQueue,
  blockCommit: extractBlockAndAddToQueue,
  transformBlockDataBeforeDB,
  fetchInitialSettingsStateElementAndAddToQueue,
}
