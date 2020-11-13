<template>
    <v-container fluid pa-5 grid-list-xl>
        <v-layout wrap>
            <v-flex shrink xs12 sm6 md4 lg2 v-for="(txnFamily, i) in txnFamilies" :key="txnFamily.addressPrefix">
                <entity-tile
                    :entity="txnFamily"
                    :type="TXN_FAMILY"
                    @showDetails="showDetails(txnFamily, i)">
                </entity-tile>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import {
        TXN_FAMILIES_NAMESPACE,
        LOAD, ADD,
        TXN_FAMILY,
        SHOW_DETAILS,
        DETAILS_NEXT,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'TxnFamilies',
        data: () => ({
            detailedTxnFamilyIndex: null,
            
            TXN_FAMILY
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const txnFamily = this.txnFamilies[this.detailedTxnFamilyIndex + shiftSize]
                if (txnFamily)
                    this.showDetails(txnFamily, this.detailedTxnFamilyIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        computed: {
            ...mapGetters(TXN_FAMILIES_NAMESPACE, ['txnFamilies'])
        },
        methods: {
            load () {
                this.$store.dispatch(TXN_FAMILIES_NAMESPACE + LOAD)
            },
            showDetails (txnFamily, i) {
                this.detailedTxnFamilyIndex = i
                EventBus.$emit(SHOW_DETAILS, {
                    type: TXN_FAMILY,
                    data: txnFamily
                })
            },
        },
        components: {
            EntityTile,
        }
    }
</script>
