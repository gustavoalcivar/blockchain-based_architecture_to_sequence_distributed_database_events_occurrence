<template>
    <v-list-tile :avatar="!!entity[avatar]" class="tile box-shadow">
        <v-list-tile-avatar v-if="entity[avatar]" @click="clicked">
            <img :src="makeAvatar(entity[avatar])">
        </v-list-tile-avatar>
        <v-list-tile-content @click="clicked">
            <v-list-tile-title v-html="entity[title] || 'Unknown'"></v-list-tile-title>
            <v-list-tile-sub-title v-if="entity[subTitle]" v-html="entity[subTitle]"></v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="$slots.action">
            <slot name="action"></slot>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
    import makeAvatarBase64 from '@/lib/common'
    import { tilesConfig } from '@/lib/display-config'

    export default {
        name: 'entity-tile',
        data: () => ({
            
        }),
        props: {
            entity: {
                type: Object,
                default: () => ({ })
            },
            type: {
                type: String,
                required: true
            },
            clickEvent: {
                type: String,
                default: 'showDetails'
            },
        },
        computed: {
            avatar () { return tilesConfig[this.type].avatar },
            title () { return tilesConfig[this.type].title },
            subTitle () { return tilesConfig[this.type].subTitle },
        },
        methods: {
            clicked () {
                this.$emit(this.clickEvent, this.entity)
            },
            makeAvatar: makeAvatarBase64
        },
        
    }
</script>

<style scoped>
  .tile {
    cursor: pointer;
    padding: 5px 0px;
  }
</style>
