import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    SET,
    SETTINGS,
    SNACKBAR,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [SETTINGS]: getLSItemSafe(SETTINGS, { isRegistrationPublic: true }),
    },
    getters: {
        [SETTINGS]: state => state[SETTINGS],
        isRegistrationPublic: state => !!state[SETTINGS]['isRegistrationPublic']
    },
    mutations: {
        [LOAD]: (state, settings) => {
            state[SETTINGS] = settings
        },
        [LOGOUT]: (state) => {
            state[SETTINGS] = {}
        },
    },
    actions: {
        [LOAD]: ({commit}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/settings', params: query, method: 'GET' })
                    .then(resp => {
                        const settings = resp.data
                        Vue.storage.set(SETTINGS, JSON.stringify(settings))
                        commit(LOAD, settings)
                        resolve(settings)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [SET]: ({dispatch}, {key, value}) => {
            return new Promise((resolve, reject) => {
                http({ url: '/settings/set', data: {key, value}, method: 'POST' })
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
