<template>
    <v-container>
        <v-layout justify-end wrap>
            <v-flex xs12>
                <text-fields-list v-model="txnIds" :label="'Transaction id'"></text-fields-list>
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="signers" :label="'Signer public key'"></text-fields-list>
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="blockIds" :label="'Block id'"></text-fields-list>
            </v-flex>
            <v-flex xs12>
                <text-fields-list v-model="batchIds" :label="'Batch id'"></text-fields-list>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { TRANSACTIONS_FILTERS_COMPONENT } from '@/store/constants'
import TextFieldsList from '@/components/TextFieldsList'

export default {
    name: TRANSACTIONS_FILTERS_COMPONENT,
    data: () => ({
        txnIds: [],
        signers: [],
        blockIds: [],
        batchIds: [],
    }),
    computed: {
        filters () {
            return {
                ids: this.txnIds.join(',') || null,
                signers: this.signers.join(',') || null,
                blockIds: this.blockIds.join(',') || null,
                batchIds: this.batchIds.join(',') || null,
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
