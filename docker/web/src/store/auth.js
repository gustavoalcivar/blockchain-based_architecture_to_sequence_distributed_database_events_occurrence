import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,

    LOGIN,
    REGISTER,
    SUCCESS,
    ERROR,
    LOGOUT,
    
    SIGNERS_NAMESPACE,
    TXN_FAMILIES_NAMESPACE,
    BLOCKS_NAMESPACE,
    TRANSACTIONS_NAMESPACE,
} from './constants'
import router from '@/router';
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        // Vue.storage is not there yet and VueLocalStorage (if imported) is not usable here for some reason
        token: getLSItemSafe('userToken'),
        username: getLSItemSafe('username'),
        isAdmin: getLSItemSafe('isAdmin', false),
    },
    getters: {
        isAuthenticated: state => !!state.token,
        isAdmin: state => state.isAdmin,
        username: state => state.username,
    },
    mutations: {
        [SUCCESS]: (state, {token, username, isAdmin}) => {
            state.isAdmin = isAdmin
            state.token = token
            state.username = username
        },
        [LOGOUT]: (state) => {
            state.token = ''
            state.username = ''
            state.isAdmin = false
        }
    },
    actions: {
        [LOGIN]: ({commit, dispatch}, user) => {
            return new Promise((resolve, reject) => {
                http({url: '/auth/login', data: user, method: 'POST' })
                    .then(resp => {
                        let {token, username, isAdmin} = resp.data
                        token = "Bearer " + token
                        Vue.storage.set('userToken', token)
                        Vue.storage.set('username', username)
                        Vue.storage.set('isAdmin', isAdmin)
                        http.defaults.headers.common['Authorization'] = token
                        commit(SUCCESS, {token, username, isAdmin})
                        resolve(resp)
                    })
                    .catch(err => {
                        commit(ERROR, err)
                        reject(err)
                    })
            })
        },
        [REGISTER]: ({commit, dispatch}, user) => {
            return new Promise((resolve, reject) => {
                http({url: '/auth/register', data: user, method: 'POST' })
                    .then(resp => {
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [LOGOUT]: ({commit, dispatch}) => {
            return new Promise((resolve, reject) => {
                commit(LOGOUT)
                commit(SIGNERS_NAMESPACE + LOGOUT, null, { root: true })
                commit(TXN_FAMILIES_NAMESPACE + LOGOUT, null, { root: true })
                commit(BLOCKS_NAMESPACE + LOGOUT, null, { root: true })
                commit(TRANSACTIONS_NAMESPACE + LOGOUT, null, { root: true })
                Vue.storage.set('userToken', '')
                delete http.defaults.headers.common['Authorization']
                router.push('/auth')
                resolve()
            })
        }
    }
}
