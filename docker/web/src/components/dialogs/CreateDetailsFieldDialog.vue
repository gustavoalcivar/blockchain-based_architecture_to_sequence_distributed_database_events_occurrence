<template>
    <v-dialog persistent v-model="shown" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{isEditMode ? 'Edit' : 'Add'}} Details Field</span>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    label="Label"
                    v-model="modifiedDetailsField.label">
                </v-text-field>
                <v-text-field
                    label="Path"
                    v-model="modifiedDetailsField.path">
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="apply" :disabled="!isDetailsFieldFilled">{{isEditMode ? 'Apply' : 'Add'}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { sha512 } from '@/lib/common'
    import { mapGetters } from 'vuex'

    import { EventBus } from '@/lib/event-bus'
    import {
        SHOW_ADD,
        PROTO_NAMESPACE
    } from '@/store/constants'

    export default {
        name: 'create-details-field-dialog',
        data: () => ({
            modifiedDetailsField: {}
        }),
        props: {
            shown: {
                type: Boolean,
                required: true,
            },
            detailsField: {
                type: Object,
                required: true,
            },
        },
        methods: {
            apply () {
                this.modifiedDetailsField.pathHash = sha512(this.modifiedDetailsField.path)
                this.$emit('detailsFieldChanged', this.modifiedDetailsField)
                this.close()
            },
            close () {
                this.$emit('close')
            },
            showCreateDetailsFieldDialog () {
                // show custom dialog...
            },
        },
        watch: {
            shown () {
                if (!this.shown)
                    this.modifiedDetailsField = {}
                else
                    this.modifiedDetailsField = Object.assign({}, this.detailsField)
            },
        },
        computed: {
            isDetailsFieldFilled () {
                return this.modifiedDetailsField.label && this.modifiedDetailsField.path
            },
            isEditMode () {
                return !!this.detailsField.label
            },
        },
    }
</script>

<style scoped>
</style>