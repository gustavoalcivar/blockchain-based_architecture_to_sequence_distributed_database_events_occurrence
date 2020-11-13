<template>
    <v-list>
        <v-flex
            v-for="entity in entities"
            pb-2 :key="entity._id">
            <entity-tile
                :entity="entity"
                :type="type"
                @showDetails="showDetails">
            </entity-tile>
        </v-flex>
    </v-list>
</template>

<script>
    import EntityTile from './EntityTile'

    export default {
        name: 'entities-list',
        data: () => ({ }),
        props: {
            entities: {
                type: Array,
                default: () => ([ ])
            },
            type: {
                type: String,
                required: true
            }
        },
        methods: {
            showDetails (eventData) {
                this.$emit('showDetails', eventData)
            }
        },
        components: {
            EntityTile
        }
    }
</script>

<style scoped>

</style>
