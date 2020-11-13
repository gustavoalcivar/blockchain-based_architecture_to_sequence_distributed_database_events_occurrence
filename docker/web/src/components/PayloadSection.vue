<template>
    <v-container pt-0 pl-0 pr-0>
        <v-layout wrap class="box-shadow">
            <v-flex xs12 pt-3>
                <v-layout justify-end>
                    <v-flex
                        xs1 class="representation-label subheading"
                        :class="{
                            'selected-representation': !isJSONCurrently,
                            'border-right': hasJSON
                        }"
                        @click="isJSONCurrently = false">
                        raw
                    </v-flex>
                    <v-flex
                        v-if="hasJSON"
                        xs1 class="representation-label subheading"
                        :class="{'selected-representation': isJSONCurrently}"
                        @click="isJSONCurrently = true">
                        json
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-flex xs12 v-show="!isJSONCurrently" class="raw-representation">
                    {{raw}}
                </v-flex>
                <v-flex xs12 v-if="hasJSON" v-show="isJSONCurrently">
                    <json-viewer :value="json" :expand-depth="5"></json-viewer>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import JsonViewer from 'vue-json-viewer'
    import 'vue-json-viewer/style.css'

    export default {
        name: 'payload-section',
        data: () => ({
            isJSONCurrently: false,
        }),
        props: {
            raw: {
                type: String,
                required: true,
            },
            json: {
                type: Object,
                default: null,
            },
        },
        mounted () {
            if (this.hasJSON)
                this.isJSONCurrently = true
        },
        computed: {
            hasJSON () {
                return !!this.json
            },
        },
        watch: {
            json () {
                if (this.hasJSON)
                    this.isJSONCurrently = true
            }
        },
        components: {
            JsonViewer
        }
    }
</script>

<style scoped>
    .representation-label {
        cursor: pointer;
        text-align: center;
        color: #666;
    }

    .border-right {
        border-right: 1px solid black
    }

    .raw-representation {
        overflow-wrap: break-word;
        margin: 20px;
    }

    .selected-representation {
        color: black;
    }
</style>
