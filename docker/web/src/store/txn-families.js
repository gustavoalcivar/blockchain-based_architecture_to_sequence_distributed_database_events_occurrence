import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,
    
    LOGOUT,

    LOAD,
    ADD,
    EDIT,

    TXN_FAMILIES_NAMESPACE,
    UPDATE_FILTERS,
    UPDATE_QUERY,
    TXN_FAMILIES,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [TXN_FAMILIES]: getLSItemSafe(TXN_FAMILIES, []),
        query: getLSItemSafe(`${TXN_FAMILIES_NAMESPACE}query`, {}),
    },
    getters: {
        [TXN_FAMILIES]: state => state[TXN_FAMILIES],
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, txnFamilies) => {
            state[TXN_FAMILIES] = txnFamilies
        },
        [LOGOUT]: (state) => {
            state[TXN_FAMILIES] = []
            state.query = {}
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const txnFamilies = resp.data
                        Vue.storage.set(TXN_FAMILIES, JSON.stringify(txnFamilies))
                        commit(LOAD, txnFamilies)
                        resolve(txnFamilies)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [ADD]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies/add', data, method: 'POST'})
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [EDIT]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies/edit', data, method: 'POST' })
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${TXN_FAMILIES_NAMESPACE}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
