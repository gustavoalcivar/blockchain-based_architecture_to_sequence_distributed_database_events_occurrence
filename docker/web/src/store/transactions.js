import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    TRANSACTIONS_NAMESPACE,
    UPDATE_FILTERS,
    UPDATE_QUERY,
    TRANSACTIONS,
    PROTO_NAMESPACE,
    DECODE,
} from './constants'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [TRANSACTIONS]: getLSItemSafe(TRANSACTIONS, []),
        query: getLSItemSafe(`${TRANSACTIONS_NAMESPACE}query`, {}),
    },
    getters: {
        [TRANSACTIONS]: state => state[TRANSACTIONS],
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, transactions) => {
            state[TRANSACTIONS] = transactions
        },
        [LOGOUT]: (state) => {
            state[TRANSACTIONS] = []
            state.query = {}
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({dispatch, commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/transactions', params: query || getters.query, method: 'GET' })
                    .then(async resp => {
                        const transactions = resp.data.reverse()
                        const decodedTransactions = await dispatch(
                            PROTO_NAMESPACE + DECODE,
                            {isTransaction: true, entities: transactions},
                            {root: true}
                        )
                        Vue.storage.set(TRANSACTIONS, JSON.stringify(decodedTransactions))
                        commit(LOAD, decodedTransactions)
                        resolve(decodedTransactions)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${TRANSACTIONS_NAMESPACE}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
