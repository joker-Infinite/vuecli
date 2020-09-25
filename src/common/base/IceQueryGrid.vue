<template>

    <div class="ice-container"
         :style="(minHeight+'').indexOf('px')==-1?{minHeight:minHeight+'px'}:{minHeight:minHeight}">

        <!--<div class="ice-title" v-if="title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>-->
        <div class="conditon-bar" v-if="filterQuery.length>0&&queryModel=='normal'">
            <slot name="conditon-bar">

                <ice-grid-layout :columns="columnsNumber">
                    <ice-label :name="item.label" v-show="advanceQuery?true:index < columnsNumber"
                               v-for="(item,index) in filterQuery"
                               :key="item.code+item.label">
                        <el-input v-model="item.value" v-if="item.type=='input'" placeholder="请输入"
                                  maxlength="20"
                                  clearable
                                  v-bind="item">
                        </el-input>
                        <el-input-number v-model="item.value" v-if="item.type=='number'" placeholder="请输入"
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
                               :class="item.icon?item.icon:'el-input__icon el-icon-edit-outline'"
                               @click="defineFunction(item)"></i>
                        </el-input>
                        <ice-select v-model="item.value"
                                    v-bind="item"
                                    clearable
                                    filterable
                                    is-query
                                    :parent-value="item['parentProp']?filterQuery.find(q=>q.code==item['parentProp']).value:null"
                                    value-model="string"
                                    v-if="item.type=='select'" style="width: 100%">
                        </ice-select>
                        <ice-date-picker
                                v-model="item.value"
                                v-if="item.type=='date'"
                                type="date"
                                :clearable="false"
                                v-bind="item"
                                @change="changeDate(item.compare,filterQuery)"
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
                <!-- <el-collapse-transition>-->

                <!--</el-collapse-transition>-->
                <!--  </el-col>
              </el-row>-->

            </slot>
        </div>

        <div class="ice-button-bar" v-if="filterQuery.length>0&&queryModel=='normal'">
            <slot name="search-bar">
                <el-button type="text" :icon="advanceQuery?'el-icon-arrow-up':'el-icon-arrow-down'"
                           v-if="filterQuery.length>columnsNumber" @click="advanceQuery=!advanceQuery">更多
                </el-button>
                <el-button type="primary" icon="el-icon-search" @click="search" unauth>搜索</el-button>
                <el-button plain icon="el-icon-refresh" @click="resetQuery" unauth>重置</el-button>
            </slot>

        </div>
        <div class="ice-streak " v-if="filterQuery.length>0&&queryModel=='normal'"></div>
        <div class="ice-grid-tool-bar " v-if="buttons.length>0||(filterQuery.length>0&&queryModel=='quick')">
            <div v-if="buttons.length==0"></div>
            <div class="ice-grid-button-bar" v-if="buttons.length>0">
                <slot name="operation-bar">
                    <template v-for="button in buttons">
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

                        <el-button type="primary" :key="button.name" @click="exportExcel(button.selectable)"
                                   :ctrl-code="button.ctrlCode"
                                   :icon="button.icon?button.icon:'el-icon-download'"
                                   v-if="button.type=='export'">
                            {{button.name?button.name:'导出'}}
                        </el-button>

                        <el-dropdown placement="bottom"
                                     :key="button.name"
                                     v-if="button.type=='dropdown'"
                                     @command="buttonClick(button.callback,$event)">
                            <el-button type="primary"
                                       icon="el-icon-plus"
                                       :disabled="typeof(button.disabled) === 'undefined'?false:((typeof button.disabled == 'function')?button.disabled():button.disabled)"
                                       :ctrl-code="button.ctrlCode">
                                {{button.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in button.items"
                                                  :command="item.code"
                                                  :ctrl-code="item.ctrlCode"
                                                  :disabled="typeof(item.disabled) === 'undefined'?false:((typeof item.disabled == 'function')?item.disabled():item.disabled)">
                                    {{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>


                    <slot name="operation-bar-expand"></slot>
                </slot>
                <ice-dialog title="数据导出预览" :visible.sync="exportSelectorShow"
                            height="700px" width="1200px" remounted>
                    <ice-query-grid-export :exportQuery="exportQuery"
                                           :exportColumn="columns"
                                           :dataUrl="exportUrl||dataUrl"
                                           :exportTitle="exportTitle ? exportTitle : title"
                                           :pager="pagination"
                                           exportType="remote"
                                           @export-cancel="exportSelectorShow=false">

                    </ice-query-grid-export>
                </ice-dialog>
            </div>
            <div class="ice-quick-query" v-if="filterQuery.length>0&&queryModel=='quick'"
                 :style="{width:quickQueryWidth?quickQueryWidth:'400px'}">
                <slot name="quick-query">
                    <el-input :placeholder="quickQueryPlaceholder" v-model="quickQuery" :clearable="true"
                              maxlength="50"
                              disable-validate-state
                              @keyup.enter.native="search(true)" @input="inputSearch(true)">
                        <i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"
                           @click="search(true)"></i>
                        <el-button slot="append" @click="advanceQuery=!advanceQuery" v-if="hasAdvenceQuery" unauth>高级查询
                        </el-button>
                        <!---->
                    </el-input>
                </slot>
            </div>
            <!--  <drawer :closable="false" width="400" v-model="advanceQuery" v-if="queryModel=='quick'">-->
            <ice-drawer :width="400" style="position: absolute" v-model="advanceQuery" v-if="queryModel=='quick'">
                <div style="display: flex;flex-direction: column;height: 100%">
                    <div class="advance-query-title">
                        <div class="title">高级查询</div>
                        <i class="el-icon-close" style="cursor: pointer" @click="advanceQuery=false"></i>
                    </div>
                    <div style="flex-grow: 1;overflow-y: auto">
                        <ice-grid-layout :columns="1" @keyup.enter.native="search(false)" tabindex="1"
                                         class="advance-query-layout-area">
                            <ice-label :name="item.label"
                                       division=""
                                       v-for="(item,index) in filterQuery"
                                       :key="item.code+item.label">
                                <el-input v-model="item.value" v-if="item.type=='input'" placeholder="请输入"
                                          maxlength="20"
                                          clearable
                                          v-bind="item">
                                </el-input>
                                <el-input v-model="item.value"
                                          v-if="item.type=='num'"
                                          placeholder="请输入相关数值"
                                          clearable
                                          @keyup.native="numReg(item)"
                                          v-bind="item">
                                </el-input>
                                <el-input v-model="item.value" v-if="item.type=='inputFunction'"
                                          :placeholder="item.placeholder?item.placeholder:'请输入'"
                                          maxlength="20"
                                          clearable
                                          class="inputFunctionClass"
                                          :title="item.value"
                                          v-bind="item">
                                    <i slot="suffix" :title="item.title?item.title:''"
                                       :class="item.icon?item.icon:'el-input__icon el-icon-edit-outline'"
                                       @click="defineFunction(item)"></i>
                                </el-input>
                                <ice-select v-model="item.value"
                                            v-bind="item"
                                            clearable
                                            filterable
                                            is-query
                                            :ref="'select'+index"
                                            :parent-value="item['parentProp']?filterQuery.find(q=>q.code==item['parentProp']).value:null"
                                            value-model="string"
                                            v-if="item.type=='select'" style="width: 100%">
                                </ice-select>
                                <ice-date-picker
                                        v-model="item.value"
                                        v-if="item.type=='date'"
                                        type="date"
                                        :clearable="false"
                                        v-bind="item"
                                        @change="changeDate(item.compare,filterQuery)"
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
                    <div class="ice-center-button-bar">
                        <el-button type="primary" icon="el-icon-search" @click="search(false)" unauth>搜索</el-button>
                        <el-button plain icon="el-icon-refresh" @click="resetQuery" unauth>重置</el-button>
                    </div>
                </div>
            </ice-drawer>
            <!-- </drawer>-->
        </div>

        <div class=" main-content">
            <div class="ice-full-absolute ice-container" ref="grid"
                 v-loading="loading">
                <slot name="grid-bar" :data="gridDataList">
                    <el-tabs type="border-card" v-model="tabQueryItem.value"
                             @tab-click="$nextTick(()=>{tabQueryItem.click?tabQueryItem.click(tabQueryItem.value,tabQueryItem):search(false);})"
                             class="no-content"
                             v-if="tabQueryItem">
                        <el-tab-pane :label="item.label" :name="item.value"
                                     v-for="item in tabQueryItem.tablist" :key="item.label"></el-tab-pane>
                        <!--        <el-tab-pane label="审批中"></el-tab-pane>
                                <el-tab-pane label="已完成"></el-tab-pane>
                                <el-tab-pane label="已驳回"></el-tab-pane>-->
                        <!--<el-tab-pane :label="item.name" v-for="item in extendTabs" :key="item.name"></el-tab-pane>-->
                    </el-tabs>
                    <div class="main-content">
                        <div class="ice-full-absolute">

                            <!--<el-table
                                    :data="gridDataList"
                                    :stripe="true"
                                    height="100%"
                                    ref="eltable"
                                    :highlight-current-row="chooseItem == 'single'"
                                    style="width: 100%;"
                                    tooltip-effect="light"
                                    :span-method="spanMethod?data=>spanMethod({...data,data:gridDataList}):null"
                                    @current-change="tableCurrentChangeHandler"
                                    @sort-change="sortChange"
                                    @row-click="toggleSelection"
                                    @row-dblclick="rowDbclick"
                                    @select="select"
                                    :row-class-name="tableRowClassName"
                                    @selection-change="handleSelectionChange">
                                <el-table-column v-if="hasCheckBox && !isSelectable"
                                                 fixed="left"
                                                 type="selection"
                                                 width="40">
                                </el-table-column>
                                <el-table-column v-if="hasCheckBox && isSelectable"
                                                 fixed="left"
                                                 :selectable="selectableFun"
                                                 type="selection"
                                                 width="40">
                                </el-table-column>
                                <el-table-column v-if="gridIndex"
                                                 fixed="left"
                                                 label="序号"
                                                 width="50">
                                    <template slot-scope="scope">
                                        {{scope.$index + 1+(pageNum-1)*pageSize}}
                                    </template>
                                </el-table-column>
                                <template v-for="(item,index) in columns">
                                    <ice-table-column
                                            :key="item.code"
                                            v-if=" item.width &&item.hidden !== true && item.dynamicHidden !== true && !item.autoWidth"
                                            :fit="true"
                                            :prop="item.code"
                                            :show-tips="item.showTips==undefined?true:item.showTips"
                                            :sortable="item.sortable?'custom':false"
                                            v-bind="item"
                                            v-on="item">
                                    </ice-table-column>
                                    <ice-table-column
                                            :key="item.code"
                                            v-if="(!item.width || item.autoWidth) &&item.hidden !== true && item.dynamicHidden !== true"
                                            :fit="true"
                                            :width="null"
                                            :min-width="item.width?item.width:150"
                                            :sortable="item.sortable?'custom':false"
                                            :fixed="item.fixed || item.fixed == 'left' || item.fixed == 'right'?item.fixed:false"
                                            :prop="item.code"
                                            :show-tips="item.showTips==undefined?true:item.showTips"
                                            v-bind="item"
                                            v-on="item">
                                    </ice-table-column>

                                </template>
                                <el-table-column
                                        v-if="operations.length>0"
                                        fixed="right"
                                        label="操作"
                                        :width="operationsWidth" align="center">
                                    <template slot-scope="scope">
                                        <el-button @click.stop="columnClick(scope.row,scope.$index,operation.callback)"
                                                   type="text" :ctrl-code="operation.ctrlCode"
                                                   size="small" v-for="operation in operations" :key="operation.name"
                                                   v-if="operation.isShow?operation.isShow(scope.row,scope.$index):true">
                                            {{operation.name}}
                                        </el-button>
                                    </template>
                                </el-table-column>

                            </el-table>-->
                            <vxe-table
                                    :data="gridDataList"
                                    :class="{'not-show-overflow':!showableColumns.find(item=>item.showOverflow===false)}"
                                    height="auto"
                                    resizable
                                    auto-resize
                                    ref="eltable"
                                    :sync-resize="syncResize"
                                    :sort-config="gridData.length>0 && !pagination?{}:sortConfig"
                                    :checkbox-config="hasCheckBox?{trigger:'row',checkMethod:checkMethod,highlight: highlightShow}:null"
                                    highlight-hover-row
                                    :highlight-current-row="chooseItem == 'single'"
                                    :span-method="spanMethod?data=>spanMethod({...data,data:gridDataList}):null"
                                    @current-change="tableCurrentChangeHandler"
                                    @sort-change="sortChange"
                                    @row-click="toggleSelection"
                                    @row-dblclick="rowDbclick"
                                    @cell-dblclick="cellDblClick"
                                    :row-class-name="tableRowClassName"
                                    :cell-class-name="tableCellClassName"
                                    @checkbox-all="handleSelectionChange"
                                    @checkbox-change="handleSelectionChange">
                                <vxe-table-column v-if="hasCheckBox && !isSelectable"
                                                  fixed="left"
                                                  align="center"
                                                  :show-overflow="false"
                                                  header-class-name="ice-checkbox-header"
                                                  class-name="ice-checkbox-header"
                                                  type="checkbox"
                                                  width="30">
                                </vxe-table-column>
                                <vxe-table-column v-if="hasCheckBox && isSelectable"
                                                  fixed="left"
                                                  :show-overflow="false"
                                                  header-class-name="ice-checkbox-header"
                                                  class-name="ice-checkbox-header"
                                                  align="center"
                                                  :selectable="selectableFun"
                                                  type="checkbox"
                                                  width="30">
                                </vxe-table-column>
                                <!-- dataLoadComplete是避免序号栏比其他栏位先加载出来，导致页面布局很奇怪 -->
                                <vxe-table-column v-if="gridIndex && dataLoadComplete"
                                                  fixed="left"
                                                  header-class-name="ice-index-header"
                                                  class-name="ice-index-header"
                                                  title="序号"
                                                  :show-overflow="false"
                                                  align="center"
                                                  width="36">
                                    <template slot-scope="scope">
                                        {{scope.rowIndex + 1+(pageNum-1)*pageSize}}
                                    </template>
                                </vxe-table-column>


                                <vxe-table-column
                                        v-for="(item,index) in showableColumns"
                                        :key="item.code"
                                        :title="item.label"
                                        :field="item.code"
                                        :showOverflow="item.showOverflow"
                                        :label="null"
                                        :width="(item.autoWidth||(tailColumnExpand&&index==showableColumns.length-1)||!item.width)?null:item.width+20"
                                        :min-width="(item.autoWidth||(tailColumnExpand&&index==showableColumns.length-1)||!item.width)?(item.width?item.width:120)+20:null"
                                        header-align="center"
                                        :sortable="item.sortable"
                                        v-bind="item"
                                        v-on="item">

                                    <template slot-scope="scope">
                                        <vxe-cell-render
                                                :field="item"
                                                :data="scope">
                                        </vxe-cell-render>
                                    </template>
                                </vxe-table-column>


                                <vxe-table-column
                                        v-if="operations.length>0"
                                        fixed="right"
                                        title="操作"
                                        :width="operationsWidth+10"
                                        align="center">
                                    <template slot-scope="scope">
                                        <el-button @click.stop="columnClick(scope.row,scope.$index,operation.callback)"
                                                   type="text" :ctrl-code="operation.ctrlCode"
                                                   size="small" v-for="operation in operations" :key="operation.name"
                                                   v-if="operation.isShow?operation.isShow(scope.row,scope.$index):true">
                                            {{operation.name}}
                                        </el-button>
                                    </template>
                                </vxe-table-column>

                            </vxe-table>
                        </div>
                    </div>

                </slot>
            </div>
            <!---->
        </div>

        <div class="pagination" v-if="pagination">
            <slot name="pagination-bar">
                <ice-pagination
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        :current-page="pageNum"
                        :layout="pageLayout"
                        :page-size="pageSize"
                        :total="total">
                </ice-pagination>
            </slot>
        </div>
    </div>

</template>

<script>
    import IceTableColumn from './IceTableColumn'
    import IceSelect from './IceSelect'
    import IceLabel from '@/components/common/base/IceLabel.vue'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IcePagination from '@/components/common/base/IcePagination.vue'
    import IceQueryGridTemplate from '@/components/common/base/IceQueryGridTemplate'
    /* import {Drawer} from 'iview';*/
    import IceDatePicker from "./IceDatePicker";
    import IceDrawer from "./IceDrawer";
    import IceDialog from "./IceDialog";
    import VxeCellRender from "../../../vxeTable/VxeCellRender";
    import IceQueryGridExport from "./IceQueryGridExport";

    export default {
        name: 'IceQueryGrid',
        inheritAttrs: false,
        mixins: [IceQueryGridTemplate],
        data() {
            return {
                quickQuery: this.initQuickQueryValue ? this.initQuickQueryValue : '',
                advanceQuery: false,//是否有高级查询
                loading: false,//是否正在加载
                gridDataList: [],//网格数据
                isPagination: false,//是否为分页，用于分页不清除查询条件
                localGridData: [],
                pageSize: 20,
                pageNum: 1,
                total: 0,
                list: {},
                sort: {
                    order: '',
                    prop: ''
                },
                curRow: null,
                selections: [],
                isQuickQuery: false,
                isReDoSelection: false,//是否由重新选择触发，主要用于已选择数据默认选中
                exportSelectorButtons: [{
                    iscannel: false, name: '确认', click: () => {
                        this.refresh(true);
                    }, disabled: () => this.exportSelectedColumns.length == 0
                }, {iscannel: true, name: '取消'}],
                exportSelectorShow: false,
                exportSelectedColumns: this.columns.filter(item => !item.hidden).map(item => item.code),
                dataLoadComplete: false
            }
        }
        ,
        methods: {
            columnClick(item, index, callback) {
                if (callback) {
                    callback(item, index);
                }
            }
            ,
            buttonClick(callback, $event) {
                if (callback) {
                    callback($event);
                }
            }
            ,
            search(isQuick) {
                this.isPagination = this.advanceQuery;
                if (this.isPagination) {
                    this.quickQuery = '';
                }
                this.pageNum = 1;
                if (isQuick) {
                    this.isQuickQuery = true;
                } else {
                    this.isQuickQuery = false;
                }
                if (this.advanceQuery) {
                    this.cleanSelectMenu();
                }
                this.advanceQuery = false;
                this.refresh();
            },
            cleanSelectMenu() {
                let list = [];
                for (let i = 0; i < this.filterQuery.length; i++) {
                    if (this.filterQuery[i].type === 'select') {
                        list.push(i);
                    }
                }
                for (let j = 0; j < list.length; j++) {
                    this.$refs['select' + list[j]][0].$refs.select.blur();
                }
            },
            inputSearch(isQuick) {
                if (this.queryType === 'local') {
                    this.search(isQuick);
                }
            },
            refreshAndPageReset() {
                this.pageNum = 1;
                this.refresh();
            },
            /**
             * 强制从服务单加载数据
             */
            refreshFromRemote() {
                this.$nextTick(() => {
                    this.refreshInner(false, true);
                })

            },
            dynamicHiddenColumns(hiddenColumns) {
                for (let i = 0; i < this.columns.length; i++) {
                    this.$set(this.columns[i], "dynamicHidden", false)
                    if (hiddenColumns && hiddenColumns.length > 0) {
                        for (let j = 0; j < hiddenColumns.length; j++) {
                            if (hiddenColumns[j] === this.columns[i].code) {
                                this.$set(this.columns[i], "dynamicHidden", true)
                                break;
                            }
                        }
                    }
                }
            },
            refresh(isexport = false, cleanQuery = true) {
                if (this.tabQueryItem && this.tabQueryItem.tablist && this.tabQueryItem.tablist.length > 0) {
                    for (let i = 0; i < this.tabQueryItem.tablist.length; i++) {
                        if (this.tabQueryItem.tablist[i].value === this.tabQueryItem.value) {
                            this.dynamicHiddenColumns(this.tabQueryItem.tablist[i].hiddenColumns)
                            break;
                        }
                    }
                }
                this.$nextTick(() => {
                    this.refreshInner(isexport);
                    this.$refs.eltable.clearScroll();
                    if (this.hasQueryEvent) {
                        this.$emit("afterQuery");
                    }
                    if (!this.isPagination && cleanQuery) {
                        this.filterQuery.forEach(ele => {
                            ele.value = ""
                        })
                    }
                })
            },
            refreshInner(isexport = false, force = false) {

                if (this.dataUrl && (this.queryType === 'remote' || !this.localGridData || this.localGridData.length === 0 || force)) {
                    if (force) {
                        this.quickQuery = ''
                    }
                    {
                        this.loading = true;
                        let params = {};
                        if (this.pagination) {
                            params = {size: this.pageSize, current: this.pageNum/*, array: [1, 2, 3]*/}
                        } else {
                            params = {};
                        }
                        if (this.sort && this.sort.order) {
                            params['sortOrder'] = this.sort.order;
                            params['sortColumn'] = this.sort.prop;
                        }

                        params.conditions = [];//条件组合
                        //debugger

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

                        if (this.queryModel == 'quick' && this.isQuickQuery) {//快速查询，采用OR
                            if (this.quickQuery) {
                                params.conditionLink = "OR";
                                this.quickQueryColumns.forEach(item => {
                                    let code = item.prefix ? item.prefix + "." + item.code : item.code;
                                    params[code] = this.quickQuery.trim();
                                    params.conditions.push({
                                        column: code,
                                        exp: computeExp(item),
                                        value: this.quickQuery.trim()
                                    })
                                })
                            }
                        } else {//一般查询，采用AND
                            params.conditionLink = "AND";
                            this.filterQuery.filter(item => {
                                if (typeof item.value == Number.name.toLocaleLowerCase()) {
                                    return "" + item.value;
                                }
                                return item.value;
                            }).forEach(item => {
                                let code = item.prefix ? item.prefix + "." + item.code : item.code;
                                params[code] = item.value;
                                params.conditions.push({
                                    column: code,
                                    exp: computeExp(item),
                                    value: item.value
                                })
                            });
                        }
                        //处理value是函数类型的
                        if (this.functionQuery && this.functionQuery.length > 0) {

                            if (this.queryModel == 'quick' && this.isQuickQuery) {
                                params.conditionLink = "OR";
                            } else {
                                params.conditionLink = "AND";
                            }

                            this.functionQuery.forEach(item => {
                                let code = item.prefix ? item.prefix + "." + item.code : item.code;
                                params[code] = this.quickQuery.trim();
                                params.conditions.push({
                                    column: code,
                                    exp: computeExp(item),
                                    value: item.value()
                                })
                            })
                        }


                        params.staticConditions = [];//静态条件
                        this.query
                            .filter(item => item.type == 'static')
                            .filter(item => item.value !== undefined && item.value !== null && item.value !== '')
                            .forEach(item => {
                                let code = item.prefix ? item.prefix + "." + item.code : item.code;

                                if (item.value instanceof Function) {
                                    let value = item.value();
                                    if (value) {
                                        params[code] = value;
                                        params.staticConditions.push({
                                            column: code,
                                            exp: computeExp(item),
                                            value: value
                                        })
                                    }
                                } else {
                                    params[code] = item.value;
                                    params.staticConditions.push({
                                        column: code,
                                        exp: computeExp(item),
                                        value: item.value
                                    })
                                }

                            });


                        if (this.tabQueryItem && this.tabQueryItem.code && this.tabQueryItem.value != 'all') {
                            let code = this.tabQueryItem.prefix ? this.tabQueryItem.prefix + "." + this.tabQueryItem.code : this.tabQueryItem.code;
                            params[code] = this.tabQueryItem.value;
                            params.staticConditions.push({
                                column: code,
                                exp: computeExp(this.tabQueryItem),
                                value: this.tabQueryItem.value
                            })
                        }


                        params.columns = this.columns.filter(item => !item.ignore).map(column => column.prefix ? column.prefix + '.' + column.code : column.code);//添加查询需要的列信息

                        if (isexport) {
                            const exportColumns = this.columns.filter(item => this.exportSelectedColumns.find(ss => ss == item.code)).filter(item => !item.hidden || item.export).map(column => column.code + "::" + column.label + "::" + (column.mapTypeCode ? column.mapTypeCode : ''));//添加导出需要的列信息
                            // params.exportColumnsName = this.columns.filter(item => !item.hidden).map(column => column.name);//添加导出需要的列信息
                            if (!exportColumns || exportColumns.length == 0) {
                                this.$message.warning("没有找到可以导出的列")
                                return
                            }
                            //params.columns=null;
                            params.exportColumns = this.exportColumns ? this.exportColumns : exportColumns.join(",");
                            params.exportTitle = this.exportTitle ? this.exportTitle : this.title;
                            if (this.exportUrl) {
                                this.$axios.post(this.exportUrl, {
                                    ...params,
                                    size: 100000,
                                    current: 1
                                }, {responseType: 'blob'}).finally(() => {
                                    this.loading = false;
                                    this.exportSelectorShow = false;
                                })
                                return;
                            }
                            this.$axios.get(this.dataUrl, {
                                params: {...params, size: 100000, current: 1},
                                headers: {'Accept': 'application/ice-xls;q=1,*/*;q=0.5'},
                                responseType: 'blob',
                            }).finally(() => {
                                this.loading = false;
                                this.isPagination = false;
                                this.exportSelectorShow = false;
                            })
                        } else {
                            this.$axios.get(this.dataUrl, {params: params}).then(result => {
                                this.loading = false;
                                if (this.pagination) {
                                    this.gridDataList = this.beforeBindData(result.data.records);
                                    this.total = result.data.total;
                                } else {
                                    if (result.data.records) {
                                        this.gridDataList = this.beforeBindData(result.data.records);
                                        this.total = result.data.total;
                                    } else {
                                        this.gridDataList = this.beforeBindData(result.data);
                                    }
                                }
                                //add by rocky
                                // console.log(this.gridDataList)
                                this.localGridData = [...this.gridDataList];

                                this.$nextTick(() => {
                                    if (this.selectedProp) {
                                        const selectedRows = this.localGridData.filter(item => item[this.selectedProp]);
                                        selectedRows.forEach(item => {
                                            this.toggleSelection(item);
                                        })
                                    }
                                    this.$refs.eltable.recalculate();
                                    this.isPagination = false;
                                })
                                if (this.afterBindData) {
                                    this.afterBindData();
                                }
                            })
                                .catch(error => {
                                    console.error(error)
                                    this.loading = false;
                                    this.isPagination = false;
                                    if (error.msg) {
                                        this.$message.error(error.msg)
                                    } else {
                                        this.$message.error("出错啦")
                                    }
                                })
                        }
                    }
                } else {

                    if (!this.dataUrl) {
                        this.localGridData = this.gridData || [];
                    }
                    if (!this.quickQuery || this.quickQuery == '') {
                        this.gridDataList = this.localGridData;
                    } else {
                        let gridData = this.localGridData;

                        let conditionCodes = [];
                        this.quickQueryColumns.forEach(item => {
                            conditionCodes.push(item.code)
                        })

                        let newGridData = gridData.filter(item => {
                            for (let i = 0; i < conditionCodes.length; i++) {
                                //TODO 建议增加是否大小写敏感的属性
                                let value = item[conditionCodes[i]];
                                if (value) {
                                    value = value.toLowerCase();
                                }
                                let query = this.quickQuery ? this.quickQuery.toLowerCase().trim() : '';
                                if (value.indexOf(query) != -1) {
                                    return true;
                                }

                            }
                            if (conditionCodes.length > 0) {
                                return false;
                            } else {
                                return true;
                            }

                        })

                        this.gridDataList = newGridData;
                    }
                }
            }
            ,
            resetQuery() {
                this.filterQuery.forEach(item => {
                    item.value = null;
                });
                this.refresh();//重置后刷新
            },
            sortChange(sortInfo) {

                let order = null;
                switch (sortInfo.order) {
                    case "asc":
                        order = "asc";
                        break;
                    case "desc":
                        order = "desc";
                        break;
                    default:
                        order = null;
                }
                this.sort = {
                    order: order,
                    prop: sortInfo.prop
                };
                this.isPagination = true;
                this.refresh();
            }
            ,
            sizeChange(size) {
                this.pageSize = size;
                this.isPagination = true;
                this.refresh();
            },
            tableCurrentChangeHandler(currentRow, oldCurrentRow) {
                if (!currentRow) {
                    return
                }
                if (this.chooseItem == 'single') {
                    this.selections = [currentRow.row];
                    this.$emit("selection-change", this.selections, oldCurrentRow ? [oldCurrentRow] : []);
                }
                if (!!this.tableCurrentChange && typeof this.tableCurrentChange == "function") {
                    this.tableCurrentChange(currentRow, oldCurrentRow);
                }
            }
            ,
            currentChange(page) {
                this.pageNum = page;
                this.isPagination = true;
                this.refresh();
            }
            ,
            /**勾选checkBox时的事件*/
            select(select, row) {
                this.$emit("select", select, row);
            },
            handleSelectionChange({selection, reserves, checked, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell}) {
                /*console.log(selection, reserves, checked, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell)
                debugger*/
                const selections = selection;

                this.select(selections, row)

                if (!this.isReDoSelection) {
                    let removeSelections = this.selections.filter(item =>
                        !selections.find(sele =>
                            item[this.codeProp] == sele[this.codeProp]
                        )
                    );

                    this.selections = [...selections];
                    this.$emit("selection-change", selections, removeSelections);
                }
                this.isReDoSelection = false;

                //选中值回填到属性
                if (this.selectedProp) {
                    this.localGridData.forEach(item => {
                        item[this.selectedProp] = false
                    })
                    if (selections) {
                        selections.forEach(item => {
                            item[this.selectedProp] = true
                        })
                    }
                }
            },

            toggleSelection(row) {
                // this.$set(this.selections, this.selections.length, row);
                if (this.chooseItem == 'multiple' && !this.isSelectable) {
                    this.$nextTick(_ => {
                        this.$refs.eltable.toggleRowSelection(row);
                    })
                    return;
                }
                if (this.chooseItem == 'multiple' && this.isSelectable) {
                    //当为多选时并且启用给某一行的checkBox添加禁用状态，当值为禁用时，单击事件就不会勾选当行
                    if ((typeof row[this.selectableLabel] == 'boolean' && !row[this.selectableLabel]) ||
                        ((typeof row[this.selectableLabel] == 'string' || typeof row[this.selectableLabel] == 'number') &&
                            this.selectableCodeTrue != '' && !(row[this.selectableLabel] == this.selectableCodeTrue))) {
                        this.$nextTick(_ => {
                            this.$refs.eltable.toggleRowSelection(row);
                        })
                        return;
                    }
                }
                if (this.chooseItem == 'single') {
                    this.$nextTick(_ => {
                        this.$refs.eltable.setCurrentRow(row);
                    })
                    this.selections = [row];
                    this.$emit("selection-change", this.selections, [])
                    return;
                }
            },
            toggleSelectionByIndex(index) {
                this.toggleSelection(this.gridDataList[index]);
            },
            checkMethod({row}) {
                if (typeof row[this.selectableLabel] == 'boolean') {
                    //当字段对应的值为Boolean类型，为true则禁用
                    return row[this.selectableLabel] ? false : true;
                } else if ((typeof row[this.selectableLabel] == 'string' || typeof row[this.selectableLabel] == 'number') && this.selectableCodeTrue !== '') {
                    //当字段对应的值为String或者number时，则需要传入禁用时的值是什么，selectableCodeTrue对应禁用时的值
                    return (row[this.selectableLabel] == this.selectableCodeTrue) ? false : true;
                }
                return true;
            },
            getSelections() {
                return this.selections;
            },
            getDataList() {
                return this.gridDataList;
            },
            cleanColumnSelect() {
                if (!this.$refs.eltable) {
                    return
                }
                if (this.chooseItem == 'multiple') {
                    this.$refs.eltable.clearSelected();
                } else {
                    this.$refs.eltable.clearCurrentRow();
                }
            },
            reDoSelection() {
                this.isReDoSelection = true;
                this.cleanColumnSelect();

                if (this.selectedCodes.length > 0
                    && this.codeProp) {
                    let selection = this.gridDataList.filter(item => this.selectedCodes.find(code => code == item[this.codeProp]));
                    if (selection && selection.length > 0) {
                        this.$nextTick(() => {
                            if (this.chooseItem == 'multiple') {
                                selection.forEach(row => {
                                    this.$refs.eltable.toggleRowSelection(row);

                                })
                            }
                            if (this.chooseItem == 'single') {
                                selection.forEach(row => {
                                    this.$refs.eltable.setCurrentRow(row)
                                })

                            }
                            this.isReDoSelection = false;
                            // this.$emit("re-selection",)
                        })

                    } else {
                        this.isReDoSelection = false;
                    }
                    this.selections = selection;
                } else {
                    this.selections = [];
                    this.isReDoSelection = false;
                }
            },
            closeSelection(value) {
                let row = this.gridDataList.find(item => item[this.codeProp] == value);
                if (row) {
                    this.$refs.eltable.setCheckboxRow(row, false);
                }
            },
            cellDblClick({row, rowIndex}) {//单元格双击事件
                //row点击的当前行，rowIndex当行的下标
                this.rowDbclick(row);//原grid
            },
            rowDbclick(row) {
                let bt = this.operations.find(item => item.dbclick === true)
                if (bt && bt.callback) {
                    bt.callback(row);
                }
                this.$emit("dbClick", row)
            },
            exportExcel(selectable) {
                this.exportSelectorShow = true;
                /*if (selectable === true) {
                    this.exportSelectorShow = true;
                } else {
                    this.exportSelectedColumns = this.columns.map(item => item.code)
                    this.refresh(true)
                }*/

            },
            doLayout() {

            },
            getGridData() {
                return this.gridDataList;
            },
            changeDate(compare, list) {
                let index = list.findIndex(item => item.compare == compare);
                list.forEach(item => {
                    //判断当前是否存在比较的属性compare，根据比较值的大小来判定谁的时间应该比谁大，并且要比较的值不为空，compareKey属性来判断他们是否为一组
                    //注意：同为一组的compare属性值不可相等，如果相等，则他们的时间先后判定将无效
                    if (item.compare && Number(item.compare) > Number(compare) && list[index].value > item.value && list[index].value != '' && item.compareKey == list[index].compareKey) {
                        item.value = '';
                    } else if (item.compare && Number(item.compare) < Number(compare) && list[index].value < item.value && list[index].value != '' && item.compareKey == list[index].compareKey) {
                        item.value = '';
                    }
                })
            },
            defineFunction(item) {
                //使用试例，例如查询定义的数组是query，type为inputFunction时有效
                //let index = this.query.indexOf(item);-->找到当前操作的是哪个查询条件的下标
                //this.query[index].value = '123'-->将确定好的值给到查询框
                /**
                 * defineFunction(item){
                        this.$message.warning("123");  业务操作
                        let index = this.query.indexOf(item); 获取下标
                        this.query[index].value = '123'       赋值
                   },
                 */
                this.$emit("defineFunction", item);
            },
            numReg(item) {
                let index = this.query.indexOf(item);

                if (isNaN(this.query[index].value)) {
                    this.query[index].value = '';
                    return
                }
                if (item.maxlength && !isNaN(item.maxlength) && item.maxlength > 0) {
                    this.query[index].value = this.query[index].value.length > item.maxlength ? this.query[index].value.substr(0, item.maxlength) : this.query[index].value
                }
            },
            cleanQuickQuery() {
                //清除查询框的值
                this.quickQuery = '';
            },
            selectableFun(row) {
                if (typeof row[this.selectableLabel] == 'boolean') {
                    //当字段对应的值为Boolean类型，为true则禁用
                    return row[this.selectableLabel] ? false : true;
                } else if ((typeof row[this.selectableLabel] == 'string' || typeof row[this.selectableLabel] == 'number') && this.selectableCodeTrue !== '') {
                    //当字段对应的值为String或者number时，则需要传入禁用时的值是什么，selectableCodeTrue对应禁用时的值
                    return (row[this.selectableLabel] == this.selectableCodeTrue) ? false : true;
                }
                return true;
            }
        },
        computed: {
            hasCheckBox() {
                if (this.chooseItem == 'multiple') {
                    return true
                }
                return false;
            },
            quickQueryPlaceholder() {
                let placeholder = [];
                placeholder = this.quickQueryColumns.map(item => item.label);
                let pp = "关键字：" + placeholder.join("/")
                return pp;
            },
            quickQueryColumns() {
                return this.filterQuery.filter(item => item.type == 'input')
                    .filter((_, index) => index <= 3)
            },
            hasAdvenceQuery() {
                if (this.quickQueryColumns.length <= 4 && this.filterQuery.length == this.quickQueryColumns.length) {
                    return false
                } else {
                    return true;
                }
            },
            filterQuery() {
                return this.query.filter(item => item.type != 'static' && item.type != 'tab' && typeof item.value !== 'function');
            },
            exportQuery() {
                return this.query;
            },
            tabQueryItem() {
                return this.query.find(item => item.type == 'tab');
            },
            functionQuery() {
                return this.query.filter(item => item.type != 'static' && item.type != 'tab' && typeof item.value === 'function');
            },
            showableColumns() {
                return this.columns.filter(item => !item.hidden && !item.dynamicHidden)
            },
            tailColumnExpand() {
                return !this.showableColumns.find(item => (item.autoWidth || !item.width))
            },
            sortConfig() {
                if (this.defaultSort) {
                    let defaultSort = {};
                    if (typeof this.defaultSort === 'string') {
                        defaultSort.field = this.defaultSort;
                        defaultSort.order = 'asc';
                    } else {
                        defaultSort.field = this.defaultSort.prop;
                        defaultSort.order = this.defaultSort.sort || 'asc';
                    }
                    return {
                        defaultSort,
                        remote: true
                    }
                }


                return {
                    remote: true
                }
            }
        }
        ,
        watch: {
            gridData: {
                handler(newValue, oldValue) {
                    if (newValue) {
                        this.gridDataList = newValue;
                    }
                }
                ,
                deep: true,
                immediate: true,
            },
            gridDataList() {
                this.$emit("table-change", this.gridDataList)
                this.reDoSelection();
            },
            dataUrl(newvalue) {
                this.$nextTick(_ => this.refreshAndPageReset())
            },
            showableColumns: {
                handler() {
                    this.$nextTick(() => {
                        this.$refs.eltable.refreshColumn()
                        this.dataLoadComplete = true
                    })
                },
                immediate: true
            }
        }
        ,
        created() {
            // console.log(this.gridDataList)
        }
        ,
        beforeUpdate() {
            //add by rocky 如果未定义宽度自适应列，则最后一行强制为自适应列
            let hasAutoWidth = false;
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].hidden || this.columns.dynamicHidden) {
                    continue;
                }
                if (this.columns[i].width === undefined) {
                    this.columns[i].autoWidth = true;
                    hasAutoWidth = true;
                    break;
                }
                if (i == this.columns.length - 1 && !hasAutoWidth) {
                    this.columns[i].autoWidth = true;
                }
            }
        },
        mounted() {
            if (this.gridAutoRefresh) {
                this.refresh();
                /*   if (this.autoRefreshTicker > 0) {
                       window.setInterval(() => {
                           this.refresh();
                       }, this.autoRefreshTicker)
                   }*/
            }
            this.reDoSelection();
            /*this.$nextTick(_ => {
                this.$refs.eltable.doLayout()
            })*/
        }
        ,
        components: {
            IceQueryGridExport,
            VxeCellRender,
            IceDialog,
            IceDrawer,
            IceDatePicker,
            IceTableColumn,
            IceSelect,
            IceLabel,
            IceGridLayout,
            IcePagination,
            /*  Drawer*/
        }
    }

</script>

<style lang="less">


    .grid-container > .conditon-bar {
        .el-input, .el-select {
            box-sizing: border-box;
            width: 100%;
        }
    }
</style>

<style lang="less" scoped>


    .conditon-bar {
        box-sizing: border-box;
        padding: 5px 10px;
        transition: all 1s linear 0s;
    }

    .conditon-bar input {
        box-sizing: border-box;
        /*width: 150px;*/

    }

    .grid-bar {
        flex-grow: 1;
        flex-shrink: 1;
        position: relative;
    }

    .pagination {
        float: right;
        flex-shrink: 0;
    }

    .advance-query-title {
        margin: 0px 10px;
        display: flex;
        padding-bottom: 10px;
        justify-content: space-between;
        border-bottom: 1px solid #dee1eb;
        margin-bottom: 20px;
        flex: 0 0 auto;

        .title {
            color: rgb(83, 168, 255);
        }

    }

    .advance-query-layout-area:focus {
        border: none;
        outline: none;
    }

</style>

<style lang="less">
    .main-content .el-tabs--border-card > .el-tabs__content {

    }

    .ice-quick-query > .el-input {
        input {
            padding-right: 16%;
        }
    }

    .inputFunctionClass.el-input {
        input {
            padding-right: 47px;
        }
    }
</style>
