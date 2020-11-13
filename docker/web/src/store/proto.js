import Vue from 'vue'
import protobufjs from 'protobufjs'
import cbor from 'cbor'

import http from '@/lib/http'
import {
    LOAD,
    UPLOAD,
    DECODE,
    MAP_TO_PROTO_NAMES,
    LOGOUT,
    SNACKBAR,
    SAVE_RULES,
    PROTO_TO_DECODER,
    TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES,
    TXN_FAMILY_PREFIX_TO_RULES_CONFIG,
    TXN_FAMILY_PREFIX_TO_FILE_NAMES,
    TRANSACTIONS_NAMESPACE,
    STATE_ELEMENTS_NAMESPACE,
    ENCODING_TYPES,
    TXN_FAMILY_PREFIX_TO_SETTING,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

const RuleTypes = {
    ADDRESS_SLICE: 0,
    DATA_BYTE: 1,
}

export default {
    namespaced: true,
    state: {
        [PROTO_TO_DECODER]: null,
        [TXN_FAMILY_PREFIX_TO_SETTING]: getLSItemSafe(TXN_FAMILY_PREFIX_TO_SETTING, {}),
        [TXN_FAMILY_PREFIX_TO_FILE_NAMES]: getLSItemSafe(TXN_FAMILY_PREFIX_TO_FILE_NAMES, {}),
        [TXN_FAMILY_PREFIX_TO_RULES_CONFIG]: getLSItemSafe(TXN_FAMILY_PREFIX_TO_RULES_CONFIG, {}),
        [TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES]: getLSItemSafe(TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES, []),
    },
    getters: {
        [PROTO_TO_DECODER]: state => state[PROTO_TO_DECODER],
        [TXN_FAMILY_PREFIX_TO_SETTING]: state => state[TXN_FAMILY_PREFIX_TO_SETTING],
        [TXN_FAMILY_PREFIX_TO_FILE_NAMES]: state => state[TXN_FAMILY_PREFIX_TO_FILE_NAMES],
        [TXN_FAMILY_PREFIX_TO_RULES_CONFIG]: state => state[TXN_FAMILY_PREFIX_TO_RULES_CONFIG],
        [TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES]: state => state[TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES],
    },
    mutations: {
        [LOAD]: (state, data) => {
            state[PROTO_TO_DECODER] = data[PROTO_TO_DECODER]
            state[TXN_FAMILY_PREFIX_TO_SETTING] = data[TXN_FAMILY_PREFIX_TO_SETTING]
            state[TXN_FAMILY_PREFIX_TO_FILE_NAMES] = data[TXN_FAMILY_PREFIX_TO_FILE_NAMES]
            state[TXN_FAMILY_PREFIX_TO_RULES_CONFIG] = data[TXN_FAMILY_PREFIX_TO_RULES_CONFIG]
            state[TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES] = data[TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES]
        },
        [LOGOUT]: (state) => {
            state[PROTO_TO_DECODER] = null
            state[TXN_FAMILY_PREFIX_TO_SETTING] = null
            state[TXN_FAMILY_PREFIX_TO_FILE_NAMES] = null
            state[TXN_FAMILY_PREFIX_TO_RULES_CONFIG] = null
            state[TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES] = null
        },
    },
    actions: {
        [UPLOAD]: ({dispatch}, {files, txnFamilyPrefix}) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('txnFamilyPrefix', txnFamilyPrefix)
                for (let i = 0; i != files.length; i++) {
                    formData.append(`files[${i}]`, files[i])
                }
                http.post('/proto', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(async resp => {
                    EventBus.$emit(SNACKBAR, resp.data)
                    await dispatch(LOAD)
                    resolve(resp)  
                }).catch(err => {
                    reject(err)
                })
            })
        },
        [SAVE_RULES]: ({dispatch}, {
            txnFamilyPrefix,
            rules,
            transactionPayloadProtoName,
            txnPayloadEncodingType,
            stateElementsEncodingType,
        }) => {
            return new Promise(async (resolve, reject) => {
                const messages = {}
                rules.forEach(rule => {
                    const protoName = rule.protoName
                    delete rule.protoName
                    messages[protoName] = messages[protoName] || []
                    messages[protoName].push(rule)
                })
                const res = await http.post('/proto/messages', {
                    txnFamilyPrefix,
                    messages,
                    transactionPayloadProtoName,
                    txnPayloadEncodingType,
                    stateElementsEncodingType,
                })
                EventBus.$emit(SNACKBAR, res.data)
                await dispatch(LOAD)
                resolve(res)
            })
        },
        [LOAD]: ({commit, dispatch}) => {
            return new Promise(async (resolve, reject) => {
                const protosRes = await http({ url: '/proto', method: 'GET' })
                const {
                    descriptor,
                    txnFamilyPrefixToSettings,
                    txnFamilyPrefixToFileNames,
                    txnFamilyPrefixToRulesConfig,
                } = protosRes.data
                const messagesRes = await http({ url: '/proto/messages', method: 'GET' })
                const txnFamilyPrefixToProtoMessages = messagesRes.data
                Vue.storage.set(TXN_FAMILY_PREFIX_TO_SETTING, JSON.stringify(txnFamilyPrefixToSettings))
                Vue.storage.set(TXN_FAMILY_PREFIX_TO_FILE_NAMES, JSON.stringify(txnFamilyPrefixToFileNames))
                Vue.storage.set(TXN_FAMILY_PREFIX_TO_RULES_CONFIG, JSON.stringify(txnFamilyPrefixToRulesConfig))
                Vue.storage.set(TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES, JSON.stringify(txnFamilyPrefixToProtoMessages))
                const protoFromJSON = protobufjs.Root.fromJSON(descriptor)
                const protoToDecoder = {}
                Object.keys(descriptor.nested).forEach(protoName => {
                    if (protoFromJSON[protoName])
                        protoToDecoder[protoName] = protoFromJSON[protoName]
                })
                const res = {
                    protoToDecoder,
                    txnFamilyPrefixToSettings,
                    txnFamilyPrefixToFileNames,
                    txnFamilyPrefixToRulesConfig,
                    txnFamilyPrefixToProtoMessages,
                }
                commit(LOAD, res)
                await Promise.all([
                    dispatch(TRANSACTIONS_NAMESPACE + LOAD, null, { root: true }),
                    dispatch(STATE_ELEMENTS_NAMESPACE + LOAD, null, { root: true })
                ])
                resolve(res)
            })
        },
        [DECODE]: ({getters}, {isTransaction, entities}) => {
            return new Promise(resolve => {
                const { protoToDecoder,
                        txnFamilyPrefixToRulesConfig,
                        txnFamilyPrefixToSettings } = getters
                if (!Array.isArray(entities))
                    entities = [entities]
                let decodedEntitiesAmount = 0
                const decodedEntities = entities.map(entity => {
                    let familyPrefix = entity.familyPrefix
                    let entityDecodedField = "payloadDecoded"
                    let entityEncodedField = "payload"
                    if (!isTransaction) {
                        familyPrefix = entity.addressPrefix
                        entityDecodedField = "decodedData"
                        entityEncodedField = "data"
                    }
                    const txnFamilySetting = txnFamilyPrefixToSettings[familyPrefix]
                    if (!txnFamilySetting)
                        return entity
                    let entityEncodingType = txnFamilySetting.txnPayloadEncodingType
                    if (!isTransaction)
                        entityEncodingType = txnFamilySetting.stateElementsEncodingType
                    if (entityEncodingType === ENCODING_TYPES.PROTO) {
                        entity = decodeProto(
                            entity,
                            { entityDecodedField, entityEncodedField, familyPrefix, isTransaction },
                            protoToDecoder,
                            txnFamilyPrefixToRulesConfig
                        )
                    } else if (entityEncodingType === ENCODING_TYPES.CBOR) {
                        entity = decodeCBOR(entity)
                    }
                    if (entity[entityDecodedField])
                        decodedEntitiesAmount++
                    return entity
                })
                if (decodedEntitiesAmount > 0) {
                    const entitiesLabel = isTransaction ? 'transactions' : 'state elements'
                    EventBus.$emit(SNACKBAR, {
                        message: `Just finished decoding ${decodedEntitiesAmount} ${entitiesLabel}`
                    })
                }
                return resolve(decodedEntities)
            })
        },
        [MAP_TO_PROTO_NAMES]: ({getters}, {stateElements}) => {
            return new Promise(resolve => {
                const { txnFamilyPrefixToRulesConfig } = getters
                resolve(stateElements.map(stateEl => {
                    const rulesConfig = txnFamilyPrefixToRulesConfig[stateEl.addressPrefix]
                    return getProtoNameByRules(rulesConfig, stateEl)
                }))
            })
        },
    }
}

