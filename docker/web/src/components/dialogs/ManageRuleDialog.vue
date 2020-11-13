<template>
    <v-dialog persistent v-model="shown" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{isEditMode ? 'Edit' : 'Add'}} Rule</span>
            </v-card-title>
            <v-card-text>
                <rule-form
                    v-if="modifiedRule"
                    :key="ruleIndex"
                    :rule="modifiedRule"
                    :txnFamilyPrefix="txnFamilyPrefix"
                    @ruleChanged="modifyRule">
                </rule-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="apply" :disabled="isRuleUnchanged">{{isEditMode ? 'Apply' : 'Add'}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { EventBus } from '@/lib/event-bus'
    import RuleForm from '@/components/RuleForm.vue'

    export default {
        name: 'manage-rule-dialog',
        data: () => ({
            modifiedRule: null
        }),
        props: {
            shown: {
                type: Boolean,
                required: true,
            },
            rule: {
                type: Object,
                required: true,
            },
            ruleIndex: {
                type: Number,
                required: true,
            },
            txnFamilyPrefix: {
                type: String,
                required: true,
            }
        },
        methods: {
            modifyRule (rule) {
                this.modifiedRule = rule
            },
            apply () {
                this.$emit('ruleChanged', {index: this.ruleIndex, rule: this.modifiedRule})
                this.close()
            },
            close () {
                this.$emit('close')
            },
            isAnyRuleFieldChanged (fieldNames) {
                return !!fieldNames.find(name => this.rule[name] !== this.modifiedRule[name])
            },
        },
        mounted () {
            this.modifyRule(this.rule)
        },
        watch: {
            shown () {
                if (!this.shown)
                    this.modifiedRule = null
            },
            rule () {
                this.modifyRule(this.rule)
            }
        },
        computed: {
            isEditMode () {
                return !!this.rule.protoName
            },
            isRuleUnchanged () {
                if (!this.modifiedRule)
                    return true
                // if even no protoName -- newly created rule
                if (!this.rule.protoName && this.modifiedRule.protoName)
                    return false
                if (!this.rule.minMax)
                    return true
                const minMaxChanged = this.rule.minMax.length == 2 &&
                                      ( this.modifiedRule.minMax.length != 2 ||
                                        this.rule.minMax[0] != this.modifiedRule.minMax[0] ||
                                        this.rule.minMax[1] != this.modifiedRule.minMax[1] )
                if (minMaxChanged || this.isAnyRuleFieldChanged(['protoName', 'type']))
                    return false
                if (this.rule.type === 0) {
                    if (this.isAnyRuleFieldChanged(['begin', 'end', 'regEx']))
                        return false
                } else if (this.rule.type === 1) {
                    if (this.isAnyRuleFieldChanged(['byteIndex']))
                        return false
                }
                return true
            }
        },
        components: {
            RuleForm,
        }
    }
</script>

<style scoped>
    .subheading {
        overflow-wrap: break-word;
    }
</style>