<template>
    <v-container fluid pa-5 grid-list-xl>
        <v-layout wrap>
            <v-flex xs12>
                <span class="unselectable headline">Manage Accounts</span>
            </v-flex>
            <v-flex xs12>
                <v-layout align-center wrap>
                    <v-flex xs3 v-for="(account, i) in accounts" :key="account.id">
                        <entity-tile
                            :type="ACCOUNT"
                            :entity="account"
                            :clickEvent="'clicked'"
                            @clicked="showEditAccountDialog(i, account)">
                        </entity-tile>
                    </v-flex>
                    <v-flex xs1>
                        <v-btn fab dark small color="indigo lighten-1" @click="showCreateAccountDialog()">
                            <v-icon dark>add</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <span class="unselectable headline">Accounts Settings</span>
            </v-flex>
            <v-flex xs12>
                <v-switch
                    v-model="isRegistrationPublicModel"
                    @change="set('isRegistrationPublic', isRegistrationPublicModel)"
                    label="Public Registration">
                </v-switch>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    import {
        ACCOUNT,
        ACCOUNTS_NAMESPACE,
        SETTINGS_NAMESPACE,
        LOAD,
        SET,
        SHOW_EDIT,
        SHOW_ADD,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'
    import EntityTile from '@/components/EntityTile.vue'

    export default {
        name: 'accounts-settings',
        data: function () {
            return {
                isRegistrationPublicModel: true,

                ACCOUNT,
            }
        },
        created () {
            this.load()
        },
        methods: {
            showEditAccountDialog (index, account) {
                EventBus.$emit(SHOW_EDIT, {type: ACCOUNT, data: account})
            },
            showCreateAccountDialog () {
                EventBus.$emit(SHOW_ADD, {type: ACCOUNT})
            },
            async load () {
                await Promise.all([
                    this.$store.dispatch(ACCOUNTS_NAMESPACE + LOAD),
                    this.$store.dispatch(SETTINGS_NAMESPACE + LOAD),
                ])
                this.isRegistrationPublicModel = this.isRegistrationPublic
            },
            set (key, value) {
                this.$store.dispatch(SETTINGS_NAMESPACE + SET, {key, value})
            }
        },
        watch: {
            isRegistrationPublic () {
                this.isRegistrationPublicModel = this.isRegistrationPublic
            }
        },
        computed: {
            ...mapGetters(ACCOUNTS_NAMESPACE, ['accounts']),
            ...mapGetters(SETTINGS_NAMESPACE, ['isRegistrationPublic']),
        },
        components: {
            EntityTile,
        }
    }
</script>

<style scoped>
    span {
        color: #4385b9;
        font-weight: 500;
    }
</style>
