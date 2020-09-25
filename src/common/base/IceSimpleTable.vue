<script>

    import grid from 'vxe-table/lib/grid'
    import table from 'vxe-table/lib/table'
    import XEUtils from "xe-utils";
    import {expandMethods, expandProps} from "./IceTable";
    import Sortable from "sortablejs";

    const methods = {}
    const propKeys = Object.keys(grid.props)

    // console.log("methods", grid.methods)

    Object.keys(table.methods).forEach(name => {
        methods[name] = function () {
            //console.log("context", this.$refs.iceTable)
            return this.$refs.iceTable[name].apply(this.$refs.iceTable[name], arguments)
        }
    })
    Object.keys(grid.methods).forEach(name => {
        methods[name] = function () {
            //console.log("context", this.$refs.iceTable)
            return this.$refs.iceTable[name].apply(this.$refs.iceTable[name], arguments)
        }
    })


    expandMethods.forEach(name => {
        methods[name] = function () {
            return this.$refs.iceTable[name].apply(this.$refs.iceTable[name], arguments)
        }
    })

    const defaultProxyConfig = {
        sort: true,
        filter: true,
        ajax: {
            // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
            query: {},

        }
    }


    const simpleTableColumnResolver = function (column, editable, isDemo) {
        if (column.visible === false) {
            return
        }

        let renderName = ''
        column._type = column._type ? column._type : column.type
        switch (column._type) {
            //vxetable自带类型不处理
            case "seq":
            case "checkbox":
            case "radio":
            case "expand":
            case "html":
                return column;
            case "button":
                column.type = null
                column.cellRender = column.cellRender ? column.cellRender : {
                    name: "IceRowButton",
                    buttons: column.buttons
                }
                column.editRender = null
                return column;
            case "input":
                renderName = "IceInput"
                break;
            case "select":
                if (isDemo) {
                    renderName = "IceInput"
                } else {
                renderName = "IceSelect"
                }
                break;
            case "number":
                if (isDemo) {
                    renderName = "IceInput"
                } else {
                renderName = "IceNumber"
                }
                break;
            case "date":
                if (isDemo) {
                    renderName = "IceInput"
                } else {
                renderName = "IceDate"
                }
                break;

            case "file":
                if (isDemo) {
                    renderName = "IceInput"
                } else {
                renderName = "IceFile"
                }
                break;
            case "elcheckbox":
                if (isDemo) {
                    renderName = "IceCheckbox"
                } else {
                    renderName = "IceCheckbox"
                }
                break;
            case "drag":
                renderName = "drag"
                break;
            default:
                renderName = "IceInput"
        }

        //拖拽列
        if (renderName == "drag") {
            column.slots = {
                default: (_, h) => {
                    return [
                        <span class="drag-btn">
                          <i class="vxe-icon--menu" style="cursor: move" title="可上下拖动移动数据"></i>
                        </span>
                    ]
                },
                header: (_, h) => {
                    return [
                        <i class="vxe-icon--question" title="可上下拖动移动数据"></i>
                    ]
                }
            }
            column.type = null
            return column;
        }


        if (editable && column.editable !== false && !isDemo) {
            column.editRender = column.editRender ? column.editRender : (column.editable === false ? null : {
                name: renderName,
                ...column.editProps,
                props: {
                    ...column.props,
                    ...XEUtils.get(column, 'editProps.props', {})
                }
            })
        } else {
            column.cellRender = column.cellRender ? column.cellRender : {
                name: renderName,
                ...column.cellProps,
                props: {
                    ...column.props,
                    ...XEUtils.get(column, 'cellProps.props', {})
                }
            }
        }

        if (!column.filterRender) {
            if (column.filterable) {

                if (renderName === 'IceInput' || renderName === 'IceNumber' || renderName === 'IceDate') {
                    column.filters = [{data: {}}]
                } else {
                    column.filters = [{data: ""}]
                }

                column.filterRender = {
                    name: renderName,
                    ...column.filterProps,
                    props: {
                        ...column.props,
                        ...XEUtils.get(column, 'filterProps.props', {})
                    }
                }
            }
        }


        if (column.renderCell) {
            column.slots = {
                // 使用 JSX 渲染函数
                default: (data, h) => {

                    const cell = column.renderCell(h, data);
                    if (XEUtils.isArray(cell)) {
                        return cell
                    } else {
                        return [cell]
                    }
                }
            }
        }
        column.type = null
        // return column;
    }


    export default {
        name: "IceSimpleTable",
        props: {
            //启用远程查询
            remoteQuery: Boolean,
            //启用远程分页
            remotePager: Boolean,
            //查询URL
            queryUrl: String,
            //表格是否可编辑
            editable: Boolean,
            ...grid.props,
            toolbar: [Boolean, Object, Array],
            ...expandProps,
            autoLoad: {//自动加载数据
                type: Boolean,
                default: true
            },
            //是否只读，
            readonly: Boolean,
            disabled: Boolean,
            //快速预览模式
            quickPreview: Boolean
        },
        data() {
            return {
                disabledColumnRules: {},
                disabledColumnEdits: {}
            }
        },
        methods: {
            ...methods,
            rowDrop() {
                this.$nextTick(() => {
                    let xTable = this.$refs.iceTable
                    this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                        handle: '.drag-btn',
                        onEnd: ({newIndex, oldIndex}) => {
                            /* let tableData = xTable.$props.data || xTable.getTableData().tableData
                             let currRow = tableData.splice(oldIndex, 1)[0]
                             tableData.splice(newIndex, 0, currRow)
                             console.log(tableData)
                             xTable.loadData(tableData).then(_ => {
                                 xTable.syncData()
                             })*/


                            this.$emit("drag-end", {newIndex, oldIndex})
                            this.$nextTick(_ => {
                                xTable.syncData()
                            })

                        }
                    })
                })
            },
            //取消列校验规则
            disableColumnRule(...columnFields) {
                if (columnFields && columnFields.length) {
                    columnFields.forEach(columnField => {
                        this.$set(this.disabledColumnRules, columnField, true)
                    })
                }
            },
            //启用列校验规则
            enableColumnRule(...columnFields) {
                if (columnFields && columnFields.length) {
                    columnFields.forEach(columnField => {
                        this.$set(this.disabledColumnRules, columnField, null)
                    })
                }
            },
            //取消列可编辑
            disableColumnEditable(...columnFields) {
                if (columnFields && columnFields.length) {
                    columnFields.forEach(columnField => {
                        this.$set(this.disabledColumnEdits, columnField, true)
                    })
                    this.$nextTick(_ => {
                        columnFields.forEach(columnField => {
                            const tableColumn = this.$refs.iceTable.getColumnByField(columnField)
                            tableColumn.own.invalidEditable = true
                        })
                    })
                }
            },
            //启用列可编辑
            enableColumnEditable(...columnFields) {
                if (columnFields && columnFields.length) {
                    columnFields.forEach(columnField => {
                        this.$set(this.disabledColumnEdits, columnField, null)
                    })
                    this.$nextTick(_ => {
                        columnFields.forEach(columnField => {
                            const tableColumn = this.$refs.iceTable.getColumnByField(columnField)
                            tableColumn.own.invalidEditable = false
                        })
                    })
                }
            },
            hideColumn(column) {
                if (typeof column === 'string') {
                    column = this.$refs.iceTable.getColumnByField(column)
                }
                if (column) {
                    this.$refs.iceTable.hideColumn(column)
                }

            },
            showColumn(column) {
                if (typeof column === 'string') {
                    column = this.$refs.iceTable.getColumnByField(column)
                }
                if (column) {
                    this.$refs.iceTable.showColumn(column)
                }

            }
        },
        computed: {
            tableExtendProps() {
                let rest = {}
                propKeys.forEach(key => {
                    rest[key] = this[key]
                })
                rest.maxPagerSize = this.maxPagerSize
                //console.log(propKeys, rest)
                return rest
            },
            defaultSortConfig() {

                const defaultSortColumn = this.columns.find(item => item.defaultSort)

                if (!defaultSortColumn) {
                    return null
                }
                let {defaultSort, field} = defaultSortColumn
                if (XEUtils.isBoolean(defaultSort) && defaultSort === true) {
                    return {
                        field,
                        order: 'asc'
                    }
                } else if (XEUtils.isString(defaultSort)) {
                    return {
                        field,
                        order: defaultSort
                    }
                }
            },
            computedPagerConfig() {
                if (this.pagerConfig) {
                    return this.pagerConfig
                }

                if (this.remotePager) {

                    if (XEUtils.isNumber(this.maxPagerSize)) {
                        return {pageSize: this.maxPagerSize}
                    }

                    if (this.maxPagerSize === true) {
                        return {pageSize: 100000}
                    }
                    return {}
                }

                return null
        },
            simpleTableProps() {
                const props = {...this.$props}

                props.sortConfig = this.sortConfig ? {defaultSort: this.defaultSortConfig, ...this.sortConfig} : this.remoteQuery ? {
                        remote: true,
                        defaultSort: this.defaultSortConfig
                } : null;
                    //过滤配置
                props.filterConfig = this.filterConfig ? this.filterConfig : this.remoteQuery ? {remote: true} : null
                    //分页配置
                props.pagerConfig = this.computedPagerConfig
                    //数据代理配置
                props.proxyConfig = this.proxyConfig ? this.proxyConfig : this.queryUrl ? {
                        ...defaultProxyConfig,
                        autoLoad: this.autoLoad,
                        sort: this.remoteQuery,
                        filter: this.remoteQuery,
                        ajax: {
                            query: {
                            ...this.quickPreview ? {
                                request: ({$grid, options, page, sort, filters}, evt, {quickQuery, quickQueryValue}, params) => {

                                    const validColumns = this.columns.filter(column => params.columns.indexOf(column.field) > -1)
                                    const size = params.size || 20
                                    const current = (params.current || 1) - 1
                                    const data = Array.from({length: size}).map((item, index) => {
                                        const dataItem = {}
                                        validColumns.forEach(column => {
                                            dataItem[column.field] = column.title + (current * size + index)
                                        })
                                        return dataItem
                                    })

                                    //console.log(data)
                                    return {
                                        code: 1,
                                        data: this.remotePager === true ? {
                                            records: data,
                                            total: 100
                                        } : data
                                    }
                                    //console.log(validColumns, params)
                                }
                            } : {
                                url: this.queryUrl
                            },
                            }
                        }
                } : null
                    //编辑配置
                if (!this.tableReadonly) {
                    props.editConfig = this.editConfig ? this.editConfig : this.editable ? {showStatus: true} : null
                }
                    //toolbar配置
                if (this.tableReadonly === true) {
                    props.toolbar = null
                } else {
                    props.toolbar = !XEUtils.isArray(this.toolbar) ? this.toolbar : {
                        buttons: this.toolbar,
                        refresh: false, // 刷新按钮
                        zoom: false, // 最大化按钮
                    }
                }

                    //默认自动
                props.resizable = XEUtils.eqNull(this.resizable) ? true : this.resizable
                    //网格列信息

                if (props.columns) {
                    props.columns.forEach(item => simpleTableColumnResolver.call(this, item, this.editable, this.isDemo || this.quickPreview))

                    /* const primaryColumn = props.columns.find(item => item.primaryKey)
                     if (primaryColumn) {
                         props.rowId = primaryColumn.field
                     }*/
                } else {
                    props.columns = []
                }

                // props.columns = this.columns ? this.columns.map(item => simpleTableColumnResolver(item, this.editable)) : []
                    //指定主键所在的列


                //判断是否有校验规则

                if (this.editable && !this.tableReadonly) {
                    const editableColumns = this.columns.filter(item => item.editable !== false)
                        .filter(item => this.disabledColumnEdits[item.field] !== true)
                    //console.log(editableColumns)
                    if (editableColumns && editableColumns.length) {
                        const rules = editableColumns.filter(column => column.visible !== false)
                            .filter(column => {
                                if (this.disabledColumnRules[column.field]) {
                                    return false
                                }
                                return true
                            })
                            .filter(column => column.rule).map(column => {
                                return {
                                    rule: column.rule,
                                    field: column.field
                                }
                            }) || []
                        if (rules && rules.length) {
                            const tableRules = {}
                            rules.forEach(rule => {
                                tableRules[rule.field] = rule.rule
                            })
                            props.editRules = props.editRules ? Object.assign(props.editRules, tableRules) : tableRules
                        }
                    }
                }


                if (this.tableReadonly) {
                    props.columns.forEach(column => {
                            if (column._type == 'checkbox' ||
                                column._type == "radio" ||
                                column._type == "button") {
                                column.visible = false
                            }
                        }
                    )
                }


                return props
            },
            tableReadonly() {
                return this.readonly || this.disabled
            }
        },
        mounted() {

        },
        render(h) {
            return h("ice-table", {
                ref: "iceTable",
                class: this.$attrs.class,
                style: this.$attrs.style,
                on: this.$listeners,
                scopedSlots: this.$scopedSlots,
                props: this.simpleTableProps
            })
        },
        created() {

            this.rowDrop()
        },
        components: {}
    }

</script>


<style scoped>

</style>
