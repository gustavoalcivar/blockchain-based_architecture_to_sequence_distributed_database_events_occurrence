<template>
    <v-container fluid pa-5 grid-list-xl>
        <v-layout wrap>
            <v-flex shrink xs12 sm6 md4 lg2 v-for="(signer, i) in signers" :key="signer.publicKey">
                <entity-tile
                    :entity="signer"
                    :type="SIGNER"
                    @showDetails="showDetails(signer, i)">
                </entity-tile>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import {
        SIGNER,
        SIGNERS_NAMESPACE,
        LOAD, ADD,
        SHOW_DETAILS,
        DETAILS_NEXT,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Signers',
        data: () => ({
            detailedSignerIndex: null,
            
            SIGNER
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const signer = this.signers[this.detailedSignerIndex + shiftSize]
                if (signer)
                    this.showDetails(signer, this.detailedSignerIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        computed: {
            ...mapGetters(SIGNERS_NAMESPACE, ['signers'])
        },
        methods: {
            load () {
                this.$store.dispatch(SIGNERS_NAMESPACE + LOAD)
            },
            showDetails (signer, i) {
                this.detailedSignerIndex = i
                EventBus.$emit(SHOW_DETAILS, {
                    type: SIGNER,
                    data: signer
                })
            },
        },
        components: {
            EntityTile,
        }
    }
</script>
