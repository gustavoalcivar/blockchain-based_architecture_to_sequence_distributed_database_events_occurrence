<template>
    <v-container fluid pa-5 grid-list-xl>
        <v-layout wrap>
            <v-flex shrink xs12 sm4 md2 xl1 v-for="(transaction, i) in transactionsSorted" :key="transaction.id">
                <entity-tile
                    :entity="transaction"
                    :type="TRANSACTION"
                    @showDetails="showDetails(transaction, i)">
                </entity-tile>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import {
        TRANSACTIONS_NAMESPACE,
        LOAD,
        SHOW_DETAILS,
        DETAILS_NEXT,
        TRANSACTION,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Transactions',
        data: () => ({
            detailedTransactionIndex: null,
            
            TRANSACTION
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const transaction = this.transactions[this.detailedTransactionIndex + shiftSize]
                if (transaction)
                    this.showDetails(transaction, this.detailedTransactionIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        methods: {
            load () {
                this.$store.dispatch(TRANSACTIONS_NAMESPACE + LOAD)
            },
            showDetails (transaction, i) {
                this.detailedTransactionIndex = i
                EventBus.$emit(SHOW_DETAILS, {
                    type: TRANSACTION,
                    data: transaction,
                })
            }
        },
        computed: {
            ...mapGetters(TRANSACTIONS_NAMESPACE, ['transactions']),
            transactionsSorted () {
                return this.transactions.sort((a, b) => a.num - b.num)
            },
        },
        components: {
            EntityTile,
        }
    }
</script>
