<template>
    <v-flex>
        <v-text-field
            label="Protobuf Files"
            @click="pickFiles"
            v-model="fileNames"
            prepend-icon="attach_file">
        </v-text-field>
        <input
            type="file"
            id="files"
            style="display: none"
            ref="filesInput"
            accept=".proto"
            multiple
            @change="handleFilesChanged" />
    </v-flex>
</template>

<script>
    export default {
        name: 'files-uploader',
        data: () => ({
            files: null,
        }),
        props: {
            txnFamilyLabel: {
                type: String,
                required: true
            },
            shownFileNames: {
                type: Array,
                default: null
            },
        },
        methods: {
            handleFilesChanged () {
                this.files = this.$refs.filesInput.files
                this.$emit('filesChanged', this.files)
            },
            pickFiles () {
                this.$refs.filesInput.click()
            },
        },
        computed: {
            fileNames () {
                if (!Array.isArray(this.shownFileNames))
                    return null
                return this.shownFileNames.join(', ')
            }
        }
    }
</script>

<style scoped>
</style>
