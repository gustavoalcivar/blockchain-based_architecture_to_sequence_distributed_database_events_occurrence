<template>
  <v-app id="inspire">
    <v-toolbar
      dark
      color="indigo"
      fixed
      app
      clipped-right
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Sawtooth Explorer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>Welcome, {{ username }}!</v-toolbar-title>
      <v-icon :style="{margin: '0px 10px 0px 20px'}" @click="logout">exit_to_app</v-icon>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <menu-items :items="menuItems" />
    </v-navigation-drawer>
    <v-navigation-drawer
      fixed
      v-model="isSettings"
      right
      clipped
      app
    >
      <menu-items :items="settingsMenuItems" />
    </v-navigation-drawer>
    <v-content>

      <router-view v-if="storeReady"/>

      <v-container v-else fill-height>
        <v-layout column align-center justify-center>
          <v-flex xs1>
            <v-progress-circular
              indeterminate
              :color="'#969696'"
              :width="6"
              :size="50">
            </v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>

    </v-content>
    <v-footer fixed dark color="indigo" class="white--text" app>
      <span>&nbsp; ScanTrust</span>
      <v-spacer></v-spacer>
      <span>&copy; 2019 &nbsp;</span>
    </v-footer>
    <slot name="snackbar" />
    <dialogs-manager />
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  
  import DialogsManager from '@/components/dialogs/DialogsManager'
  import MenuItems from '@/components/MenuItems'
  import { EventBus } from '@/lib/event-bus'
  import {
    AUTH_NAMESPACE,
    MENU_NAMESPACE,
    SIGNERS_NAMESPACE,
    SHOW_FILTERS,
    RESET_FILTERS,
    SNACKBAR,
    LOGOUT,
    LOAD,
  } from '@/store/constants'
  import {
    AUTH_PATH, ROOT_PATH,
    BLOCKS_PATH, SIGNERS_PATH,
    TXN_FAMILIES_PATH,
    TRANSACTIONS_PATH,
    STATE_PATH, SETTINGS_PATH,
    ACCOUNTS_SETTINGS_PATH,
    PROTO_SETTINGS_PATH,
    MENU_SETTINGS_PATH,
    CUSTOM_ENTITIES_PATH,
  } from '@/router/constants'

  export default {
    name: 'Main',
    data: () => ({
      drawer: true,
      storeReady: false,
      isSettings: false,
      initialMenuItems: [
        {
          to: ROOT_PATH,
          iconName: 'public',
          label: 'Home'
        }, {
          to: STATE_PATH,
          iconName: 'library_books',
          label: 'State'
        },  {
          to: BLOCKS_PATH,
          iconName: 'filter_none',
          label: 'Blocks'
        }, {
          to: TRANSACTIONS_PATH,
          iconName: 'card_travel',
          label: 'Transactions'
        },  {
          to: SIGNERS_PATH,
          iconName: 'vpn_key',
          label: 'Signers'
        }, {
          to: TXN_FAMILIES_PATH,
          iconName: 'memory',
          label: 'Transaction Families'
        }, {
          divider: true
        }, {
          heading: 'FILTERS'
        }, {
          event: SHOW_FILTERS,
          iconName: 'assignment',
          label: 'Specify'
        }, {
          event: RESET_FILTERS,
          iconName: 'close',
          label: 'Reset'
        }, {
          adminOnly: true,
          divider: true
        }, {
          adminOnly: true,
          to: SETTINGS_PATH,
          iconName: 'settings',
          label: 'Settings'
        }
      ],
      menuItems: [],
      settingsMenuItems: [{
        to: SETTINGS_PATH + '/' + ACCOUNTS_SETTINGS_PATH,
        iconName: 'people',
        label: 'Accounts'
      }, {
        to: SETTINGS_PATH + '/' + PROTO_SETTINGS_PATH,
        iconName: 'file_copy',
        label: 'Protocol Buffers'
      }, {
        to: SETTINGS_PATH + '/' + MENU_SETTINGS_PATH,
        iconName: 'menu',
        label: 'Menu'
      }]
    }),
    created () {
      this.isSettings = this.isSettingsRoute(this.$route)
      this.sockets.subscribe('txns', txns => {
        this.$store.dispatch(LOAD)
        txns.forEach(txn => {
          EventBus.$emit(SNACKBAR, {message: `New transaction: ${txn.id.slice(0, 20)}...`})
        })
      })
    },
    async mounted () {
      await this.$store.dispatch(LOAD)
      this.storeReady = true
    },
    created () {
      this.menuItems = [...this.initialMenuItems]
      if (this.customMenuItems.length) {
        const insertedItems = []
        insertedItems.push({heading: 'CUSTOM'})
        insertedItems.splice(1, 0, ...this.customMenuItems.map(item => ({
          to: CUSTOM_ENTITIES_PATH + '/' + item.id,
          iconName: 'dns',
          label: item.label,
        })))
        insertedItems.push({divider: true})
        const insertionIndex = this.menuItems.findIndex(item => item.divider) + 1
        this.menuItems.splice(insertionIndex, 0, ...insertedItems)
      }
    },
    computed: {
      ...mapGetters(AUTH_NAMESPACE, ['username']),
      ...mapGetters(MENU_NAMESPACE, ['customMenuItems']),
    },
    watch: {
      $route (to, from) {
        this.isSettings = this.isSettingsRoute(to)
      },
      customMenuItems () {
      }
    },
    methods: {
      logout () {
        this.$store.dispatch(AUTH_NAMESPACE + LOGOUT)
      },
      isSettingsRoute (route) {
        return route.path.startsWith(SETTINGS_PATH)
      }
    },
    components: {
      DialogsManager,
      MenuItems,
    }
  }
</script>

<style>
  .color-grey {
    color: grey;
  }

  .box-shadow {
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important;
  }
</style>