function decodeProto (entity, entityInfo, protoToDecoder, txnFamilyPrefixToRulesConfig) {
    const {entityDecodedField, entityEncodedField, familyPrefix, isTransaction} = entityInfo
    const rulesConfig = txnFamilyPrefixToRulesConfig[familyPrefix]
    if (rulesConfig) {
        let protoName = rulesConfig.transactionPayloadProtoName
        if (!isTransaction) {
            protoName = getProtoNameByRules(rulesConfig, entity)
        }
        if (protoName) {
            const protoDecoder = protoToDecoder[protoName]
            if (protoDecoder) {
                const encodedBuffer = base64ToBinarySegment(entity[entityEncodedField])
                try {
                    entity[entityDecodedField] = protoDecoder.decode(encodedBuffer)
                } catch (error) {
                    console.log("Cannot decode entity:", error)
                }
            }
        }
    }
    return entity
}

function decodeCBOR (entity) {
    const encodedBuffer = base64ToBinarySegment(entity[entityEncodedField])
    try {
        entity[entityDecodedField] = cbor.decode(encodedBuffer)                                    
    } catch (error) {
        console.log("Cannot decode entity:", error)
    }
    return entity
}

function getProtoNameByRules (rulesConfig, stateElement) {
    if (!stateElement.address || !stateElement.data)
        throw new Error("Wrong state element format: 'address' or 'data' field is missing")
    return Object.keys(rulesConfig.protoNameToRules).find(protoName => {
        const rules = rulesConfig.protoNameToRules[protoName]
        return !!rules.find(rule => isRuleFollowed(rule, stateElement))
    })
}

function isRuleFollowed (rule, stateElement) {
    if (rule.type == RuleTypes.ADDRESS_SLICE) {
        const slicedPart = stateElement.address.slice(rule.begin, rule.end)
        if (rule.minMax) {
            const slicedPartDecimal = parseInt(slicedPart, 16)
            return rule.minMax[0] <= slicedPartDecimal && slicedPartDecimal < rule.minMax[1]
        }
        if (rule.regEx) {
            return (new RegExp(rule.regEx)).test(slicedPart)
        }
        return false
    }
    if (rule.type == RuleTypes.DATA_BYTE) {
        const actualByte = base64ToBinarySegment(stateElement.data, rule.byteIndex, rule.byteIndex + 1)[0]
        return rule.minMax[0] <= actualByte && actualByte < rule.minMax[1]
    }
    return false
}

function base64ToBinarySegment (base64, begin, end) {
    const raw = atob(base64);
    const rawLength = raw.length;
    begin = begin || 0
    end = end || rawLength
    let array = new Uint8Array(new ArrayBuffer(end - begin));
    for (let i = begin; i < end; i++) {
        array[i - begin] = raw.charCodeAt(i);
    }
    return array;
}
