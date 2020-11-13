<template>
    <v-container fluid pa-5 grid-list-xl>
        <v-layout wrap>
            <v-flex shrink xs12 sm4 md2 xl1 v-for="(stateElement, i) in stateElementsSorted"
                    :key="stateElement.address + stateElement.blockId">
                <entity-tile
                    :entity="stateElement"
                    :type="STATE_ELEMENT"
                    @showDetails="showDetails(stateElement, i)">
                </entity-tile>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'

    import {
        STATE_ELEMENT,
        STATE_ELEMENTS_NAMESPACE,
        LOAD,
        SHOW_DETAILS,
        DETAILS_NEXT,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'StateElements',
        data: () => ({
            detailedStateElementIndex: null,

            STATE_ELEMENT
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const stateElement = this.stateElements[this.detailedStateElementIndex + shiftSize]
                if (stateElement)
                    this.showDetails(stateElement, this.detailedStateElementIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        methods: {
            load () {
                this.$store.dispatch(STATE_ELEMENTS_NAMESPACE+ LOAD)
            },
            showDetails (stateElement, i) {
                this.detailedStateElementIndex = i
                EventBus.$emit(SHOW_DETAILS, {
                    type: STATE_ELEMENT,
                    data: stateElement
                })
            },
        },
        computed: {
            ...mapGetters(STATE_ELEMENTS_NAMESPACE, ['stateElements']),
            stateElementsSorted () {
                return this.stateElements.sort((a, b) => a.num - b.num)
            },
        },
        components: {
            EntityTile,
        }
    }
</script>
