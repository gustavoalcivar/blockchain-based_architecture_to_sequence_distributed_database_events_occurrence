import Vue from 'vue'
import VueSocketio from 'vue-socket.io';
Vue.use(new VueSocketio({
    debug: true,
    connection: process.env.VUE_APP_API_URL || 'http://192.168.100.200:3001'
}))
