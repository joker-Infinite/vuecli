<template>
    <div class="transfer_outer">
        <div class="transfer_tree" v-if="treeParams && Object.keys(treeParams).length>0">
            <ice-tree v-bind="{...$attrs,...treeParams}"
                      style="min-height: 100%"
                      v-on="{...$listeners,...treeEvent}"></ice-tree>
        </div>
        <div class="transfer_table" :style="{'padding-top':searchQuery.length>0?0:'5px'}">
            <div class="transfer_table_search" v-if="query.length>0">
                <div style="width: 40%">
                    <el-input :placeholder="searchPlaceholder"
                              v-model="inputValue"
                              clearable
                              @keyup.enter.native="search(true)">
                        <i class="el-icon-search el-input__icon"
                           style="cursor: pointer"
                           slot="suffix"
                           @click="search(true)"></i>
                    </el-input>
                </div>

            </div>
            <div style="flex: 1;display: flex">
                <div class="transfer_table_left" :style="{width:leftTableWidth?leftTableWidth:'350px'}">
                    <div class="fontEllipsis">{{leftRemark}}</div>
                    <ice-query-grid v-bind="{...$attrs,...leftGridParams}"
                                    v-on="{...$listeners,...leftGridEvent}"
                                    :query="leftGridParams&&leftGridParams.query&&leftGridParams.query.length>0?leftGridParams.query:query"
                                    :chooseItem="chooseItem"
                                    :gridAutoRefresh="false"
                                    :hidden-qucik-query="true"
                                    @selection-change="leftSelectionChange"
                                    :grid-index="true"
                                    ref="gridLeft"
                                    :pageLayout="pageLayoutLeft"></ice-query-grid>
                </div>
                <div class="transfer_btn" :style="{width:btnWidth>0?btnWidth+'px':'100px'}">
                    <div v-for="button in buttonList" style="margin: 5px 0">
                        <el-button :key="button.name"
                                   :type="button.type?button.type:'warn'"
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
                                   :unauth="(button.unauth==='false'||!button.unauth)?false:true"
                                   :style="{width:btnWidth>0?(btnWidth-4)+'px':'96px',overflow:'hidden'}">
                            {{button.name}}
                        </el-button>
                    </div>
                </div>
                <div class="transfer_table_right">
                    <div class="fontEllipsis">{{rightRemark}}</div>
                    <ice-query-grid v-bind="{...$attrs,...rightGridParams}"
                                    v-on="{...$listeners,...rightGridEvent}"
                                    ref="gridRight"
                                    @selection-change="rightSelectionChange"
                                    :gridAutoRefresh="false"
                                    :chooseItem="chooseItem"
                                    :query="rightGridParams&&rightGridParams.query&&rightGridParams.query.length>0?rightGridParams.query:query"
                                    :hidden-qucik-query="true"
                                    :pageLayout="pageLayoutRight"></ice-query-grid>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IceTree from "./IceTree";
    import IceQueryGrid from "./IceQueryGrid";
    import VueScroll from 'vuescroll';

    export default {
        name: "IceTransfer",
        components: {IceQueryGrid, IceTree, VueScroll},
        props: {

            leftTableWidth: String,//左边列表的宽度
            buttons: Array,//中间按钮
            treeParams: Object,//树属性
            treeEvent: Object,//树事件

            leftGridParams: Object,//左边列表属性
            leftGridEvent: Object,//左边列表事件
            leftRemark: {//列表文字描述
                type: String,
                default: ''
            },
            pageLayoutLeft: {//分页的格式
                type: String,
                default: 'total, prev, next, jumper'
            },

            searchQuery: {//两个列表公用的查询
                type: Array,
                default: () => []
            },

            btnWidth: Number,//中间按钮的宽度
            chooseItem: {//默认多选
                type: String,
                default: 'multiple'
            },

            rightGridParams: Object,//右边列表属性
            rightGridEvent: Object,//右边列表事件
            rightRemark: {//列表文字描述
                type: String,
                default: ''
            },
            pageLayoutRight: {//分页的格式
                type: String,
                default: 'total, prev, next, jumper'
            },
        },
        data() {
            return {
                inputValue: '',//查询条件的值
                query: [],
                buttonList: []
            }
        },
        methods: {
            buttonClick(callback, $event) {
                if (callback) {
                    callback($event);
                }
            },

            search(isQuick) {
                this.$refs.gridLeft.search(isQuick);
                this.$refs.gridRight.search(isQuick);
            },
            refresh() {
                this.$refs.gridLeft.refresh();
                this.$refs.gridRight.refresh();
            },
            refreshAndPageReset() {//刷新列表并重置页数
                this.$refs.gridLeft.refreshAndPageReset();
                this.$refs.gridRight.refreshAndPageReset();
            },
            leftSelectionChange(rows) {
                this.$emit("leftSelectionChange", rows);
            },
            rightSelectionChange(rows) {
                this.$emit("rightSelectionChange", rows);
            },
            leftRefresh(){//左边列表刷新
                this.$refs.gridLeft.refresh();
            },
            rightRefresh(){//右边列表刷新
                this.$refs.gridRight.refresh();
            }
        },
        watch: {
            searchQuery: {
                handler(val) {
                    this.query = val;
                    this.query.forEach(item => {
                        if (item.type !== 'static') {
                            Object.assign(item, {value: () => this.inputValue})
                        }
                    })
                },
                immediate: true
            },
            buttons: {
                handler(val) {
                    this.buttonList = val
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            searchPlaceholder() {
                return '关键字:' + this.query.map(item => item.label).join(',')
            }
        }
    }
</script>

<style lang="less" scoped>
    .transfer_outer {
        display: flex;
        width: 100%;
        height: 100%;
        .transfer_tree {
            width: 200px;
        }
        .transfer_table {
            display: flex;
            flex-direction: column;
            width: 100%;
            .transfer_table_search {
                width: 100%;
                min-height: 49px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .transfer_table_left {
                width: 350px;
            }
            .transfer_btn {
                width: 100px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .transfer_table_right {
                flex: 1;

            }
            .fontEllipsis {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

            }
        }

    }
</style>

