<template>
    <v-dialog persistent
        v-model="shown" max-width="650px"
        @keydown.right="showNextEntityDetails(1)"
        @keydown.left="showNextEntityDetails(-1)">
        <v-card>
            <v-card-title>
                <span class="headline">Details</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap v-if="details.length > 0">
                        <template v-for="item in details">
                            <v-flex xs12 :key="`${item.label}-label`">
                                <span class="unselectable color-grey">{{item.label}}</span>
                            </v-flex>
                            <v-flex xs11 mx-auto :key="`${item.label}-value`">
                                <span class="subheading">{{item.value != undefined ? item.value : 'Unknown'}}</span>
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
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="$emit('close')">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import objectPath from 'object-path'

    import { EventBus } from '@/lib/event-bus'
    import { DETAILS_NEXT } from '@/store/constants'

    export default {
        name: 'custom-entity-details-dialog',
        data: () => ({
            details: []
        }),
        props: {
            shown: {
                type: Boolean,
                default: false
            },
            entity: {
                type: Object,
                default: null
            },
            detailsFields: {
                type: Array,
                required: true
            },
        },
        watch: {
            entity () {
                this.details = this.detailsFields.map(field => ({
                    label: field.label,
                    value: objectPath.get(this.entity, field.path)
                }))
            }
        },
        methods: {
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