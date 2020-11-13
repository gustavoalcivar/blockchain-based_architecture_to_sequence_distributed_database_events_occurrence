<template>
    <div>
        <v-select
            :items="protoMessages"
            v-model="protoName"
            :label="'Proto Message'"
            @change="updateRule({protoName})">
        </v-select>
        <v-select
            v-show="fillingStep >= 1"
            :items="ruleTypes"
            :item-text="'label'"
            :item-value="'number'"
            v-model="ruleType"
            :label="'Rule Type'"
            @change="ruleTypeChanged">
        </v-select>
        <div v-show="fillingStep >= 2 && ruleTypeCode == ADDRESS_SLICE">
            <v-select
                :items="matchingMethods"
                :item-text="'label'"
                :item-value="'type'"
                :label="'Matching Method'"
                v-model="matchingMethodType"
                @change="cleanRuleParams">
            </v-select>
            <div v-if="matchingMethodType && matchingMethod.type == DECIMAL_BOUNDING">
                <v-layout wrap>
                    <v-flex xs3>
                        <v-text-field
                            label="Begin index"
                            :value="rule.begin"
                            @input="updateRule({begin: $event ? +$event : null})">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field
                            label="End index"
                            :value="rule.end"
                            @input="updateRule({end: $event ? +$event : null})">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field
                            label="Allowed decimal minimum"
                            :value="ruleMinMaxSafe[0]"
                            @input="minMaxChanged(0, $event)">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field
                            label="Decimal maximum"
                            :value="ruleMinMaxSafe[1]"
                            @input="minMaxChanged(1, $event)">
                        </v-text-field>
                    </v-flex>
                </v-layout>
            </div>
            <div v-if="matchingMethodType && matchingMethod.type == REGEX_MATCHING">
                <v-text-field
                    label="Regular expression"
                    :value="rule.regEx"
                    @input="updateRule({regEx: $event})">
                </v-text-field>
            </div>
        </div>
        <div v-show="fillingStep >= 2 && ruleTypeCode == DATA_BYTE">
            <v-layout>
                <v-flex xs4>
                    <v-text-field
                        label="Byte index"
                        :value="rule.byteIndex"
                        @input="updateRule({byteIndex: $event ? +$event : null})">
                    </v-text-field>
                </v-flex>
                <v-flex xs4>
                    <v-text-field
                        label="Allowed byte minimum"
                        :value="ruleMinMaxSafe[0]"
                        @input="minMaxChanged(0, $event)">
                    </v-text-field>
                </v-flex>
                <v-flex xs4>
                    <v-text-field
                        label="Byte maximum"
                        :value="ruleMinMaxSafe[1]"
                        @input="minMaxChanged(1, $event)">
                    </v-text-field>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { PROTO_NAMESPACE, ADDRESS_SLICE, DATA_BYTE } from '@/store/constants'
import { protoRulesConfig } from '@/lib/display-config'

const DECIMAL_BOUNDING = 'DECIMAL_BOUNDING'
const REGEX_MATCHING = 'REGEX_MATCHING'

export default {
    name: 'rule-form',
    data: () => ({
        matchingMethods: [{
            type: DECIMAL_BOUNDING,
            label: 'Decimal bounding'
        }, {
            type: REGEX_MATCHING,
            label: 'Regular expression matching'
        }],
        protoName: null,
        ruleType: null,
        ruleTypeCode: null,
        matchingMethodType: null,

        ADDRESS_SLICE, DATA_BYTE,
        DECIMAL_BOUNDING, REGEX_MATCHING,
    }),
    props: {
        rule: {
            type: Object,
            required: true,
        },
        txnFamilyPrefix: {
            type: String,
            required: true,
        }
    },
    watch: {
        ruleType () {
            this.ruleTypeCode = this.ruleCodes.find(
                ruleCode => protoRulesConfig[ruleCode].number == this.ruleType
            )
        },
    },
    created () {
        this.protoName = this.rule.protoName
        this.ruleType = this.rule.type
        this.refreshMatchingMethodTypeAndRuleParams()
    },
    methods: {
        updateRule (upd) {
            const changedRule = Object.assign({}, this.rule)
            for (const key in upd) {
                changedRule[key] = upd[key]
            }
            this.$emit('ruleChanged', changedRule)
        },
        ruleTypeChanged (type) {
            this.updateRule({type})
            this.matchingMethodType = null
        },
        cleanRuleParams () {
            this.updateRule({
                begin: null,
                end: null,
                regEx: null,
                byteIndex: null,
                minMax: null,
            })
        },
        minMaxChanged (i, val) {
            const normVal = val ? +val : val
            const minMax = []
            minMax[i] = normVal
            const otherIndex = (i + 1) % 2
            minMax[otherIndex] = this.ruleMinMaxSafe[otherIndex]
            this.updateRule({minMax})
        },
        refreshMatchingMethodTypeAndRuleParams () {
            let newMatchingMethodType = null
            const { begin, end, byteIndex, regEx } = this.rule
            if (this.ruleMinMaxSafe.length == 2) {
                if (begin != null && end != null || byteIndex != null) {
                    newMatchingMethodType = DECIMAL_BOUNDING
                }
            } else if (this.rule.regEx != null && this.rule.regEx.length) (
                newMatchingMethodType = REGEX_MATCHING
            )
            if (newMatchingMethodType != this.matchingMethodType)
                this.matchingMethodType = newMatchingMethodType
        },
    },
    computed: {
        ...mapGetters(PROTO_NAMESPACE, ['txnFamilyPrefixToProtoMessages']),
        protoMessages () {
            return this.txnFamilyPrefixToProtoMessages[this.txnFamilyPrefix]
        },
        ruleCodes: () => Object.keys(protoRulesConfig),
        ruleTypes: () => Object.values(protoRulesConfig),
        matchingMethod () {
            return this.matchingMethods.find(
                method => method.type == this.matchingMethodType
            )
        },
        ruleMinMaxSafe () {
            return this.rule.minMax || []
        },
        fillingStep () {
            if (!this.rule.protoName)
                return 0
            if (this.rule.type == null)
                return 1
            return 2
        }
    }
}
</script>

<style>

</style>
