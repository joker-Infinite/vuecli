<template>
    <div class="vxeEdit">
        <div style="display: flex;" v-if="buttons.length>0&&btnIsShow">
            <div class="vxeEdit_btn" v-for="button in buttons">
                <el-button :key="button.name"
                           :type="button.type?button.type:'primary'"
                           :icon="button.icon?button.icon:''"
                           :ctrl-code="button.ctrlCode"
                           :loading="typeof(button.loading) === 'undefined'?false:((typeof button.loading == 'function')?button.loading():button.loading)"
                           :round="button.round?true:false"
                           :plain="button.plain?true:false"
                           :circle="button.circle?true:false"
                           :title="button.title || ''"
                           :autofocus="button.autofocus?true:false"
                           :native-type="button.nativeType?button.nativeType:''"
                           v-show="typeof(button.hidden) == 'undefined'?true:((typeof button.hidden == 'function')?!button.hidden():!button.hidden)"
                           :disabled="typeof(button.disabled) === 'undefined'?false:((typeof button.disabled == 'function')?button.disabled():button.disabled)"
                           v-if="button.type!='export'&&button.type!='dropdown'"
                           @click="buttonClick(button.callback)"
                           :unauth="(button.unauth==='false'||!button.unauth)?false:true">
                    {{button.name}}
                </el-button>
            </div>
        </div>
        <div style="flex-grow: 1;">
            <vxe-grid :columns="tableColumn"
                      :data="data"
                      :edit-config="{trigger: editTrigger, mode: editMode, activeMethod: activeMethod,showIcon:isEdit}"
                      :height="height"
                      :edit-rules="isEdit?rules:null"
                      resizable
                      ref="vxeGrid"
                      @checkbox-all="checkboxAllChangeEvent"
                      @checkbox-change="checkboxChangeEvent">
                <template v-slot:operation_default="{ row, rowIndex }">
                    <div>
                        <el-button type="text"
                                   size="small"
                                   v-for="operation in operations"
                                   :key="operation.name"
                                   :ctrl-code="operation.ctrlCode"
                                   @click.stop="columnClick(row,rowIndex,operation.callback)"
                                   v-if="operation.isShow?operation.isShow(row,rowIndex):true">
                            {{operation.name}}
                        </el-button>
                    </div>
                </template>
            </vxe-grid>
        </div>
    </div>

</template>

