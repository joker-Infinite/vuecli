<template>
    <el-table-column
            :fit="true"
            :prop="prop"
            :width="width"
            :label="label"
            :placeholder="placeholder"
            v-bind="$attrs">
        <template slot-scope="scope">

            <div class="cellWrapper" v-bind:class="{'error':!getResult(scope)}">
                <!--:style="getResult(scope)!=false?'position: relative':'margin-bottom: 20px;'"-->
                <div style="display: flex;min-height: 32px;justify-content: center">
                    <div v-if="required&&inputType!='checkbox'"
                         style="display: flex;justify-content: center;align-items: center;color: red;margin-right: 2px">
                        *
                    </div>
                    <slot :row="scope.row" :prop="prop" :$index="scope.$index">
                        <el-input v-if="inputType=='button'" placeholder="请选择" v-model="scope.row[prop]"
                                  v-bind="$attrs"
                                  :map-type-code="mapTypeCode" @change="$nextTick(()=>{valiateFiled(scope)})">
                            <i slot="suffix" class="el-icon-edit-outline el-input__icon" @click="addMessage"></i>
                        </el-input>
                        <ice-select v-if="inputType=='select'" placeholder="请选择" v-model="scope.row[prop]"
                                    v-bind="$attrs"
                                    :map-type-code="mapTypeCode" @change="$nextTick(()=>{valiateFiled(scope)})">
                        </ice-select>
                        <el-select v-if="inputType=='selectArray'" placeholder="请选择" v-model="scope.row[prop]"
                                   v-bind="$attrs"
                                   @change="$nextTick(()=>{valiateFiled(scope)})">
                            <el-option v-for="(item,index) in options"
                                       :key=index
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <el-tooltip :placement="tooltipPlacement" :effect="tooltipEffect"
                                    v-if="inputType=='input' && isTooltip">
                            <div slot="content">{{scope.row[prop]}}</div>
                            <el-input :placeholder="placeholder" v-model="scope.row[prop]"
                                      v-bind="$attrs"
                                      @blur="valiateFiled(scope)">
                            </el-input>
                        </el-tooltip>

                        <el-input v-if="inputType=='input' && !isTooltip" :placeholder="placeholder"
                                  v-model="scope.row[prop]"
                                  v-bind="$attrs"
                                  @blur="valiateFiled(scope)">
                        </el-input>

                        <el-input v-if="inputType=='inputChange'" :placeholder="placeholder" v-model="scope.row[prop]"
                                  v-bind="$attrs"
                                  @change="$nextTick(()=>{valiateFiled(scope)})">
                        </el-input>
                        <el-input-number v-if="inputType=='number'" controls-position="right" :placeholder="placeholder"
                                         v-model="scope.row[prop]" v-bind="$attrs" style="width:100% "
                                         @blur="valiateFiled(scope)" @change="valiateFiled(scope)">
                        </el-input-number>
                        <el-date-picker
                                v-bind="$attrs"
                                @blur="valiateFiled(scope)"
                                v-model="scope.row[prop]"
                                v-if="inputType=='date'"
                                :type="dateType"
                                :format="dateFormat"
                                :clearable="clearable"
                                placeholder="请选择">
                        </el-date-picker>
                        <el-checkbox v-if="inputType=='checkbox'" v-model="scope.row[prop]" v-bind="$attrs"
                                     @blur="valiateFiled(scope)">
                            {{scope.row[prop]?checkboxLabel[1]:checkboxLabel[0]}}
                        </el-checkbox>
                    </slot>
                </div>

                <div v-if="getResult(scope)==false" class="message">
                    {{getMsg(scope)}}

                </div>

            </div>

        </template>
    </el-table-column>
</template>

<script>
    /* import {TableColumn} from 'element-ui'*/
    import IceSelect from '@/components/common/base/IceSelect.vue'

    export default {
        name: "IceEditableTableColumn",
        props: {
            inputType: {
                type: String,
                default: 'input'
            },
            options: Array,
            mapTypeCode: String,
            prop: String,
            label: String,
            checkboxLabel: {
                type: Array,
                default: function () {
                    return ['否', '是']
                }
            },
            width: {
                type: Number,
                default: 200
            },
            placeholder: {
                type: String,
                default: '请输入'
            },

            dateType: {//日期的类型
                type: String,
                default: 'date'
            },

            dateFormat: {//日期的格式
                type: String,
                default: 'yyyy-MM-dd'
            },

            tooltipEffect: {//tooltip展示的背景--当isTooltip为true时生效
                type: String,
                default: 'light'
            },

            isTooltip: {//当内容过长被隐藏时是否显示tooltip
                type: Boolean,
                default: false
            },

            tooltipPlacement: {//tooltip展示的方位--当isTooltip为true时生效
                type: String,
                default: 'right'
            },

            clearable: {//日期是否可清除
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                required: false
            }
        },
        methods: {
            addMessage(){
                this.$emit("add-Message");
            },
            getResult(scope) {
                if (!scope.store.table.rowValidStatus) {
                    return true;
                }
                if (!scope.store.table.rowValidStatus[scope.$index]) {
                    return true;
                }
                if (!scope.store.table.rowValidStatus[scope.$index][this.prop]) {
                    return true;
                }

                if (scope.store.table.rowValidStatus[scope.$index][this.prop].result == undefined) {
                    return true;
                }

                return scope.store.table.rowValidStatus[scope.$index][this.prop].result
            },
            getMsg(scope) {
                if (!scope.store.table.rowValidStatus) {
                    return '';
                }
                if (!scope.store.table.rowValidStatus[scope.$index]) {
                    return '';
                }
                if (!scope.store.table.rowValidStatus[scope.$index][this.prop]) {
                    return '';
                }

                if (scope.store.table.rowValidStatus[scope.$index][this.prop].result == undefined) {
                    return '';
                }

                return scope.store.table.rowValidStatus[scope.$index][this.prop].msg
            },
            valiateFiled(scope) {
                if (this.inputType != 'checkbox') {
                    scope.store.table.validateField(scope.$index, this.prop);
                }

            },
            computeRequired() {
                let rule = null;
                this.required = false;
                if (this.$parent.rules &&
                    this.$parent.rules[this.prop]) {
                    rule = this.$parent.rules[this.prop];
                    if (rule instanceof Array) {
                        rule.forEach(item => {
                            if (item['required']) {
                                this.required = true;
                            }
                        })
                    } else {
                        this.required = rule['required'];
                    }
                }
            }
        },
        computed: {},
        watch: {
            '$parent.rules': () => {
                if (this) {
                    this.computeRequired();
                }

            }
        },
        mounted() {
            this.computeRequired();
        },
        components: {
            IceSelect
        }
    }

</script>

<style lang="less">
    .cellWrapper.error {
        .el-input__inner {
            border-color: red;
        }
    }
</style>

<style lang="less" scoped>
    .cellWrapper.required:before {
        content: '*';
        color: #f56c6c;
    }

    .cellWrapper {
        position: relative;
        display: flex;
        min-height: 48px;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .cellWrapper.error {
        /* margin-bottom: 18px;*/
    }

    .message {
        /* position: absolute;*/
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        padding-left: 6px;
        line-height: 14px;
        height: 16px;
        padding-top: 2px;
        /*bottom: -22px;
        left: 6px;*/
    }

    .error {
        .message {
            color: red;
        }
    }
</style>
