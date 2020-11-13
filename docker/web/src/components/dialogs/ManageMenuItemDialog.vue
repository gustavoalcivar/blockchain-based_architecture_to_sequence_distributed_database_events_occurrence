<template>
    <v-dialog persistent v-model="shown" max-width="500px">
        <create-details-field-dialog
            :shown="createDetailsFieldDialogShown"
            :detailsField="shownDetailsField"
            @detailsFieldChanged="setDetailsField(shownDetailsFieldIndex, $event)"
            @close="createDetailsFieldDialogShown = false">
        </create-details-field-dialog>
        <v-card>
            <v-card-title>
                <span class="headline">{{isEditMode ? 'Edit' : 'Add'}} Menu Item</span>
            </v-card-title>
            <v-card-text>
                <v-select
                    label="Proto Message"
                    :items="protoMessages"
                    v-model="modifiedMenuItem.protoMessage">
                </v-select>
                <v-text-field
                    label="Label"
                    v-model="modifiedMenuItem.label">
                </v-text-field>
                <v-text-field
                    label="Tile Avatar Path"
                    v-model="modifiedMenuItem.tileAvatarPath">
                </v-text-field>
                <v-text-field
                    label="Tile Label Path"
                    v-model="modifiedMenuItem.tileLabelPath">
                </v-text-field>
                <span class="pb-2 unselectable title details-fields">Details Fields</span>
                <v-container grid-list-md>
                    <v-layout align-center wrap>
                        <v-flex
                            :xs12="i < detailsFields.length - 1"
                            xs11
                            v-for="(detailsField, i) in detailsFields"
                            :key="detailsField.label">
                            <entity-tile
                                :type="MENU_ITEM_DETAILS_FIELD"
                                :entity="detailsField"
                                @showDetails="showCreateDetailsFieldDialog({detailsField, detailsFieldIndex: i})">
                                <template v-slot:action>
                                    <v-btn flat icon @click="detailsFields.splice(i, 1)">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                </template>
                            </entity-tile>
                        </v-flex>
                        <v-flex xs1>
                            <v-btn
                                fab dark small color="indigo lighten-1"
                                @click="showCreateDetailsFieldDialog({detailsFieldIndex: detailsFields.length})">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="apply" :disabled="!isMenuItemFilled">{{isEditMode ? 'Apply' : 'Add'}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'

    import { EventBus } from '@/lib/event-bus'
    import {
        SHOW_ADD,
        PROTO_NAMESPACE,
        MENU_ITEM_DETAILS_FIELD,
    } from '@/store/constants'
    import EntityTile from '@/components/EntityTile.vue'
    import CreateDetailsFieldDialog from '@/components/dialogs/CreateDetailsFieldDialog.vue'

    export default {
        name: 'manage-menu-item-dialog',
        data: () => ({
            createDetailsFieldDialogShown: false,
            shownDetailsField: {},
            modifiedMenuItem: {},
            detailsFields: [],

            MENU_ITEM_DETAILS_FIELD,
        }),
        props: {
            shown: {
                type: Boolean,
                required: true,
            },
            menuItem: {
                type: Object,
                required: true,
            },
        },
        mounted () {
            this.modifiedMenuItem = Object.assign({ }, this.menuItem)
            this.detailsFields = this.menuItem.detailsFields || []
        },
        methods: {
            apply () {
                this.modifiedMenuItem.detailsFields = this.detailsFields
                this.$emit('menuItemChanged', this.modifiedMenuItem)
                this.close()
            },
            close () {
                this.$emit('close')
            },
            showCreateDetailsFieldDialog ({detailsField, detailsFieldIndex}) {
                this.shownDetailsField = detailsField || {}
                this.shownDetailsFieldIndex = detailsFieldIndex
                this.createDetailsFieldDialogShown = true
            },
            setDetailsField (detailsFieldIndex, detailsField) {
                Vue.set(this.detailsFields, detailsFieldIndex, detailsField)
            },
        },
        watch: {
            shown () {
                if (!this.shown)
                    this.modifiedMenuItem = {}
            },
            'modifiedMenuItem.protoMessage' () {
                if (!this.modifiedMenuItem.label)
                    this.modifiedMenuItem.label = String(this.modifiedMenuItem.protoMessage)
            },
        },
        computed: {
            ...mapGetters(PROTO_NAMESPACE, ['txnFamilyPrefixToProtoMessages']),
            protoMessages () {
                return Object.values(this.txnFamilyPrefixToProtoMessages).flat()
            },
            isEditMode () {
                return !!this.menuItem.protoMessage
            },
            isMenuItemFilled () {
                return this.modifiedMenuItem.label &&
                       this.modifiedMenuItem.protoMessage &&
                       this.modifiedMenuItem.tileAvatarPath &&
                       this.modifiedMenuItem.tileLabelPath &&
                       this.detailsFields.length
            },
        },
        components: {
            CreateDetailsFieldDialog,
            EntityTile,
        },
    }
</script>

<style scoped>
    .details-fields {
        color: #424242;
        font-weight: 400;
        display: block;
    }
</style>