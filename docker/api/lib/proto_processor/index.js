'use strict'

const path = require('path')
const fs = require('fs')
const protobuf = require('protobufjs')

const protosDirectoryPath = path.join(__dirname, './protos')
const protosJSONDescriptorPath = path.join(__dirname, './descriptor.json')
/* const protosDirectoryPath = './protos'
const protosJSONDescriptorPath = './descriptor.json'
 */

let txnFamilyPrefixToProtos = {}

function getProtoDirStructure (dirPath) {
  return new Promise(async resolve => {
    let files;
    try {
      files = fs.readdirSync(dirPath, { withFileTypes: true })      
    } catch (error) {
      if (error.code === 'ENOENT')
        console.log(`${dirPath} does not exist`)
      else
        console.log({error})
    }
    if (!files)
      return resolve({})
    const dirToFileNamesList = await Promise.all(
      files
        .filter(file => file.isDirectory())
        .map(dir => new Promise((resolve, reject) => {
          fs.readdir(path.join(dirPath, dir.name), function (err, dirFileNames) {
            if (err)
              return reject(err)
            resolve({dirName: dir.name, fileNames: dirFileNames})
          })
        }))
    )
    const dirStructure = {}
    dirToFileNamesList.forEach(({dirName, fileNames}) => dirStructure[dirName] = fileNames)
    resolve(dirStructure)
  })
}

async function loadProtos () {
  // loads .proto fields from all files from dirs in $protosDirectoryPath
  // to $txnFamilyPrefixToProtos dict and writes to $protosJSONDescriptorPath
  const protosTxnFamilyPrefixToFileNames = await getProtoDirStructure(protosDirectoryPath)
  if (!Object.keys(protosTxnFamilyPrefixToFileNames).length)
    return
  const allProtos = {}
  txnFamilyPrefixToProtos = {}
  for (let txnFamilyPrefix in protosTxnFamilyPrefixToFileNames) {
    txnFamilyPrefixToProtos[txnFamilyPrefix] = txnFamilyPrefixToProtos[txnFamilyPrefix] || {}
    const protos = txnFamilyPrefixToProtos[txnFamilyPrefix]
    await Promise.all(protosTxnFamilyPrefixToFileNames[txnFamilyPrefix].map(async fileName => {
      const protoPath = path.join(protosDirectoryPath, txnFamilyPrefix, fileName)
      const root = await protobuf.load(protoPath)
      // all proto-messages' names loaded as $root
      const protoNames = Object.keys(root.nested)
      protoNames.forEach(name => {
        protos[name] = root.lookupType(name).toJSON()
        allProtos[name] = protos[name]
      })
    }))
  }
  // prepare&write json descriptor file
  fs.writeFile(protosJSONDescriptorPath, JSON.stringify({nested: allProtos}), function (err) {
    if (err) console.log(err)
    else console.log("Successfully written protobufs' JSON descriptor.")
  })
  return txnFamilyPrefixToProtos
}

async function saveAndReloadProtos ({files, txnFamilyPrefix}) {
  await clearDir(path.join(protosDirectoryPath, txnFamilyPrefix))
  // mapping files to Promises about their writing to dir and waiting for all of them
  await Promise.all(files.map(file => {
    return new Promise(resolve => {
      fs.writeFile(path.join(protosDirectoryPath, txnFamilyPrefix, file.name), file.data, null, async err => {
        if (err) {
          console.log(err)
          throw err
        }
        resolve()
      })
    })
  }))
  return loadProtos()
}

async function clearDir (path) {
  return new Promise(async resolve => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') { // if no such dir
          fs.mkdirSync(path)
          return resolve()
        } else {
          throw err
        }
      }
      await Promise.all(files.map(file =>
        new Promise(resolve => {
          fs.unlink(`${path}/${file}`, err => {
            if (err) throw err
            resolve()
          })
        })
      ))
      resolve()
    })
  })
}

async function getJSONDescriptor () {
  return new Promise(resolve => {
    fs.readFile(protosJSONDescriptorPath, (err, file) => {
      if (err) {
        if (err.code === 'ENOENT')
          return resolve({ nested: {} })
        else
          throw err
      }
      resolve(JSON.parse(file))
    })
  })
}

module.exports = { saveAndReloadProtos,
                   getProtoDirStructure,
                   protosDirectoryPath,
                   getJSONDescriptor, }
