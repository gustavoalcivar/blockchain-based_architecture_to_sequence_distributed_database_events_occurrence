<template>
  <router-view>
    <v-snackbar
      slot="snackbar"
      v-model="snackbar"
      :left="true"
      :top="true"
      :timeout="3000">
      {{ snackbarText }}
      <v-btn
        color="indigo accent-1"
        flat
        @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </router-view>
</template>

<script>
import Auth from '@/layouts/Auth'
import Main from '@/layouts/Main'
import { EventBus } from '@/lib/event-bus'
import { SNACKBAR, LOAD } from '@/store/constants'

export default {
  name: 'App',
  components: {
    Auth, Main
  },
  data: () => ({
    snackbar: false,
    snackbarText: '',
  }),
  methods: {
    showSnackbar: function ({message}) {
      this.snackbarText = message
      this.snackbar = true
    }
  },
  mounted () {
    EventBus.$on(SNACKBAR, data => {
      this.showSnackbar(data)
    })
  },
  beforeDestroy () {
    EventBus.$off(SNACKBAR)
  }
}
</script>

<style>
  .pos-relative {
    position: relative;
  }

  .height-85-prc {
    height: 85%;
  }

  .unselectable { 
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none; 
  }
</style>
