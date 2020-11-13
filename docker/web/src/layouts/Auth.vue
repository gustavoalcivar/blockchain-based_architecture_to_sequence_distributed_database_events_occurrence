<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="indigo">
                  <v-toolbar-title :style="{opacity: signInOpacity, cursor: 'pointer'}" @click="isSignIn = true">Sign In</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-title v-show="isRegistrationPublic" :style="{opacity: signUpOpacity, cursor: 'pointer'}" @click="isSignIn = false">Sign Up</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                    <v-text-field v-model="password" id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="isSignIn" dark color="indigo" @click="login">Login</v-btn>
                  <v-btn v-if="!isSignIn" dark color="indigo" @click="register">Register</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <slot name="snackbar" />
    </v-app>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import {
    AUTH_NAMESPACE,
    LOGIN,
    REGISTER,
    ERROR,
    SETTINGS_NAMESPACE,
    LOAD,
  } from '@/store/constants'

  export default {
    name: 'Auth',
    data: () => ({
      drawer: null,
      isSignIn: true,
      username: '',
      password: '',
    }),
    computed: {
      ...mapGetters(SETTINGS_NAMESPACE, ['isRegistrationPublic']),
      signInOpacity: function () {
        return this.isSignIn ? 1 : 0.3
      },
      signUpOpacity: function () {
        return this.isSignIn ? 0.3 : 1
      },
    },
    methods: {
      async load () {
        await this.$store.dispatch(SETTINGS_NAMESPACE + LOAD)
        if (!this.isRegistrationPublic)
          this.isSignIn = true
      },
      login: function () {
        const {username, password} = this
        this.$store.dispatch(AUTH_NAMESPACE + LOGIN, {username, password}).then(() => {
          this.$router.push('/')
        })
      },
      register: function () {
        const {username, password} = this
        this.$store.dispatch(AUTH_NAMESPACE + REGISTER, {username, password}).then(() => {
          this.isSignIn = true
        })
      }
    },
  }
</script>