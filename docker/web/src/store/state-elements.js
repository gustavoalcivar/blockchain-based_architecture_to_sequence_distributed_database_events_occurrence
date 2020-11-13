import Vue from 'vue'
import moment from 'moment'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    UPDATE_QUERY,
    UPDATE_FILTERS,

    STATE_ELEMENTS_NAMESPACE,
    STATE_ELEMENTS,
    PROTO_NAMESPACE,
    DECODE,
} from './constants'
import { getLSItemSafe } from './index'

export default {
    namespaced: true,
    state: {
        [STATE_ELEMENTS]: getLSItemSafe(STATE_ELEMENTS, []),
        query: getLSItemSafe(`${STATE_ELEMENTS_NAMESPACE}query`, {}),
    },
    getters: {
        [STATE_ELEMENTS]: state => state[STATE_ELEMENTS],
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, stateElements) => {
            state[STATE_ELEMENTS] = stateElements
        },
        [LOGOUT]: (state) => {
            state[STATE_ELEMENTS] = []
            state.query = {}
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/stateElements', params: query || getters.query, method: 'GET' })
                    .then(async resp => {
                        const stateElements = resp.data.map(stateElement => {
                            if (stateElement.createdAt)
                                stateElement.createdAt = moment(stateElement.createdAt).format('LLL')
                            stateElement.addressPrefix = stateElement.address.slice(0, 6)
                            return stateElement
                        })
                        const decodedStateElements = await dispatch(
                            PROTO_NAMESPACE + DECODE,
                            {isTransaction: false, entities: stateElements},
                            {root: true}
                        )
                        Vue.storage.set(STATE_ELEMENTS, JSON.stringify(decodedStateElements))
                        commit(LOAD, decodedStateElements)
                        resolve(decodedStateElements)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${STATE_ELEMENTS_NAMESPACE}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
