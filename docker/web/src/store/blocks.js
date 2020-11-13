import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    BLOCKS_NAMESPACE,
    UPDATE_FILTERS,
    UPDATE_QUERY,
    BLOCKS,
} from './constants'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        blocks: getLSItemSafe(BLOCKS, []),
        query: getLSItemSafe(`${BLOCKS_NAMESPACE}query`, {}),
    },
    getters: {
        [BLOCKS]: state => state[BLOCKS],
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, blocks) => {
            state[BLOCKS] = blocks
        },
        [LOGOUT]: (state) => {
            state[BLOCKS] = []
            state.query = {}
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/blocks', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const blocks = resp.data.reverse()
                        Vue.storage.set(BLOCKS, JSON.stringify(blocks))
                        commit(LOAD, blocks)
                        resolve(blocks)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${BLOCKS_NAMESPACE}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
