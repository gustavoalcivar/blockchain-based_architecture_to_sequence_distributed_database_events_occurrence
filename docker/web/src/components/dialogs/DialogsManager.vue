<template>
    <div>
        <!-- Some of the following dialogs are
            made visible by a SHOW_* event,
            their props are computed from
            display-config.js and event-passed data -->
        <details-dialog
            :title="details.title"
            :shown="detailsShown"
            :displayedFields="details.displayedFields"
            :detailsType="details.type"
            :detailedEntity="details.data"
            :changeable="datailedDataChangeable"
            @close="closeDetails">
                <template v-if="detailsShown">
                    <!-- Either entity-tile or entities-list or payload-section now,
                        depending on what is detailed right now
                        (i.e. what details.slots it has) -->
                    <component
                        v-for="slot in details.slots"
                        :key="slot.id"
                        :is="slot.tagName"
                        :slot="slot.name"
                        :type="slot.detailsType"
                        v-bind="slot.props"
                        @showDetails="showDetails({
                            type: slot.detailsType,
                            data: $event,
                        })">
                    </component>
                </template>
        </details-dialog>
        <edit-dialog
            :title="editData.title"
            :type="editData.type"
            :shown="editShown"
            :data="editData.editedEntity"
            :uneditableFields="editData.uneditableFields"
            :editableFields="editData.editableFields"
            @close="closeEdit"
            @edit="editEntity">
        </edit-dialog>
        <filters-dialog
            :shown="filtersShown"
            @close="filtersShown = false">
        </filters-dialog>
        <add-dialog
            :shown="addShown"
            :title="addData.title"
            :fields="addData.fields"
            @add="addEntity({type: addData.type, entity: $event})"
            @close="addShown = false">
        </add-dialog>
    </div>
</template>

