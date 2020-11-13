import {
    TXN_FAMILIES_NAMESPACE,
    TRANSACTIONS_NAMESPACE,
    SIGNERS_NAMESPACE,
    BLOCKS_NAMESPACE,
    STATE_ELEMENTS_NAMESPACE
} from "@/store/constants";

export default {
    LOCAL_STORAGE: {
        userToken: {
            type: String,
            default: null
        },
        username: {
            type: String,
            default: null
        },
        transactions: {
            type: Array,
            default: []
        },
        txnFamilies: {
            type: Array,
            default: []
        },
        signers: {
            type: Array,
            default: []
        },
        blocks: {
            type: Array,
            default: []
        },
        stateElements: {
            type: Array,
            default: []
        },
        accounts: {
            type: Array,
            default: []
        },
        customMenuItems: {
            type: Array,
            default: []
        },
        [`${TRANSACTIONS_NAMESPACE}query`]: {
            type: Object,
            default: {}
        },
        [`${TXN_FAMILIES_NAMESPACE}query`]: {
            type: Object,
            default: {}
        },
        [`${SIGNERS_NAMESPACE}query`]: {
            type: Object,
            default: {}
        },
        [`${BLOCKS_NAMESPACE}query`]: {
            type: Object,
            default: {}
        },
        [`${STATE_ELEMENTS_NAMESPACE}query`]: {
            type: Object,
            default: {}
        },
        txnFamilyPrefixToSettings: {
            type: Object,
            default: {}
        },
        protoMessages: {
            type: Array,
            default: []
        },
        txnFamilyPrefixToRulesConfig: {
            type: Object,
            default: {}
        },
        txnFamilyPrefixToFileNames: {
            type: Object,
            default: {}
        },
        settings: {
            type: Object,
            default: {}
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        customMenuItems: {
            type: Array,
            default: []
        },
    }
}