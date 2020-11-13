import {
    SIGNER,
    SIGNERS_NAMESPACE,
    TXN_FAMILY,
    TXN_FAMILIES_NAMESPACE,
    TRANSACTION,
    TRANSACTIONS_NAMESPACE,
    BLOCK,
    BLOCKS_NAMESPACE,
    STATE_ELEMENT,
    STATE_ELEMENTS_NAMESPACE,
    DECODING_RULE,
    ACCOUNT,
    ACCOUNTS_NAMESPACE,
    CUSTOM_MENU_ITEM,
    MENU_ITEM_DETAILS_FIELD,
    CUSTOM_ENTITY,

    SIGNERS,
    TXN_FAMILIES,
    BLOCKS,
    TRANSACTIONS,
    STATE_ELEMENTS,

    BLOCKS_FILTERS_COMPONENT,
    SIGNERS_FILTERS_COMPONENT,
    TXN_FAMILIES_FILTERS_COMPONENT,
    TRANSACTIONS_FILTERS_COMPONENT,
    STATE_ELEMENTS_FILTERS_COMPONENT,

    DATA_BYTE,
    ADDRESS_SLICE,
} from '@/store/constants'
import {
    BLOCKS_PATH,
    SIGNERS_PATH,
    TXN_FAMILIES_PATH,
    TRANSACTIONS_PATH,
    STATE_PATH,
} from '@/router/constants'
import { rules } from '@/lib/validation-rules'

export const typeToStoreNamespace = {
    [TRANSACTION]: TRANSACTIONS_NAMESPACE,
    [BLOCK]: BLOCKS_NAMESPACE,
    [SIGNER]: SIGNERS_NAMESPACE,
    [TXN_FAMILY]: TXN_FAMILIES_NAMESPACE,
    [STATE_ELEMENT]: STATE_ELEMENTS_NAMESPACE,
    [ACCOUNT]: ACCOUNTS_NAMESPACE,
}

export const tilesConfig = {
    [TXN_FAMILY]: {
        title: 'addressPrefix',
        subTitle: 'label',
    },
    [SIGNER]: {
        avatar: 'publicKey',
        title: 'label'
    },
    [BLOCK]: {
        avatar: 'id',
        title: 'id',
    },
    [TRANSACTION]: {
        avatar: 'id',
        title: 'payload'
    },
    [STATE_ELEMENT]: {
        avatar: 'address',
        title: 'data'
    },
    [DECODING_RULE]: {
        avatar: 'hash',
        title: 'protoName'
    },
    [ACCOUNT]: {
        avatar: 'hash',
        title: 'username'
    },
    [CUSTOM_MENU_ITEM]: {
        title: 'label'
    },
    [MENU_ITEM_DETAILS_FIELD]: {
        avatar: 'pathHash',
        title: 'label'
    },
    [CUSTOM_ENTITY]: {
        avatar: 'avatar',
        title: 'label'
    }
}

/**
 * Keys of the dict below correspond to possible details dialog types.
 * Values are configs on displaying those dialogs' content.
 * 'title' is just what's in the hat of the dialog.
 * 'detailsFields' correspond to rows of the dialog. Each has a label and one of the following config-sets
 * 1) 'entityFieldName' specified indicates that this is "raw" row and
 *     only detailed entities' field's value should be displayed next to the label.
 * 2) 'slotConfig' specified means that it's one of the slots passed to the
 *     detailed dialogs should be displayed next to this label. What slots are
 *     passed to a particular detail dialog is defined by simply taking all
 *    'slotConfig' fields for the current detailed dialog type.
 *    'slotConfig' necessarily has 'tagName'. It corresponds to the 'name' field
 *     of one of the components imported to DialogsManager.vue.
 *    'slotConfig' may have 'detailsType' which, among other,
 *     used for deciding details dialog of which type
 *     should be shown when clicking on that slot. Not all slots assume their data can be detailed.
 *    'slotConfig' necessarily have either 'propNameToEntityField' or 'propNameToStoreSearchConfig'.
 *    'propNameToEntityField' sets up in what props values of which fields of the detailed entity
 *     should be passed to this slot.
 *    'propNameToStoreSearchConfig' maps a propName (to pass to the slot) to a config
 *     to search for the passed entity in vuex store. This config necessarily have
 *    'storeGetterName' and 'storeWhereQuery' fields. The first one is just the getter name
 *     of root (index.js) store module. 'storeWhereQuery' must be a .trim()'med string
 *     with exactly 2 spaces deviding 3 query components:
 *     a store entity field name, a comparison operator and a detailed entity field name.
 *     What exactly 'comparison operator' means could be seen in @/lib/common.js
 */

