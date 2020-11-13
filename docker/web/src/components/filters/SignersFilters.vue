<template>
    <v-container>
        <v-layout justify-end wrap>
            <v-flex xs12>
                <text-fields-list v-model="publicKeys" :label="'Public key'" :maxFieldsAmount="6"></text-fields-list>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { SIGNERS_FILTERS_COMPONENT } from '@/store/constants'
import TextFieldsList from '@/components/TextFieldsList'

export default {
    name: SIGNERS_FILTERS_COMPONENT,
    data: () => ({
        publicKeys: []
    }),
    computed: {
        filters () {
            return {
                publicKeys: this.publicKeys.join(',') || null,
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
