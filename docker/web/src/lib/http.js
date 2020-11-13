import axios from 'axios'

import store from '@/store'
import messageCodes from './message-codes'
import { AUTH_NAMESPACE, LOGOUT, SNACKBAR } from '@/store/constants';
import { EventBus } from '@/lib/event-bus';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
});

axiosInstance.interceptors.response.use(
    function (res) {
        return new Promise(function (resolve, reject) {
            const data = res.data
            if (data && data.message)
                res.data.message = messageCodes[data.message] || messageCodes['unknown_message_type']
            resolve(res)
        })
    },
    function (err) {
        return new Promise(function (resolve, reject) {
            if (!err.response) {
                err.response = {data: {ok: false, message: 'no_response_from_server'}}
            }
            const resp = err.response
            if (resp.status === 401) {
                store.dispatch(AUTH_NAMESPACE + LOGOUT)
            }
            if (resp.data && resp.data.message) {
                const data = resp.data
                err.response.data.message = messageCodes[data.message] || messageCodes['unknown_error']
            }
            EventBus.$emit(SNACKBAR, err.response.data)
            throw err;
        })
    }
);

export default axiosInstance