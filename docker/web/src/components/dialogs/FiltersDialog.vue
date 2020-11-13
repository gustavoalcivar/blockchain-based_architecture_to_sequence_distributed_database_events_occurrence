<template>
  <v-dialog persistent v-model="shown" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Specify Filters</span>
      </v-card-title>
      <v-card-text>
        <component v-if="filtersComponent" :is="filtersComponent" v-model="filters"></component>
        <h3 v-else class="unselectable color-grey">No filters :(</h3>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="apply">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {
    routePathToFiltersComponent,
    routePathToStoreNamespace,
  } from '@/lib/display-config'
  import {
    UPDATE_FILTERS,
    RESET_FILTERS
  } from '@/store/constants'
  import { EventBus } from '@/lib/event-bus'
  import BlocksFilters from '@/components/filters/BlocksFilters'
  import SignersFilters from '@/components/filters/SignersFilters'
  import TxnFamiliesFilters from '@/components/filters/TxnFamiliesFilters'
  import TransactionsFilters from '@/components/filters/TransactionsFilters'
  import StateElementsFilters from '@/components/filters/StateElementsFilters'

  export default {
    name: 'filters-dialog',
    data: () => ({
      filters: {},
    }),
    props: {
      shown: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      EventBus.$on(RESET_FILTERS, this.resetFilters)
    },
    computed: {
      filtersComponent () {
        return routePathToFiltersComponent[this.$route.path]
      },
      storeNamespace () {
        return routePathToStoreNamespace[this.$route.path]
      },
    },
    methods: {
      apply () {
        this.$store.dispatch(this.storeNamespace + UPDATE_FILTERS, this.filters)
        this.close()
      },
      close () {
        this.$emit('close')
      },
      resetFilters () {
        this.$store.dispatch(this.storeNamespace + UPDATE_FILTERS, {})
      }
    },
    beforeDestroy () {
      EventBus.$off(RESET_FILTERS)
    },
    components: {
      BlocksFilters,
      SignersFilters,
      TxnFamiliesFilters,
      TransactionsFilters,
      StateElementsFilters,
    },
  }
</script>

<style scoped>

</style>
