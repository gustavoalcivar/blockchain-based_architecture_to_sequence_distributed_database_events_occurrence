import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'
import transactions from './transactions'
import stateElements from './state-elements'
import proto from './proto'
import accounts from './accounts'
import settings from './settings'
import menu from './menu'

import {
    AUTH_NAMESPACE,
    SIGNERS_NAMESPACE,
    TXN_FAMILIES_NAMESPACE,
    BLOCKS_NAMESPACE,
    STATE_ELEMENTS_NAMESPACE,
    TRANSACTIONS_NAMESPACE,
    PROTO_NAMESPACE,
    ACCOUNTS_NAMESPACE,
    MENU_NAMESPACE,
    LOAD,
    FETCH_PROP_VALUE,
} from './constants'
import {
    comparisonOperatorToFunction,
} from '@/lib/common'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        async [LOAD] ({dispatch, getters}) {
            await dispatch(PROTO_NAMESPACE + LOAD)
            // PROTO_NAMESPACE LOAD also loads stateEls and txns because it needs to re-decode them
            // dispatch(STATE_ELEMENTS_NAMESPACE + LOAD)
            // dispatch(TRANSACTIONS_NAMESPACE + LOAD)
            dispatch(SIGNERS_NAMESPACE + LOAD)
            dispatch(TXN_FAMILIES_NAMESPACE + LOAD)
            dispatch(BLOCKS_NAMESPACE + LOAD)
            if (getters[AUTH_NAMESPACE + 'isAdmin'])
                dispatch(ACCOUNTS_NAMESPACE + LOAD)
            dispatch(MENU_NAMESPACE + LOAD)
            },
        [FETCH_PROP_VALUE] ({getters}, {searchedEntityStoreNameSpace, searchConfig, data}) {
            // Need to fetch prop-value from store
            // using this searchConfig and data
            const entities = getters[searchedEntityStoreNameSpace + searchConfig.storeGetterName]
            const [storeEntityKey, comparisonOperator, detailedEntityKey] = searchConfig.storeWhereQuery.split(' ')
            return entities[searchConfig.multiple ? 'filter' : 'find'](entity => {
                return comparisonOperatorToFunction[comparisonOperator](
                    entity[storeEntityKey],
                    data[detailedEntityKey]
                )
            }) || { [storeEntityKey]: data[detailedEntityKey] }
            // Example of possible call above when
            // some values are substituted is
            // return this.signers.find(
            //     signer => signer.puplicKey == data.signerPublicKey)
        }
    },
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        transactions,
        stateElements,
        proto,
        accounts,
        settings,
        menu,
    }
})

export function getLSItemSafe (key, fallbackValue) {
    const value = localStorage.getItem(key)
    if (value == null || value === 'undefined')
        return fallbackValue
    if (value === 'true') return true
    if (value === 'false') return false
    try {
        return JSON.parse(value)
    } catch {
        return value
    }
}