<script>
    import dataMap from "@/pages/biz/businessprocess/osReinstall/js/devFlowFilter.js"

    export default {
        name: "IceEditGrid",
        mixins: [dataMap],
        data() {
            return {
                pickerOptions: {
                    disabledDate: (time) => {
                        if (this.timeFilter) {
                            return this.timeFilter(time);
                        }
                        return false
                    }
                },
                selectList: [],
            }
        },
        methods: {
            formatItem(item) {
                let obj = {};
                Object.assign(obj, item);
                if (item.label) {
                    obj.title = item.label;
                }
                if (item.code) {
                    obj.field = item.code;
                }
                obj.headerAlign = obj.headerAlign ? obj.headerAlign : 'center';
                obj.align = obj.align ? obj.align : 'left';
                if (!obj.editRender) {
                    obj.editRender = (obj.edit === undefined || obj.edit) ? {name: obj.type ? obj.type : 'input'} : '';
                    if ((!!obj.mapTypeCode || !!obj.options) && (obj.edit === undefined || obj.edit)) {
                        obj.editRender.name = 'select';
                        obj.editRender.options = obj.options ? obj.options : (obj['mapTypeCode'] ? this.getMapTypeCodeList(obj['mapTypeCode']) : []);
                    }

                    if (obj.type === 'date' && (obj.edit === undefined || obj.edit)) {
                        obj.slots = {
                            default: ({row}) => {
                                return [
                                    <span>{row[obj['code']] ? row[obj['code']].substring(0, 10) : ''}</span>
                                ]
                            },
                            edit: ({row}) => {
                                return [
                                    <el-date-picker type="date"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    picker-options={this.pickerOptions}
                                                    v-model={row[obj['code']]}/>
                                ]
                            }
                        }
                    }
                }
                return obj;
            },
            buttonClick(callback, $event) {
                if (callback) {
                    callback($event);
                }
            },
            columnClick(item, index, callback) {
                if (callback) {
                    callback(item, index);
                }
            },
            activeMethod({row, rowIndex, column, columnIndex}) {
                if (!this.isEdit) {
                    return false
                }
                if (this.columnIsEdit) {
                    return this.columnIsEdit(row, rowIndex, column, columnIndex);
                }
                return true;
            },

            checkboxAllChangeEvent({checked}) {
                this.selectList = [...this.data];
                if (checked) {
                    this.$emit("selection-change", this.selectList);
                } else {
                    this.$emit("selection-change", []);
                }
            },
            checkboxChangeEvent({checked, row}) {
                if (checked) {
                    this.selectList.push(row);
                } else {
                    let index = this.selectList.indexOf(row);
                    if (index > -1) {
                        this.selectList.splice(index, 1)
                    }
                }
                this.$emit("selection-change", this.selectList);
            },
            refresh() {
                this.selectList = [];
                this.$refs.vxeGrid.setAllCheckboxRow(false);
            },
            validateAll(validateResult = () => {
            }) {
                return new Promise(resolve => {
                    this.$refs.vxeGrid.fullValidate(valid => {
                        resolve(valid)
                        validateResult(valid)
                    });
                })
            },
            async validate(index, validateResult = () => {
            }) {
                let list = [];
                list = this.$refs.vxeGrid.getData(index);

                const res = await this.$refs.vxeGrid.validate(list).catch(e => e);
                return new Promise(resolve => {
                    let isTrue = true;
                    if (res) {
                        isTrue = false;
                    } else {
                        isTrue = true;
                    }
                    resolve(isTrue);
                    validateResult(isTrue);
                })
            },


        },
        props: {
            //表格列上的按钮
            buttons: {
                type: Array,
                default: () => []
            },

            //表格列字段
            columns: {
                type: Array,
                default: () => []
            },

            //table数据
            data: {
                type: Array,
                default: () => []
            },

            rules: Object,

            //是否多选
            chooseItem: {
                type: String,
                default: 'single'
            },

            //操作列的宽度
            operationWidth: {
                type: String,
                default: '120px'
            },

            //操作列
            operations: {
                type: Array,
                default: () => []
            },

            //columns里面存在type为date的数据时生效
            timeFilter: {
                type: Function,
                default: null
            },

            //当前列是否可编辑
            columnIsEdit: {
                type: Function,
                default: null
            },

            //列表是否可编辑
            isEdit: {
                type: Boolean,
                default: true
            },

            //列表上的按钮是否显示
            btnIsShow: {
                type: Boolean,
                default: true,
            },

            //列表高度
            height: {
                type: String,
                default: '100%'
            },

            //编辑范围，默认为单元格
            editMode: {
                type: String,
                default: 'cell'
            },

            //编辑触发方式，默认为点击触发
            editTrigger: {
                type: String,
                default: 'click'
            }
        },
        computed: {
            tableColumn() {
                let list = this.columns.map(item => {
                    return this.formatItem(item);
                });
                let operations = {
                    title: '操作',
                    width: this.operationWidth,
                    fixed: 'right',
                    slots: {default: 'operation_default'}
                };
                let checkbox = {type: 'checkbox', width: '50'};
                if (this.operations.length > 0) {
                    list = [...list, operations];
                } else {
                    let index = list.indexOf(operations);
                    if (index > -1) {
                        list.splice(index, 1)
                    }
                }
                if (this.chooseItem === 'multiple') {
                    list = [checkbox, ...list];
                } else {
                    let index = list.indexOf(checkbox);
                    if (index > -1) {
                        list.splice(index, 1)
                    }
                }
                list.forEach(item => {
                    item.visible = typeof(item.visible) === 'undefined' ? true : ((typeof item.visible == 'function') ? item.visible() : item.visible)
                });
                return list;
            },
            mapTypeCodeList() {
                return this.columns.map(item => item.mapTypeCode);
            }
        },
        watch: {
            chooseItem() {
                this.refresh();
            }
        }
    }
</script>

<style scoped>
    .vxeEdit {
        display: flex;
        width: 100%;
        flex-direction: column;
    }

    .vxeEdit_btn {
        justify-content: flex-start;
        margin: 2px 10px 2px 0
    }
</style>