export const entityNameToConfig = {
    [BLOCK]: {
        title: 'Block',
        detailsFields: [{
            label: 'Id',
            entityFieldName: 'id',
        }, {
            label: 'Number',
            entityFieldName: 'num',
        }, {
            label: 'Previous Block',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: BLOCK,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: BLOCKS,
                        storeWhereQuery: 'id == previousBlockId'
                    }
                },
            }
        }, {
            label: 'State Hash',
            entityFieldName: 'stateHash',
        }, {
            label: 'Signer',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: SIGNER,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: SIGNERS,
                        storeWhereQuery: 'publicKey == signerPublicKey'
                    }
                },
            }
        }, {
            label: 'Transactions',
            slotConfig: {
                tagName: 'entities-list',
                detailsType: TRANSACTION,
                propNameToStoreSearchConfig: {
                    entities: {
                        storeGetterName: TRANSACTIONS,
                        storeWhereQuery: 'blockId == id',
                        multiple: true,
                    }
                },
            }
        }, {
            label: 'State Elements',
            slotConfig: {
                tagName: 'entities-list',
                detailsType: STATE_ELEMENT,
                propNameToStoreSearchConfig: {
                    entities: {
                        storeGetterName: STATE_ELEMENTS,
                        storeWhereQuery: 'blockId == id',
                        multiple: true,
                    }
                },
            }
        }],
    },
    [TRANSACTION]: {
        title: 'Transaction',
        detailsFields: [{
            label: 'Id',
            entityFieldName: 'id',
        }, {
            label: 'Batch Id',
            entityFieldName: 'batchId',
        }, {
            label: 'Payload',
            slotConfig: {
                tagName: 'payload-section',
                propNameToEntityField: {
                    raw: 'payload',
                    json: 'payloadDecoded'
                },
            }
        }, {
            label: 'Block',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: BLOCK,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: BLOCKS,
                        storeWhereQuery: 'id == blockId'
                    }
                },
            }
        }, {
            label: 'Signer',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: SIGNER,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: SIGNERS,
                        storeWhereQuery: 'publicKey == signerPublicKey'
                    }
                },
            }
        }]
    },
    [STATE_ELEMENT]: {
        title: 'State Element',
        detailsFields: [{
            label: 'Address',
            entityFieldName: 'address',
        }, {
            label: 'Data',
            slotConfig: {
                tagName: 'payload-section',
                propNameToEntityField: {
                    raw: 'data',
                    json: 'decodedData',
                },
            },
        }, {
            label: 'Created At',
            entityFieldName: 'createdAt',
        }, {
            label: 'Block',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: BLOCK,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: BLOCKS,
                        storeWhereQuery: 'id == blockId',
                    }
                },
            },
        }, {
            label: 'Transaction Family',
            slotConfig: {
                tagName: 'entity-tile',
                detailsType: TXN_FAMILY,
                propNameToStoreSearchConfig: {
                    entity: {
                        storeGetterName: TXN_FAMILIES,
                        storeWhereQuery: 'addressPrefix == addressPrefix',
                    },
                },
            },
        }],
    },
    [SIGNER]: {
        title: 'Signer',
        detailsFields: [{
            label: 'Public Key',
            entityFieldName: 'publicKey'
        }, {
            label: 'Label',
            entityFieldName: 'label'
        }, {
            label: 'Transactions Signed',
            slotConfig: {
                tagName: 'entities-list',
                detailsType: TRANSACTION,
                propNameToStoreSearchConfig: {
                    entities: {
                        storeGetterName: TRANSACTIONS,
                        storeWhereQuery: 'signerPublicKey == publicKey',
                        multiple: true,
                    },
                },
            }
        }, {
            label: 'Blocks Signed',
            slotConfig: {
                tagName: 'entities-list',
                detailsType: BLOCK,
                propNameToStoreSearchConfig: {
                    entities: {
                        storeGetterName: BLOCKS,
                        storeWhereQuery: 'signerPublicKey == publicKey',
                        multiple: true,
                    },
                },
            }
        }],
        editableFields: [{
            entityFieldName: 'label',
            rules: [rules.required, rules.minLength(4)]
        }],
    },
    [TXN_FAMILY]: {
        title: 'Transaction Family',
        detailsFields: [{
            label: 'Address Prefix',
            entityFieldName: 'addressPrefix'
        }, {
            label: 'Label',
            entityFieldName: 'label'
        }],
        editableFields: [{
            entityFieldName: 'label',
            rules: [rules.required, rules.minLength(4)]
        }],
    },
    [ACCOUNT]: {
        title: 'Account',
        detailsFields: [{
            label: 'Id',
            entityFieldName: 'id'
        }, {
            label: 'Username',
            entityFieldName: 'username'
        }, {
            label: 'Is Admin',
            entityFieldName: 'isAdmin'
        }],
        editableFields: [{
            switch: true,
            entityFieldName: 'isAdmin'
        }],
    },
}

export const entityNameToAddConfig = {
    [ACCOUNT]: {
        title: 'Account',
        fields: [{
            label: 'Username',
            entityFieldName: 'username',
        }, {
            label: 'Password',
            entityFieldName: 'password',
        }, {
            switch: true,
            label: 'Is Admin',
            entityFieldName: 'isAdmin',
        }]
    },
}
    
export const routePathToFiltersComponent = {
    [BLOCKS_PATH]: BLOCKS_FILTERS_COMPONENT,
    [SIGNERS_PATH]: SIGNERS_FILTERS_COMPONENT,
    [TXN_FAMILIES_PATH]: TXN_FAMILIES_FILTERS_COMPONENT,
    [TRANSACTIONS_PATH]: TRANSACTIONS_FILTERS_COMPONENT,
    [STATE_PATH]: STATE_ELEMENTS_FILTERS_COMPONENT,
}

export const routePathToStoreNamespace = {
    [TRANSACTIONS_PATH]: TRANSACTIONS_NAMESPACE,
    [BLOCKS_PATH]: BLOCKS_NAMESPACE,
    [SIGNERS_PATH]: SIGNERS_NAMESPACE,
    [TXN_FAMILIES_PATH]: TXN_FAMILIES_NAMESPACE,
    [STATE_PATH]: STATE_ELEMENTS_NAMESPACE,
}

export const protoRulesConfig = {
    [ADDRESS_SLICE]: {
        number: 0,
        label: 'Address Slice Matching'
    },
    [DATA_BYTE]: {
        number: 1,
        label: 'Data Byte Matching'
    },
}
