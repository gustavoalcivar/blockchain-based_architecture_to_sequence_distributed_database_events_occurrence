<template>
    <v-container>
        <v-layout justify-end wrap>
            <v-flex xs12>
                <text-fields-list v-model="addressPrefixes" :label="'Address prefix'"></text-fields-list>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { TXN_FAMILIES_FILTERS_COMPONENT } from '@/store/constants'
import TextFieldsList from '@/components/TextFieldsList'

export default {
    name: TXN_FAMILIES_FILTERS_COMPONENT,
    data: () => ({
        addressPrefixes: [],
    }),
    computed: {
        filters () {
            return {
                addressPrefixes: this.addressPrefixes.join(',') || null,
            }
        }
    },
    watch: {
        filters () {
            this.$emit('input', this.filters)
        }
    },
    components: {
        TextFieldsList
    }
}
</script>

<style>

</style>
