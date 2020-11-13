<template>
  <v-dialog persistent v-model="shown" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-form v-model="dataIsCorrect" ref="form">
                  <v-flex xs12 v-for="field in fields" :key="field.entityFieldName">
                    <v-switch
                      v-if="field.switch"
                      :label="field.label"
                      v-model="fieldNameToValue[field.entityFieldName]">
                    </v-switch>
                    <v-text-field
                      v-else
                      @keyup.enter="add" 
                      :label="field.label"
                      v-model="fieldNameToValue[field.entityFieldName]"
                      :rules="field.rules">
                    </v-text-field>
                  </v-flex>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="add" :disabled="!dataIsCorrect">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'add-dialog',
    data: () => ({
      fieldNameToValue: {},
      dataIsCorrect: false,
    }),
    props: {
      shown: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: true,
      },
      fields: {
        type: Array,
        required: true
      },
    },
    watch: {
      shown () {
        this.$refs.form.reset()
      },
      fields () {
        this.fieldNameToValue = {}
        this.fields.forEach(field => {
          if (field.switch)
            this.fieldNameToValue[field.entityFieldName] = false
          else
            this.fieldNameToValue[field.entityFieldName] = ''
        })
      }
    },
    methods: {
      add () {
        this.$emit('add', this.fieldNameToValue)
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
  }
</script>

<style scoped>

</style>
