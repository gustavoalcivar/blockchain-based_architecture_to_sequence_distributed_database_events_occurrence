<template>
    <v-container pa-0>
        <v-layout justify-end wrap>
            <v-flex xs11>
                <v-text-field v-model="recentN" :label="'Most recent blocks amount'"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="blockIds" :label="'Block id'"></text-fields-list>                
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="txnIds" :label="'Transaction id'"></text-fields-list>                
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="signers" :label="'Signer public key'"></text-fields-list>                
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { BLOCKS_FILTERS_COMPONENT } from '@/store/constants'
import TextFieldsList from '@/components/TextFieldsList'

export default {
    name: BLOCKS_FILTERS_COMPONENT,
    data: () => ({
        txnIds: [],
        blockIds: [],
        signers: [],
        recentN: null,
    }),
    computed: {
        filters () {
            return {
                ids: this.blockIds.join(',') || null,
                txnIds: this.txnIds.join(',') || null,
                signers: this.signers.join(',') || null,
                recentN: this.recentN,
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
