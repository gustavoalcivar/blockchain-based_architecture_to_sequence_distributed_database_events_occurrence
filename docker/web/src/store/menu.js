import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    SET,
    CUSTOM_MENU_ITEMS,
    SNACKBAR,
} from './constants'
import { EventBus } from '@/lib/event-bus'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [CUSTOM_MENU_ITEMS]: getLSItemSafe(CUSTOM_MENU_ITEMS, []),
/*         [CUSTOM_MENU_ITEMS]: [{
            protoMessage: 'AccountContainer',
            label: 'Accounts',
            tileAvatarPath: '.entries[0].publicKey',
            tileLabelPath: '.entries[0].publicKey',
            detailsFields: [{
                label: 'Public Key',
                path: '.entries[0].publicKey'
            }, {
                label: 'Label',
                path: '.entries[0].label'
            }, {
                label: 'Description',
                path: '.entries[0].description'
            }]
        }] */
    },
    getters: {
        [CUSTOM_MENU_ITEMS]: state => state[CUSTOM_MENU_ITEMS],
    },
    mutations: {
        [LOAD]: (state, items) => {
            state[CUSTOM_MENU_ITEMS] = items
        },
        [LOGOUT]: (state) => {
            state[CUSTOM_MENU_ITEMS] = []
        },
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/customMenuItems', params: query, method: 'GET' })
                    .then(resp => {
                        const items = resp.data
                        Vue.storage.set(CUSTOM_MENU_ITEMS, JSON.stringify(items))
                        commit(LOAD, items)
                        resolve(items)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [SET]: ({dispatch}, {index, menuItem}) => {
            menuItem.id = index
            return new Promise((resolve, reject) => {
                http({ url: '/customMenuItems/set', data: menuItem, method: 'POST' })
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
