<template>
    <v-dialog persistent
        v-model="shown" max-width="650px"
        @keydown.right="showNextEntityDetails(1)"
        @keydown.left="showNextEntityDetails(-1)">
        <v-card>
            <v-card-title>
                <span class="headline">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap v-if="displayedFields.length > 0">
                        <template v-for="field in displayedFields">
                            <v-flex xs12 :key="`${field.label}-label`">
                                <span class="unselectable color-grey">{{field.label}}</span>
                            </v-flex>
                            <v-flex xs11 mx-auto :key="`${field.label}-value`">
                                <slot v-if="field.tagName" :name="field.slotName"></slot>
                                <span v-else class="subheading">{{field.value != undefined ? field.value : 'Unknown'}}</span>
                            </v-flex>
                        </template>
                    </v-layout>
                    <v-layout wrap v-else justify-center align-center fill-height>
                        <v-flex xs4>
                            <h3 class="unselectable color-grey">No data :(</h3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn v-if="changeable" color="blue darken-1" flat @click.native="edit">Edit</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="$emit('close')">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { EventBus } from '@/lib/event-bus'
    import { SHOW_EDIT, SHOW_ADD, DETAILS_NEXT } from '@/store/constants'

    export default {
        name: 'details-dialog',
        data: () => ({

        }),
        props: {
            title: {
                type: String,
                default: 'Unknown'
            },
            shown: {
                type: Boolean,
                default: false
            },
            changeable: {
                type: Boolean,
                default: false
            },
            dataPresent: {
                type: Boolean,
                default: false
            },
            detailedEntity: {
                type: Object,
                default: null
            },
            detailsType: {
                type: String,
                required: true
            },
            displayedFields: {
                type: Array,
                required: true
            }
        },
        methods: {
            edit () {
                EventBus.$emit(SHOW_EDIT, { type: this.detailsType, data: this.detailedEntity })
            },
            add () {
                EventBus.$emit(SHOW_ADD, { data: this.detailedEntity })
            },
            showNextEntityDetails (shiftSize) {
                EventBus.$emit(DETAILS_NEXT, shiftSize)
            }
        }
    }
</script>

<style scoped>
  .subheading {
    overflow-wrap: break-word;
  }
</style>