<template>
    <v-container fluid pa-5 grid-list-xl>
        <custom-entity-details-dialog
            :shown="detailsDialogShown"
            :entity="detailedEntity"
            :detailsFields="customMenuItem.detailsFields"
            @close="detailsDialogShown = false">
        </custom-entity-details-dialog>
        <v-layout wrap>
            <v-flex shrink xs12 sm6 md4 lg2 v-for="(customEntity, i) in customEntities" :key="customEntity.id">
                <entity-tile
                    :entity="customEntity"
                    :type="CUSTOM_ENTITY"
                    @showDetails="showDetails(customEntity, i)">
                </entity-tile>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import objectPath from 'object-path'

    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import CustomEntityDetailsDialog from '@/components/dialogs/CustomEntityDetailsDialog'
    import {
        CUSTOM_ENTITY,
        DETAILS_NEXT,
        MENU_NAMESPACE,
        STATE_ELEMENTS_NAMESPACE,
        PROTO_NAMESPACE,
        MAP_TO_PROTO_NAMES,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'CustomEntity',
        data: () => ({
            detailedCustomEntityIndex: null,
            customEntities: [],
            detailsDialogShown: false,
            detailedEntity: null,

            CUSTOM_ENTITY,
        }),
        mounted () {
            this.loadCustomEntities()
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const customEntity = this.customEntities[this.detailedCustomEntityIndex + shiftSize]
                if (customEntity)
                    this.showDetails(customEntity, this.detailedCustomEntityIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        methods: {
            showDetails (customEntity, i) {
                this.detailedCustomEntityIndex = i
                this.detailedEntity = customEntity.decodedData
                this.detailsDialogShown = true
            },
            async loadCustomEntities () {
                // same order Strings (proto names) as stateElements
                const protoNames = await this.$store.dispatch(
                    PROTO_NAMESPACE + MAP_TO_PROTO_NAMES,
                    {stateElements: this.stateElements})
                this.customEntities = this.stateElements
                    .filter((_, i) => protoNames[i] == this.customMenuItem.protoMessage)
                    .map(stateElement => {
                        const avatar = objectPath.get(stateElement.decodedData, this.customMenuItem.tileAvatarPath)
                        const label = objectPath.get(stateElement.decodedData, this.customMenuItem.tileLabelPath)
                        return Object.assign(stateElement, {avatar, label})
                    })
            }
        },
        computed: {
            ...mapGetters(MENU_NAMESPACE, ['customMenuItems']),
            ...mapGetters(STATE_ELEMENTS_NAMESPACE, ['stateElements']),
            customMenuItem () {
                return this.customMenuItems.find(item => item.id == this.$route.params.customMenuItemId)
            },
        },
        watch: {
            '$route.params.customMenuItemId' () {
                this.loadCustomEntities()
            }
        },
        components: {
            EntityTile,
            CustomEntityDetailsDialog,
        }
    }
</script>