<script>
    import DetailsDialog from './DetailsDialog'
    import EditDialog from './EditDialog'
    import FiltersDialog from './FiltersDialog'
    import AddDialog from './AddDialog'
    import EntityTile from '@/components/EntityTile'
    import EntitiesList from '@/components/EntitiesList'
    import PayloadSection from '@/components/PayloadSection'

    import { EventBus } from '@/lib/event-bus'
    import {
        SHOW_DETAILS,
        SHOW_EDIT,
        SHOW_ADD,
        SHOW_FILTERS,
        SIGNERS_NAMESPACE,
        TXN_FAMILIES_NAMESPACE,
        BLOCKS_NAMESPACE,
        BLOCK,
        INITIAL_BLOCK_ID,
        TRANSACTIONS_NAMESPACE,
        STATE_ELEMENTS_NAMESPACE,
        STATE_ELEMENT,
        SIGNER,
        TXN_FAMILY,
        ADD,
        EDIT,
        SIGNERS,
        TXN_FAMILIES,
        BLOCKS,
        TRANSACTIONS,
        STATE_ELEMENTS,
        FETCH_PROP_VALUE,
    } from '@/store/constants'
    import {
        entityNameToConfig,
        entityNameToAddConfig,
        typeToStoreNamespace,
    } from '@/lib/display-config'
    import { isEmptyValue } from '@/lib/common'

    export default {
        name: 'dialogs',
        data: () => ({
            lastSlotId: 0,
            detailsShown: false,
            editShown: false,
            addShown: false,
            filtersShown: false,

            details: {
                title: 'Unknown',
                displayedFields: [],
                data: {},
                slots: [],
                type: ''
            },
            datailedDataChangeable: false,

            editData: {
                title: 'Unknown',
                type: '',
                editedEntity: {},
                uneditableFields: [],
                editableFields: [],
            },

            addData: {
                title: 'Unknown',
                fields: [],
            },
        }),
        mounted () {
            EventBus.$on(SHOW_DETAILS, this.showDetails)
            EventBus.$on(SHOW_EDIT, this.showEdit)
            EventBus.$on(SHOW_ADD, this.showAdd)
            EventBus.$on(SHOW_FILTERS, () => {
                this.filtersShown = true
            })
        },
        methods: {
            /*
             * Options:
             *   type  -- string like "TRANSACTION", "BLOCK", "SIGNER", "TXN_FAMILY",
             *            initially passed as constant imported from @/store/constants
             *   data  -- for type == "SIGNER" just a signer object
             */
            showDetails ({type, data}) {
                // filling title, type, data
                this.details.title = entityNameToConfig[type].title
                this.details.type = type
                this.details.data = data
                // helper flag
                this.datailedDataChangeable = !!entityNameToConfig[type].editableFields
                // refilling this.details.displayedFields and ..slots
                this.details.displayedFields.splice(0, this.details.displayedFields.length)
                this.details.slots.splice(0, this.details.slots.length)
                // creating 2 references:
                const displayedFields = this.details.displayedFields
                const slots = this.details.slots
                entityNameToConfig[type].detailsFields.forEach(async (field, i) => {
                    const displayedField = { label: field.label }
                    let fieldShouldBeIncluded = true
                    if (field.entityFieldName) {
                        displayedField.value = data[field.entityFieldName]
                    } else if (field.slotConfig) {
                        const slotConfig = field.slotConfig
                        const slot = {
                            id: ++this.lastSlotId,
                            name: `${slotConfig.tagName}-${i}`,
                            tagName: slotConfig.tagName,
                            detailsType: slotConfig.detailsType,
                            props: {},
                        }
                        displayedField.slotName = slot.name
                        displayedField.tagName = slot.tagName
                        displayedField.detailsType = slot.detailsType
                        // filling slot's props
                        let slotHasData = false
                        if (slotConfig.propNameToEntityField) {
                            for (const propName in slotConfig.propNameToEntityField) {
                                const entityFieldName = slotConfig.propNameToEntityField[propName]
                                slot.props[propName] = data[entityFieldName]
                                slotHasData = slotHasData || !isEmptyValue(slot.props[propName])
                            }
                        } else if (slotConfig.propNameToStoreSearchConfig) {
                            for (const propName in slotConfig.propNameToStoreSearchConfig) {
                                const searchConfig = slotConfig.propNameToStoreSearchConfig[propName]
                                const propValue = await this.$store.dispatch(
                                    FETCH_PROP_VALUE,
                                    {
                                        searchedEntityStoreNameSpace: typeToStoreNamespace[slotConfig.detailsType],
                                        searchConfig,
                                        data,
                                    }
                                )
                                if ([BLOCK, STATE_ELEMENT].includes(type) && propValue.id === INITIAL_BLOCK_ID)
                                    continue
                                slot.props[propName] = propValue
                                slotHasData = slotHasData || !isEmptyValue(slot.props[propName])
                            }
                        }
                        if (slotHasData)
                            slots.push(slot)
                        fieldShouldBeIncluded = slotHasData
                    }
                    if (fieldShouldBeIncluded)
                        displayedFields.push(displayedField)
                })
                // showing
                this.detailsShown = true
            },
            showEdit ({type, data}) {
                const config = entityNameToConfig[type]
                // filling title, type, editedEntity
                this.editData.title = `Edit ${config.title}`
                this.editData.type = type
                this.editData.editedEntity = data
                // refilling editableFields and uneditableFields
                this.editData.editableFields.splice(0, this.editData.editableFields.length)
                this.editData.uneditableFields.splice(0, this.editData.uneditableFields.length)
                config.detailsFields.forEach(field => {
                    if (field.entityFieldName) {
                        const editableField = config.editableFields.find(
                            editableField => editableField.entityFieldName == field.entityFieldName)
                        // it's by ref. to fill either one or the other
                        const accordingFieldsArray = this.editData[
                            editableField ? 'editableFields' : 'uneditableFields'
                        ]
                        accordingFieldsArray.push({
                            label: field.label,
                            name: field.entityFieldName,
                            switch: editableField ? editableField.switch : null,
                            rules: editableField ? editableField.rules : null,
                        })
                    }
                })
                this.editShown = true
            },
            showAdd ({type}) {
                const config = entityNameToAddConfig[type]
                this.addData.title = "Add " + config.title
                this.addData.fields = config.fields
                this.addData.type = type
                this.addShown = true
            },
            closeDetails () {
                this.detailsShown = false
            },
            closeEdit () {
                this.editShown = false
            },
            editEntity ({type, entity}) {
                this.$store
                    .dispatch(typeToStoreNamespace[type] + EDIT, entity)
                    .then(this.closeDetails)
                    .catch(error => {
                        this.closeDetails()
                        throw error
                    })
            },
            addEntity ({type, entity}) {
                this.$store
                    .dispatch(typeToStoreNamespace[type] + ADD, entity)
                    .then(this.closeDetails)
                    .catch(error => {
                        this.closeDetails()
                        throw error
                    })
            },
        },
        beforeDestroy () {
            [SHOW_DETAILS,
            SHOW_EDIT,
            SHOW_ADD,
            SHOW_FILTERS].forEach(event => {
                EventBus.$off(event)
            })
        },
        components: {
            DetailsDialog,
            EditDialog,
            FiltersDialog,
            AddDialog,
            EntityTile,
            EntitiesList,
            PayloadSection,
        }
    }
</script>
