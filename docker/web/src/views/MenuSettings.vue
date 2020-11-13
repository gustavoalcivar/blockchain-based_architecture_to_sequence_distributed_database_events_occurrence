<template>
    <div>
        <manage-menu-item-dialog
            v-if="menuItemDialogShown"
            :shown="menuItemDialogShown"
            :menuItem="shownMenuItem"
            @menuItemChanged="setMenuItem({index: shownMenuItemIndex, menuItem: $event})"
            @close="menuItemDialogShown = false">
        </manage-menu-item-dialog>
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex xs12>
                    <span class="unselectable headline">Custom Menu Items</span>
                </v-flex>
                <v-flex xs12>
                    <v-layout align-center wrap>
                        <v-flex xs3 v-for="(item, i) in customMenuItems" :key="item.label">
                            <entity-tile
                                :type="CUSTOM_MENU_ITEM"
                                :entity="item"
                                :clickEvent="'clicked'"
                                @clicked="showEditMenuItemDialog(i, item)">
                            </entity-tile>
                        </v-flex>
                        <v-flex xs1>
                            <v-btn fab dark small color="indigo lighten-1" @click="showCreateMenuItemDialog()">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import {
        MENU_NAMESPACE,
        MENU_ITEM,
        SET,
        LOAD,
        SHOW_EDIT,
        SHOW_ADD,
        CUSTOM_MENU_ITEM,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'
    import EntityTile from '@/components/EntityTile.vue'
    import ManageMenuItemDialog from '@/components/dialogs/ManageMenuItemDialog.vue'

    export default {
        name: 'menu-settings',
        data: () => ({
            menuItemDialogShown: false,
            shownMenuItem: null,
            shownMenuItemIndex: null,

            CUSTOM_MENU_ITEM,
        }),
        created () {
            this.load()
        },
        methods: {
            showEditMenuItemDialog (index, menuItem) {
                this.shownMenuItemIndex = index
                this.shownMenuItem = menuItem
                this.menuItemDialogShown = true
            },
            showCreateMenuItemDialog () {
                this.shownMenuItemIndex = this.customMenuItems.length
                this.shownMenuItem = {}
                this.menuItemDialogShown = true
            },
            setMenuItem ({index, menuItem}) {
                this.$store.dispatch(MENU_NAMESPACE + SET, {index, menuItem})
            },
            async load () {
                await this.$store.dispatch(MENU_NAMESPACE + LOAD)
            }
        },
        computed: {
            ...mapGetters(MENU_NAMESPACE, ['customMenuItems']),
        },
        components: {
            EntityTile,
            ManageMenuItemDialog,
        }
    }
</script>

<style scoped>
    span {
        color: #4385b9;
        font-weight: 500;
    }
</style>
