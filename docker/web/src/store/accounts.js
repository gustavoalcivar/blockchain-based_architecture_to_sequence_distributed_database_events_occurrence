import Vue from 'vue'

import http from '@/lib/http'
import { sha512 } from '@/lib/common'
import {
    LOGOUT,
    LOAD,
    EDIT,
    ADD,
    ACCOUNTS,
    SNACKBAR,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [ACCOUNTS]: getLSItemSafe(ACCOUNTS, []),
    },
    getters: {
        [ACCOUNTS]: state => state[ACCOUNTS],
    },
    mutations: {
        [LOAD]: (state, accounts) => {
            state[ACCOUNTS] = accounts
        },
        [LOGOUT]: (state) => {
            state[ACCOUNTS] = []
        },
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/accounts', params: query, method: 'GET' })
                    .then(resp => {
                        const accounts = resp.data.map(acc => {
                            const hash = sha512(acc.id + acc.username + acc.isAdmin)
                            acc.hash = hash
                            return acc
                        })
                        Vue.storage.set(ACCOUNTS, JSON.stringify(accounts))
                        commit(LOAD, accounts)
                        resolve(accounts)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [EDIT]: ({dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/accounts/edit', data, method: 'POST' })
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
        [ADD]: ({dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/accounts/add', data, method: 'POST' })
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
    }
}
