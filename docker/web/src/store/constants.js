// vuex store events
export const AUTH_NAMESPACE = 'auth/'
export const SIGNERS_NAMESPACE = 'signers/'
export const TXN_FAMILIES_NAMESPACE = 'txnFamilies/'
export const BLOCKS_NAMESPACE = 'blocks/'
export const STATE_ELEMENTS_NAMESPACE = 'stateElements/'
export const TRANSACTIONS_NAMESPACE = 'transactions/'
export const PROTO_NAMESPACE = 'proto/'
export const ACCOUNTS_NAMESPACE = 'accounts/'
export const SETTINGS_NAMESPACE = 'settings/'
export const MENU_NAMESPACE = 'menu/'

export const LOGIN = 'LOGIN'
export const REGISTER = 'REGISTER'
export const SUCCESS = 'SUCCESS'
export const ERROR = 'ERROR'
export const LOGOUT = 'LOGOUT'
export const LOAD = 'LOAD'
export const UPLOAD = 'UPLOAD'
export const DECODE = 'DECODE'
export const ADD = 'ADD'
export const EDIT = 'EDIT'
export const UPDATE_QUERY = 'UPDATE_QUERY'
export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const SAVE_RULES = 'SAVE_RULES'
export const FETCH_PROP_VALUE = 'FETCH_PROP_VALUE'
export const SET = 'SET'

// proto decoding rules' types
export const ADDRESS_SLICE = 'ADDRESS_SLICE'
export const DATA_BYTE = 'DATA_BYTE'

// event-bus.js events
export const SNACKBAR = 'SNACKBAR'

export const SHOW_DETAILS = 'SHOW_DETAILS'
export const DETAILS_NEXT = 'DETAILS_NEXT'
export const SHOW_EDIT = 'SHOW_EDIT'
export const SHOW_ADD = 'SHOW_ADD'
export const SHOW_FILTERS = 'SHOW_FILTERS'
export const RESET_FILTERS = 'RESET_FILTERS'

// entities types for SHOW_DETAILS
export const TRANSACTION = 'TRANSACTION'
export const BLOCK = 'BLOCK'
export const STATE_ELEMENT = 'STATE_ELEMENT'
export const SIGNER = 'SIGNER'
export const TXN_FAMILY = 'TXN_FAMILY'
export const CUSTOM_MENU_ITEM = 'CUSTOM_MENU_ITEM'
export const MENU_ITEM_DETAILS_FIELD = 'MENU_ITEM_DETAILS_FIELD'
export const CUSTOM_ENTITY = 'CUSTOM_ENTITY'

export const INITIAL_BLOCK_ID = '0000000000000000'

// other entities types
export const DECODING_RULE = 'DECODING_RULE'
export const ACCOUNT = 'ACCOUNT'

// store getters names
export const SIGNERS = 'signers'
export const TXN_FAMILIES = 'txnFamilies'
export const BLOCKS = 'blocks'
export const TRANSACTIONS = 'transactions'
export const STATE_ELEMENTS = 'stateElements'
export const PROTO_TO_DECODER = 'protoToDecoder'
export const ACCOUNTS = 'accounts'
export const SETTINGS = 'settings'
export const CUSTOM_MENU_ITEMS = 'customMenuItems'
export const TXN_FAMILY_PREFIX_TO_PROTO_MESSAGES = 'txnFamilyPrefixToProtoMessages'
export const TXN_FAMILY_PREFIX_TO_RULES_CONFIG = 'txnFamilyPrefixToRulesConfig'
export const TXN_FAMILY_PREFIX_TO_FILE_NAMES = 'txnFamilyPrefixToFileNames'
export const TXN_FAMILY_PREFIX_TO_SETTING = 'txnFamilyPrefixToSettings'

// filters' components' names
export const BLOCKS_FILTERS_COMPONENT = 'blocks-filters'
export const SIGNERS_FILTERS_COMPONENT = 'signers-filters'
export const TXN_FAMILIES_FILTERS_COMPONENT = 'txn-families-filters'
export const TRANSACTIONS_FILTERS_COMPONENT = 'transactions-filters'
export const STATE_ELEMENTS_FILTERS_COMPONENT = 'state-elements-filters'

// userd in store/proto.js DECODE action
export const ENCODING_TYPES = {
    NONE: 'NONE',
    PROTO: 'PROTO',
    CBOR: 'CBOR',
}
