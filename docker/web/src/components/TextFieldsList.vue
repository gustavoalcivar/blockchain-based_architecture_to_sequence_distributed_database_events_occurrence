<template>
    <v-form>
        <v-layout justify-end wrap>
            <v-flex v-for="(value, i) in fieldsValues" :key="i"
                    :xs12="i == 0 || i == fieldsValues.length - 1" :xs11="i > 0">
                <v-text-field v-model="fieldsValues[i]" :label="label">
                    <v-icon v-if="i == 0" slot="prepend" class="pa-1"
                            @click="maxFieldsExceeded ? null : pushField()"
                            :style="{ cursor: maxFieldsExceeded ? 'default' : 'pointer' }">
                        add
                    </v-icon>
                    <v-icon v-if="i == fieldsValues.length - 1 && i != 0"
                            slot="prepend" class="pa-1"
                            @click="popField">
                        remove
                    </v-icon>
                </v-text-field>
            </v-flex>
        </v-layout>
    </v-form>
</template>

<script>
export default {
    name: 'text-fields-list',
    data: () => ({
        fieldsValues: ['']
    }),
    props: {
        label: {
            type: String,
        },
        maxFieldsAmount: {
            type: Number,
            default: 3
        }
    },
    watch: {
        fieldsValues () {
            this.$emit('input', this.fieldsValues)
        }
    },
    computed: {
        maxFieldsExceeded () { return this.fieldsValues.length >= this.maxFieldsAmount }
    },
    methods: {
        pushField () {
            this.fieldsValues.push('')
        },
        popField () {
            this.fieldsValues.pop()
        }
    }
}
</script>

<style>

</style>
