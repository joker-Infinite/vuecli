<template>
    <div class="ice-full-absolute">
        <div class="ice-container">
            <div class="conditon-bar">

                <ice-grid-layout :columns="4">
                    <ice-label :name="item.label"
                               v-for="(item,index) in query"
                               :key="item.code+item.label">
                        <el-input v-model="item.value" v-if="item.type=='input'" placeholder="请输入"
                                  maxlength="20"
                                  clearable
                                  v-bind="item">
                        </el-input>
                        <el-input-number v-model="item.value" v-if="item.type=='num'" placeholder="请输入"
                                         :max="5" :min="1"
                                         v-bind="item">
                        </el-input-number>
                        <el-input v-model="item.value" v-if="item.type=='inputFunction'"
                                  :placeholder="item.placeholder?item.placeholder:'请输入'"
                                  maxlength="20"
                                  clearable
                                  class="inputFunctionClass"
                                  :title="item.value"
                                  v-bind="item">
                            <i slot="suffix" :title="item.title?item.title:''"
                               :class="item.icon?item.icon:'el-input__icon el-icon-edit-outline'"></i>
                        </el-input>
                        <ice-select v-model="item.value"
                                    v-bind="item"
                                    clearable
                                    filterable
                                    is-query
                                    :parent-value="item['parentProp']?exportQueryCopy.find(q=>q.code==item['parentProp']).value:null"
                                    value-model="string"
                                    v-if="item.type=='select'">
                        </ice-select>
                        <ice-date-picker
                                v-model="item.value"
                                v-if="item.type=='date'"
                                type="date"
                                :clearable="false"
                                v-bind="item"
                                clearable
                                placeholder="选择日期">
                            <!--    :picker-options="{disabledDate(time) {return item.timeFilter?!item.timeFilter(time):false}}"-->
                        </ice-date-picker>
                        <el-time-select
                                v-model="item.value"
                                v-if="item.type=='time'"
                                :picker-options="item.list"
                                :clearable="false"
                                clearable
                                placeholder="选择时间">
                        </el-time-select>
                    </ice-label>
                </ice-grid-layout>
            </div>
            <div class="ice-button-bar">
                <el-button type="primary" icon="el-icon-search" @click="search" unauth>搜索</el-button>
                <el-button plain icon="el-icon-refresh" @click="resetQuery" unauth>重置</el-button>
            </div>

            <div class="ice-streak "></div>
            <div class="main-content" style="display: flex;flex-grow: 1;">
                <div style="flex-grow: 1;display: flex;position: relative">
                    <div class="ice-full-absolute">
                        <ice-simple-table ref="grid"
                                          height="100%"
                                          resizable
                                          auto-resize
                                          show-overflow
                                          column-min-width="120px"
                                          :autoLoad="false"
                                          :maxPagerSize="true"
                                          :export-config="tableExport"
                                          :remotePager="pager"
                                          :queryUrl="dataUrl"
                                          :columns="gridColumns">

                        </ice-simple-table>
                    </div>
                </div>
                <div class="export-operate">
                    <div style="height: 30px;line-height: 30px;border-bottom: 1px solid #e5e5e5">请选择导出列</div>
                    <div style="flex-grow: 1;display: flex;flex-direction: column">
                        <el-checkbox
                                :indeterminate="exportSelectedColumns.length>0&&exportSelectedColumns.length<showableColumns.length"
                                :value="exportSelectedColumns.length==showableColumns.length"
                                @change=" changeColumns">
                            全选
                        </el-checkbox>
                        <div style="margin: 5px 0;"></div>
                        <div style="flex-grow: 1;position: relative">
                            <div class="ice-full-absolute">
                                <vue-scroll :ops="{bar:{background:'#7b7b7b',opacity:0.3,keepShow:true}}">
                                    <el-checkbox-group v-model="exportSelectedColumns">
                                        <el-checkbox v-for="column in showableColumns"
                                                     :label="column.code"
                                                     style="display: block"
                                                     :key="column.code">
                                            {{column.label}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </vue-scroll>
                            </div>
                        </div>
                    </div>
                    <div>导出数据总条数({{dataSize}})</div>
                    <div style="display: flex;justify-content: center">
                        <el-button unauth @click="remoteExport" type="primary" icon="el-icon-download"
                                   :disabled="exportSelectedColumns.length<=0" v-if="exportType!='local'">导出
                        </el-button>
                        <el-button unauth @click="localPrint" type="primary" icon="el-icon-download"
                                   :disabled="exportSelectedColumns.length<=0" v-if="exportType=='local'">打印
                        </el-button>
                        <el-button unauth @click="localExportExcel" type="primary" icon="el-icon-print"
                                   :disabled="exportSelectedColumns.length<=0" v-if="exportType=='local'">导出
                        </el-button>
                        <el-button unauth type="info" icon="el-icon-close" @click="$emit('export-cancel')">取消
                        </el-button>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import IceGridLayout from "./IceGridLayout";
    import VueScroll from 'vuescroll'

    let computeExp = item => {//默认条件关系符
        if (item && item.exp) {
            return item.exp;
        }
        if (item.type == 'input') {
            return 'like'
        }
        if (item.type == 'select' && item.multiple) {
            return 'in'
        }
        return "="
    }

    export default {
        name: "IceQueryGridExport",
        props: {
            exportQuery: Array,
            exportColumn: Array,
            dataUrl: String,
            pager: Boolean,//是否分页
            exportType: String,//导出方式：remote远程导出   local 本地导出
            exportTitle: String,
        },
        data() {
            return {
                loading: false,//是否正在加载
                dataSize: 0,//网格数据
                exportSelectedColumns: [],//已选择的列
                tableExport: {
                    // 默认选中类型
                    type: 'xlsx',
                    // 自定义类型
                    types: ['txt', 'csv', 'xlsx'],
                    columnFilterMethod(column, $columnIndex) {
                        if (column.type == 'seq') {
                            return false
                        } else {
                            return true
                        }
                    }

                },
                query: [],
                exportQueryCopy: [],
                isFirstLoad: true,//是否第一次加载
                staticParams: [],
            }
        },
        methods: {
            async changeColumns(val) {
                this.exportSelectedColumns = val ? this.showableColumns.map(item => item.code) : [];
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 50)
                });
                this.search();
            },
            search(evt, remoteExport = false) {

                const conditions = [];
                const params = {};

                if (this.isFirstLoad) {//第一次进入页面
                    let clone = require('clone');
                    this.exportQueryCopy = clone(this.exportQuery);
                    this.staticParams = [];
                    this.exportQueryCopy.forEach(item => {
                        if (typeof item.value === 'function') {
                            item.value = item.value()
                        }
                        if (item.type === 'static' || (item.type === 'tab' && item.value !== 'all')) {
                            this.staticParams.push(item);
                        }
                    });
                    this.exportQueryCopy.filter(item => {
                        if (typeof item.value == Number.name.toLocaleLowerCase()) {
                            return "" + item.value;
                        }
                        return item.value;
                    }).forEach(item => {
                        if (item.type !== 'tab' || (item.type === 'tab' && item.value !== 'all')) {
                            let code = item.prefix ? item.prefix + "." + item.code : item.code;
                            params[code] = item.value;
                            conditions.push({
                                column: code,
                                exp: computeExp(item),
                                value: item.value
                            })
                        }
                    });
                    this.query = this.exportQueryCopy.filter(item => item.type != 'static' && item.type != 'tab' && typeof item.value !== 'function');
                    this.isFirstLoad = false;
                } else {//在本页面点击搜索
                    let list = [...this.query, ...this.staticParams];
                    list.filter(item => {
                        if (typeof item.value == Number.name.toLocaleLowerCase()) {
                            return "" + item.value;
                        }
                        return item.value;
                    }).forEach(item => {
                        let code = item.prefix ? item.prefix + "." + item.code : item.code;
                        params[code] = item.value;
                        conditions.push({
                            column: code,
                            exp: computeExp(item),
                            value: item.value
                        })
                    });
                }


                if (remoteExport) {
                    const exportColumns = this.showableColumns.filter(column => this.exportSelectedColumns.indexOf(column.code) > -1)
                        .map(column => column.code + "::" + column.label + "::" + (column.mapTypeCode ? column.mapTypeCode : ''));//添加导出需要的列信息
                    // params.exportColumnsName = this.columns.filter(item => !item.hidden).map(column => column.name);//添加导出需要的列信息
                    if (!exportColumns || exportColumns.length == 0) {
                        this.$message.warning("没有找到可以导出的列")
                        return
                    }
                    //params.columns=null;
                    params.exportColumns = exportColumns.join(",");
                    params.exportTitle = this.exportTitle;
                    this.$refs.grid.commitProxy("query", evt, null, {
                        additionConditions: conditions,
                        additionParams: params,
                        remoteExport
                    })
                    return
                }


                this.$refs.grid.commitProxy("query", evt, null, {
                    additionConditions: conditions,
                    additionParams: params,
                    remoteExport
                }).then(_ => {
                    //console.log(this.$refs.grid.getTableData())
                    this.dataSize = this.$refs.grid.getTableData().fullData.length;
                })
            },
            resetQuery(evt) {
                this.isFirstLoad = true;
                this.search(evt, false);
            },
            remoteExport(evt) {
                this.search(evt, true)
            },
            localExportExcel(evt) {
                this.$refs.grid.exportData({
                    filename: this.exportTitle,
                    sheetName: this.exportTitle,
                    type: 'xlsx'
                })
            },
            localExportPdf(evt) {
                this.$refs.grid.exportData({
                    filename: this.exportTitle,
                    type: 'text'
                })
            },
            localPrint() {
                this.$refs.grid.print()
            },
            enterKeyupDestroyed() {
                document.removeEventListener("keyup", this.enterKey);
            },
            enterKeyup() {
                document.addEventListener("keyup", this.enterKey);
            },
            enterKey(event) {
                const componentName = this.$options.name;
                if (componentName == "IceQueryGridExport") {
                    const code = event.keyCode
                        ? event.keyCode
                        : event.which
                            ? event.which
                            : event.charCode;
                    if (code == 13) {
                        this.search();
                    }
                }
            },
        },
        computed: {
            gridColumns() {

                let addition = []


                if (this.exportType == 'local') {
                    addition = [{type: 'checkbox', width: 50, fixed: 'left'},
                        {type: 'seq', title: '序号', width: 60, fixed: 'left'}]
                } else {
                    addition = [{type: 'seq', title: '序号', width: 60, fixed: 'left'}]
                }
                return this.showableColumns.filter(column => this.exportSelectedColumns.indexOf(column.code) > -1).map(column => {

                    const vxeColumn = {}
                    vxeColumn.title = column.label;
                    vxeColumn.field = column.code;
                    vxeColumn.formatter = column.formatter;
                    vxeColumn.renderCell = column.renderCell;
                    vxeColumn.width = column.width;
                    vxeColumn.sortable = column.sortable;
                    if (column.mapTypeCode) {
                        vxeColumn.type = 'select'
                        vxeColumn.props = {
                            mapTypeCode: column.mapTypeCode
                        }
                    }

                    return vxeColumn
                }).concat(addition)
            },
            showableColumns() {
                return this.exportColumn.filter(item => item.label);
            }

        },
        destroyed() {
            this.enterKeyupDestroyed()
        },
        watch: {},
        mounted() {
            this.search(null)
            this.exportSelectedColumns = this.showableColumns.filter(column => !column.hidden).map(item => item.code);
            this.enterKeyup();
        },
        components: {IceGridLayout, VueScroll}
    }

</script>


<style scoped>
    .export-operate {
        padding: 5px;
        width: 250px;
        display: flex;
        flex-direction: column;
    }
</style>
