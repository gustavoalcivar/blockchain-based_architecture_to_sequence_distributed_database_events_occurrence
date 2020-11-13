import Vue from 'vue'
import './plugins/vuetify'
import './plugins/datetime-picker'
import './plugins/socket-io'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage, {
  name: 'storage'
})

import config from './lib/config'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './lib/http'

Vue.config.productionTip = false

const token = Vue.storage.get('userToken', '')
if (token) {
  http.defaults.headers.common['Authorization'] = token
}

const app = new Vue({
  localStorage: config.LOCAL_STORAGE,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
