<template>
    <div>
        <ice-label :name="label" v-if="label&&mode!='hidden'" :width="labelWidth">
            <el-input v-model="selectedValue" :placeholder="mode=='readonly'?'':title" :clearable="mode!='readonly'"
                      :readonly="mode=='readonly'||mode=='onlySelect'" :disabled="mode=='readonly'">
                <el-button slot="append" :icon="icon" @click="openDialog" v-if="mode!='readonly'" unauth></el-button>
            </el-input>
        </ice-label>
        <el-input v-model="selectedValue" :placeholder="mode=='readonly'?'':title" v-if="!label&&mode!='hidden'"
                  :clearable="mode!='readonly'"
                  :readonly="mode=='readonly'||mode=='onlySelect'" :disabled="mode=='readonly'">
            <el-button slot="append" :icon="icon" @click="openDialog" v-if="mode!='readonly'" unauth></el-button>
        </el-input>
        <el-dialog v-dialogDrag
                   :title="title"
                   v-if="mode!='readonly'"
                   center
                   :before-close="selectCannel"
                   :close-on-click-modal="closeOnClickModal"
                   :visible.sync="visible"
                   :width="dialogWidth+''"
                   append-to-body>
            <div :style="{height:height+'px'}" class="pop-background">
                <!-- <div>{{$attrs}}123</div>-->
                <slot>

                    <ice-tree-grid v-if="($attrs.dataUrl||$attrs['data-url'])&&($attrs.loadUrl||$attrs['load-url'])"
                                   v-bind="$attrs"
                                   v-on="$listeners"
                                   title=""
                                   ref="queryTreeGridPop"
                                   :columns-number="2"
                                   :selected-codes="selectionsArr.length>0?selectionsArr:selectedItems.map(item=>item[codeProp])"
                                   :choose-item="chooseItem"
                                   @selection-change="selectChange">
                    </ice-tree-grid>
                    <ice-query-grid
                            v-bind="$attrs"
                            v-on="$listeners"
                            title=""
                            ref="queryGridPop"
                            :columns-number="2"
                            :selected-codes="selectedItems.map(item=>item[codeProp])"
                            :choose-item="chooseItem"
                            @selection-change="selectChange"
                            v-else>
                    </ice-query-grid>
                    <div class="selected-list" v-if="chooseItem=='multiple'" :style="{width: selectListWidth}">
                        <slot name="selectedList" :selectedItems="selectedItems">
                            <div class="title">已选列表({{selectedItems.length}})</div>
                            <vue-scroll :ops="{bar:{background:'#fff',opacity:0}}">
                                <div class="tags-wrapper">
                                    <div v-for="(tag,index) in selectedItems"
                                         v-if="(showTotal||(!showTotal&&index<100))" :key="tag.value"
                                         style="margin: 4px">
                                        <el-tag closable @close="closeTag(tag[codeProp])"
                                                style="background: #fafff8;">
                                        <span class="text">
                                            <slot :item="tag" name="tag">
                                                {{tag[textProp]}} ({{tag[codeProp] }})
                                            </slot>
                                        </span>
                                        </el-tag>
                                    </div>
                                    <div style="width: 100%;display: flex" v-if="selectedItems.length>100&&!showTotal">
                                        <el-button type="text" style="margin: auto" @click="showTotal=true" unauth>查看全部
                                        </el-button>
                                    </div>
                                </div>
                            </vue-scroll>
                        </slot>
                        <!-- <div class="item" v-for="item in selectedItems">{{item.text}}({{item.value }})</div>-->
                    </div>
                </slot>
            </div>
            <div class="ice-center-button-bar " slot="footer">
                <el-button type="primary" :disabled="selectedItems.length<=0&&buttonDisabled" @click="selectConfirm"
                           unauth>
                    确认
                </el-button>
                <el-button type="info" @click="selectCannel" unauth>取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import IceLabel from "./IceLabel";
    import IceQueryGrid from "./IceQueryGrid";
    import IceTreeGrid from "./IceTreeGrid";
    import VueScroll from 'vuescroll'

    export default {
        name: "IcePopSelector",
        model: {
            prop: 'value',
            event: 'IcePopSelectorchange'
        },
        props: {
            label: String,//选择控件label
            labelWidth: {
                type: Number,
                default: 100
            },
            title: {//弹出框标题
                type: String,
                default: '请选择'
            },
            icon: {
                type: String,
                default: 'el-icon-edit-outline'
            },
            dialogWidth: {//弹出框宽度
                type: String,
                default: '1000px'
            },
            chooseItem: {//网格是否可选择【'single', 'multiple'】
                type: String,
                default: 'multiple',
                validator: function (value) {
                    return ['single', 'multiple'].indexOf(value) !== -1
                }
            },
            height: {//弹出框高度
                type: Number,
                default: 500
            },

            value: String,//值绑定v-model,
            mode: {
                type: String,
                default: 'input',
                validator: function (value) {
                    return ['input', 'onlySelect', 'readonly', 'hidden'].indexOf(value) !== -1
                }
            },
            extendProp: [String, Number, Array, Object],
            selections: {
                type: Array,
                default: () => {
                    return []
                }
            },
            selectionsArr:{
                type:Array,
                default:()=>{
                    return [];
                }
            },
            selectListWidth: {//侧边已选列表宽度
                type: String,
                default: '200px'
            },
            buttonDisabled: {
                type: Boolean,
                default: true
            },
            cleanQuickQueryVal: {
                //是否在关闭弹窗的时候清除查询框的值
                type: Boolean,
                default: true,
            },

            isRefresh: {
                //是否每次打开弹窗刷新数据
                type: Boolean,
                default: true,
            },
            closeOnClickModal: {
                // 是否可以通过点击 modal 关闭 Dialog
                type: Boolean,
                default: false,
            }

        },
        data() {
            return {
                selectedValue: '',
                confirmButton: true,
                visible: false,
                selectedItems: this.selections.map(item => item),//已选列表清单
                selectedItemsMap: {},//用于快速过滤数据，防止页面卡死
                showTotal: false//是否查看所有已选列表，默认最多显示100条
            }
        },
        methods: {
            selectConfirm() {
                let texts = this.selectedItems.map(item => item[this.textProp]).join(",")
                let values = this.selectedItems.map(item => item[this.codeProp]).join(",")
                if (texts) {
                    this.selectedValue = texts;
                    this.$emit("IcePopSelectorchange", texts);
                    this.$emit('update:text', values);
                }
                this.$emit("select-confirm", this.selectedItems, texts, values, this.extendProp);
                this.selectCannel();
            },
            selectCannel() {
                this.visible = false;
                this.cleanColumnSelect();
                //this.$emit('update:visible', false);
                this.$emit("select-cannel");
            },
            openDialog() {
                this.visible = true;
                this.$emit('dialog-change', this.visible);
                this.$nextTick(() => {
                    if (this.$refs.queryTreeGridPop && this.isRefresh) {
                        this.treeRefresh();
                    }else if(this.$refs.queryGridPop && this.isRefresh){
                        this.$refs.queryGridPop.refreshAndPageReset();
                    }
                })
            },
            cleanColumnSelect() {
                if ((this.$attrs.dataUrl || this.$attrs['data-url']) && (this.$attrs.loadUrl || this.$attrs['load-url'])) {
                    this.$refs.queryTreeGridPop.cleanColumnSelect();
                    if (this.cleanQuickQueryVal) {//是否在关闭弹窗的时候清除查询框的值
                        this.$refs.queryTreeGridPop.$refs.tree.clearSearch();//清除树形查询框的值
                        this.$refs.queryTreeGridPop.$refs.queryGrid.cleanQuickQuery();//清除列表查询框的值
                    }
                } else {
                    this.$refs.queryGridPop.cleanColumnSelect();
                    if (this.cleanQuickQueryVal) {//是否在关闭弹窗的时候清除查询框的值
                        this.$refs.queryGridPop.cleanQuickQuery();
                    }
                }

            },
            selectChange(rows, removerows) {
                if (this.chooseItem == 'single') {
                    this.selectedItems = rows;
                } else {
                    let filterRows = rows.filter(item => {


                        if (this.selectedItemsMap[item[this.codeProp]]) {
                            return false
                        } else {
                            return true;
                        }
                    })
                    if (filterRows) {
                        filterRows.forEach(item => {
                            this.selectedItems.push(item/*{text: item[textProp], value: item[codeProp]}*/);
                            this.selectedItemsMap[item[this.codeProp]] = item
                        })
                    }

                    if (removerows && removerows.length > 0) {
                        this.selectedItems = this.selectedItems.filter(item => !removerows.find(rm => rm[this.codeProp] == item[this.codeProp]))
                        removerows.forEach(item => {
                            delete this.selectedItemsMap[item[this.codeProp]]
                        })

                    }

                }
            },
            closeTag(value) {
                let selectedItems = this.selectedItems
                this.selectedItems = [];
                this.selectedItemsMap = {};
                selectedItems.forEach(item => {
                    if (item[this.codeProp] != value) {
                        this.selectedItems.push(item);
                        this.selectedItemsMap[item[this.codeProp]] = item
                    }
                })
                if ((this.$attrs.dataUrl || this.$attrs['data-url']) && (this.$attrs.loadUrl || this.$attrs['load-url'])) {
                    this.$refs.queryTreeGridPop.closeSelection(value);
                } else {
                    this.$refs.queryGridPop.closeSelection(value);
                }
            },
            setChecked(key_data, checked, deep) {
                this.$refs.queryTreeGridPop.setChecked(key_data, checked, deep);
            },
            getCheckedNodes(leafOnly, includeHalfChecked) {
                return this.$refs.queryTreeGridPop.getCheckedNodes(leafOnly, includeHalfChecked)

            },
            setCheckedNodes(nodes) {
                this.$refs.queryTreeGridPop.setCheckedNodes(nodes)
            },
            setCheckedKeys(keys, leafOnly) {
                this.$refs.queryTreeGridPop.setCheckedKeys(keys, leafOnly)
            },
            resetChecked() {
                this.$refs.queryTreeGridPop.resetChecked();
            },
            reDoSelection() {
                if (this.$refs.queryTreeGridPop) {
                    this.$refs.queryTreeGridPop.reDoSelection()
                }
                if (this.$refs.queryGridPop) {
                    this.$refs.queryGridPop.reDoSelection()
                }
            },
            treeRefresh(){
                this.$refs.queryTreeGridPop.$refs.tree.refresh();
            }
        },
        computed: {

            codeProp() {
                let codeProp = this.$attrs['codeProp'];
                if (!codeProp) {
                    codeProp = this.$attrs['code-prop'];
                }
                return codeProp;
            },
            textProp() {
                let textProp = this.$attrs['textProp'];
                if (!textProp) {
                    textProp = this.$attrs['text-prop'];
                }
                return textProp;
            }

        },
        watch: {
            value(newvalue) {
                this.selectedValue = newvalue;
            },
            visible() {
                this.$emit('update:visible', this.visible);
                /*if (this.visible) {
                    if (this.$refs.queryTreeGridPop) {
                        this.$refs.queryTreeGridPop.reDoSelection();
                    }
                    if (this.$refs.queryGridPop) {
                        this.$refs.queryGridPop.reDoSelection();
                    }
                }*/
            },
            selectedValue() {
                this.$emit("IcePopSelectorchange", this.selectedValue);
            },
            selections() {
                if (this.selections) {
                    this.selectedItems = this.selections.map(item => item);
                    this.selectedItemsMap = {};
                    this.selectedItems.forEach(item => {
                        this.selectedItemsMap[item[this.codeProp]] = item
                    })
                }

            }
        },
        mounted() {
            this.selectedValue = this.value;
            this.selectedItems.forEach(item => {
                this.selectedItemsMap[item[this.codeProp]] = item
            })
        },
        components: {IceTreeGrid, IceQueryGrid, IceLabel, VueScroll}
    }

</script>


<style lang="less" scoped>
    .dialog-button {
        display: flex;
        justify-content: center;
    }

    .selected-list {
        width: 200px;
        margin-left: 5px;
        box-sizing: border-box;
        background: white;
        display: flex;
        flex-direction: column;

        .title {
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin: 5px;
            box-sizing: border-box;
            border-bottom: 1px solid #f6f6f6;
        }

        .item {
            padding: 5px;
        }

        .tags-wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            position: relative;

            .text {
                max-width: 122px;
                display: inline-flex;
                overflow: hidden
            }
        }
    }

    .pop-background {
        display: flex;
        background: #ebeef5;
        padding-bottom: 5px;
        padding-top: 5px;
    }


</style>
