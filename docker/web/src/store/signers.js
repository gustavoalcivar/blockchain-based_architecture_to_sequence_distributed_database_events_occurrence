import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,
    
    LOGOUT,

    LOAD,
    ADD,
    EDIT,

    SIGNERS_NAMESPACE,
    SIGNERS,
    UPDATE_FILTERS,
    UPDATE_QUERY,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [SIGNERS]: getLSItemSafe(SIGNERS, []),
        query: getLSItemSafe(`${SIGNERS_NAMESPACE}query`, {}),
    },
    getters: {
        [SIGNERS]: state => state[SIGNERS],
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, signers) => {
            state[SIGNERS] = signers
        },
        [LOGOUT]: (state) => {
            state[SIGNERS] = []
            state.query = {}
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const signers = resp.data
                        Vue.storage.set(SIGNERS, JSON.stringify(signers))
                        commit(LOAD, signers)
                        resolve(signers)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [ADD]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers/add', data, method: 'POST'})
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
                http({ url: '/signers/edit', data, method: 'POST' })
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
            Vue.storage.set(`${SIGNERS_NAMESPACE}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
