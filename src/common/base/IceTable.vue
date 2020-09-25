<script>

    import grid from 'vxe-table/lib/grid'
    import VXETable from 'vxe-table'
    import XEUtils from "xe-utils";
    import IcePagination from '@/components/common/base/IcePagination'
    import CommonUtil from '@/utils/common'
    import {DomTools, UtilTools} from "vxe-table/lib/tools";
    import emitter from 'element-ui/src/mixins/emitter';
    import table from "vxe-table/lib/table";
    import numberUtil from "../../../devtool/form/others/numberUtil";
    import IceTableButtonUtil from "../../../vxeTable/render/util/IceTableButtonUtil";

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
            return this.$refs.vxeGrid[name].apply(this.$refs.vxeGrid[name], arguments)
        }
    })

    //扩展属性
    export const expandProps = {
        maxPagerSize: [Boolean, Number],//最大分页查询，表示网格本身不分页但是调用分页接口数据，默认10W
        printRefProp: String,
        isDynamicPage: Boolean,//表示当前表格处在动态页面的上下文环境
        isDemo: Boolean, //仅用作demo显示，不再相应按钮
        editModel: {//网格编辑框编辑模式  默认是default   default（组件触发后可视）,visible（组件一直可视）
            type: String,
            default: 'default'
        },
        additionGetter: Function,
        showContextMenu: {type: Boolean, default: false}// Boolean //快速显示右键菜单
    }

    //扩展方法
    export const expandMethods = ['getLabelData', 'disableColumnRule', 'enableColumnRule',
        'disableColumnEditable', 'enableColumnEditable']

    export default {
        name: "IceTable",
        mixins: [emitter],
        inject: {
            localPage: {
                default: null
            },
        },
        props: {
            ...grid.props,
            ...expandProps
        },
        data() {
            return {
                quickQueryValue: ""
            }
        },
        methods: {
            ...methods,
            renderPager(h) {
                if (this.maxPagerSize) {
                    return null
                }

                let {pagerProps, pagerConfig} = this.$refs.vxeGrid || {}
                if (pagerConfig) {
                return h("div", {class: "pagination", style: 'margin:0;'}, [
                    h('ice-pagination', {
                            props: pagerProps,
                            on: {
                                'size-change': this.icePaginationSizeChange,
                                'current-change': this.icePaginationCurrentChange
                            },
                            ref: 'pager'
                        }
                    )]
                )
                }
                return null
            },
            renderButtons({$grid, $table}) {
                const {buttons = []} = $grid.toolbar
                return buttons.map(item => {


                    const visible = this.execScriptExpress(item.visible, true, $grid)
                    if (visible == false) {
                        return null;
                    }

                    const hidden = this.execScriptExpress(item.hidden, false, $grid)
                    if (hidden == true) {
                        return null;
                    }


                    if (item.dropdowns && item.dropdowns.length) {

                        return <el-dropdown placement="bottom">
                            <el-button  {...{
                                props: {
                                    ...item,
                                    type: (item.type !== undefined && item.type !== null) ? item.type : "primary",
                                    disabled: this.execScriptExpress(item.disabled, false, $grid),
                                    loading: this.execScriptExpress(item.loading, false, $grid)
                                }
                            }}> {UtilTools.getFuncText(item.name)}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                {
                                    item.dropdowns
                                        .filter(dropdown =>
                                            this.execScriptExpress(dropdown.visible, true, $grid) !== false)
                                        .filter(dropdown =>
                                            this.execScriptExpress(dropdown.hidden, false, $grid) !== true)
                                        .map(dropdown => {
                                        return <el-dropdown-item {...{
                                            nativeOn: {
                                                click: evnt => this.btnEvent(evnt, dropdown)
                                            }
                                            }} command={dropdown.code}
                                                                     ctrlCode={dropdown.id}>{UtilTools.getFuncText(dropdown.name)}</el-dropdown-item>
                                    })
                                }
                            </el-dropdown-menu>
                        </el-dropdown>

                    } else {
                        return <el-button {...{
                            on: {
                                click: evnt => this.btnEvent(evnt, item)
                            },
                            props: {
                                ...item,
                                type: (item.type !== undefined && item.type !== null) ? item.type : 'primary',
                                disabled: this.execScriptExpress(item.disabled, false, $grid),
                                loading: this.execScriptExpress(item.loading, false, $grid),
                                ctrlCode: item.id
                            },
                        }}>{UtilTools.getFuncText(item.name)}</el-button>
                    }
                })
            },
            async btnEvent(evnt, item) {
                IceTableButtonUtil.btnEvent.call({$grid: this.$refs.vxeGrid}, evnt, item)
            },
            renderRightTools(h) {
                return this.showQuickQuery ? h("el-input", {
                    nativeOn: {
                        keyup: arg => arg.keyCode === 13 && this.doQuickQuery(arg)
                    },
                    attrs: {
                        placeholder: "关键字快速搜索"
                    },
                    model: {
                        value: this.quickQueryValue,
                        callback: value => {
                            this.quickQueryValue = value
                        }
                    }
                }, [<i onClick={this.doQuickQuery} slot="suffix"
                       class="el-input__icon el-icon-search"></i>]) : null
            },
            doQuickQuery(evt) {
                if (this.isDemo) {
                    return
                }
                let $grid = this.$refs.vxeGrid
                if (XEUtils.isString(this.quickQueryValue)) {
                    $grid.commitProxy("reload", evt, {
                        quickQuery: true,
                        quickQueryValue: this.quickQueryValue.trim()
                    })
                }
            },
            icePaginationSizeChange(pageSize) {
                let {tablePage} = this.$refs.vxeGrid
                this.pageChangeEvent({type: 'page-change', currentPage: tablePage.currentPage, pageSize})
            }
            ,
            icePaginationCurrentChange(pageNum) {
                let {tablePage} = this.$refs.vxeGrid
                this.pageChangeEvent({type: 'current-change', currentPage: pageNum, pageSize: tablePage.pageSize})
            },
            //获取打印的label数据
            getLabelData(columns = []) {

                const $grid = this.$refs.vxeGrid
                const $xetable = $grid.$refs.xTable
                const datas = $grid.getTableData().fullData
                const {scrollXLoad, scrollYLoad} = $xetable
                const tableFullColumns = $grid.getColumns();
                columns = columns && columns.length ? tableFullColumns.filter(item => columns.indexOf(item.property) > -1) : tableFullColumns


                columns = columns.filter(item => item.title).filter(item => item.own._type != 'button')

                return {
                    head: columns.map(item => {
                        return {
                            prop: item.property,
                            title: item.title
                        }
                    }),
                    data: datas.map((row, rowIndex) => {
                        const item = {}
                        columns.forEach((column, columnIndex) => {
                            let cellValue = ''

                            switch (column.type) {
                                // v3.0 废弃 type=index
                                case 'seq':
                                case 'index':
                                    cellValue = rowIndex + 1
                                    break
                                case 'selection':
                                case 'checkbox':
                                    cellValue = $xetable.isCheckedByCheckboxRow(row)
                                    break
                                case 'radio':
                                    cellValue = $xetable.isCheckedByRadioRow(row)
                                    break
                                default:
                                    if (scrollXLoad || scrollYLoad) {
                                        // 如果是虚拟滚动
                                        const {cellRender, editRender} = column
                                        let exportLabelMethod
                                        if (editRender && editRender.name) {
                                            const compConf = VXETable.renderer.get(editRender.name)
                                            if (compConf) {
                                                exportLabelMethod = compConf.editCellExportMethod
                                            }
                                        } else if (cellRender && cellRender.name) {
                                            const compConf = VXETable.renderer.get(cellRender.name)
                                            if (compConf) {
                                                exportLabelMethod = compConf.cellExportMethod
                                            }
                                        }
                                        cellValue = exportLabelMethod ? exportLabelMethod({
                                            $table: $xetable,
                                            row,
                                            column
                                        }) : UtilTools.getCellLabel(row, column, {$table: $xetable})
                                    } else {
                                        const cell = DomTools.getCell($xetable, {row, column})
                                        cellValue = cell ? cell.innerText.trim() : UtilTools.getCellLabel(row, column, {$table: $xetable})
                                    }
                            }


                            item[column.property] = XEUtils.toString(cellValue)
                        })
                        return item
                    })
                }
            },
            getScriptContext() {
                //这是动态表单页面上下文，需要当前上下文信息
                if (this.localPage) {
                    return this.localPage.getScriptContext()
                } else {
                    return null;
                }
            },
            execScriptExpress(express, defaultValue, ...params) {
                return IceTableButtonUtil.execScriptExpress.call(this, this, express, defaultValue, ...params);
            },
            footerMethodInner({columns, data}) {

                /* const labelColumn = columns.map(column => column.own).find(column => column._type != 'seq' &&
                     column._type != 'checkbox' &&
                     column._type != 'radio' &&
                     column._type != 'drag' &&
                     column._type != 'button')*/

                const footerArray = []

                const footerColumns = columns.map(column => column.own).filter(column => column.showFooter && (column.footerType || column.footerMethod))

                const row = [];

                // footerColumns.forEach(footerColumn => {


                columns.forEach(column => {
                    column = column.own;

                    let footerColumn = footerColumns.find(footerColumn =>
                        column._type == footerColumn._type &&
                        column.field == footerColumn.field)

                    if (footerColumn) {
                        let label = ""
                        let value;
                        let {precision} = footerColumn.props || {}
                        switch (footerColumn.footerType) {
                            case "sum":
                                label = (footerColumn.footerLabel || "求和");
                                value = XEUtils.sum(data, column.field);
                                if (XEUtils.isNumber(precision)) {
                                    value = numberUtil.toFixedNumber(value, {digits: precision})
                                }
                                break;
                            case "avg":
                                label = (footerColumn.footerLabel || "平均");
                                value = XEUtils.mean(data, column.field);
                                value = numberUtil.toFixedNumber(value, {digits: 2})
                                break;
                            case "count":
                                label = (footerColumn.footerLabel || "计数")
                                value = data.length
                                break;
                            default:
                                label = (footerColumn.footerLabel || null)
                                value = (CommonUtil.execFunctionOrGetValue(footerColumn.footerMethod, this.getScriptContext(), {
                                    column,
                                    data
                                }) || null)
                            //break;
                        }
                        row.push(`${label ? label : ''}${value ? value : ''}`)

                    } else {
                        row.push(null)
                    }
                })


                //})
                footerArray.push(row)
                return footerArray;

            }
            ,
            contextMenuClickEvent({menu, row, rowIndex, column, $table}, event) {
                IceTableButtonUtil.btnEvent.call({$grid: this.$refs.vxeGrid, row, rowIndex}, event, menu)
            },
            getFlatColumns(column) {
                if (column && column.children) {
                    return column.children.flatMap(item => this.getFlatColumns(item))
                }
                return [column]
            }

        },
        mounted() {
            //解决refs引用，修复bug动态计算高度

            this.dispatch("IceFlowForm", 'printFormItemRegist', {key: this.prop, ref: this})
            this.$refs.vxeGrid.$localPage = this.localPage
            this.$refs.vxeGrid.$iceTable = this
            this.$nextTick(_ => {
                this.$refs.vxeGrid.$refs.pager = this.$refs.pager
            })
        }
        ,
        render(h) {
            return h("vxe-grid", {
                ref: "vxeGrid",
                on: this.tableListeners,
                scopedSlots: {
                    ...this.$scopedSlots,
                    pager: _ => this.renderPager(h),
                    buttons: this.renderButtons,
                    tools: _ => this.renderRightTools(h),
                },
                props: this.iceTableProps
            })
        }
        ,
        computed: {
            tableExtendProps() {
                let rest = {}
                propKeys.forEach(key => {
                    rest[key] = this[key]
                })
                return rest
            }
            ,
            showQuickQuery() {

                const flatColumns = []
                this.columns.forEach(column => {
                    flatColumns.push(...this.getFlatColumns(column))
                })

                const hasQuickQueryColumn = flatColumns.find(column => column.quickQuery)

                return !!hasQuickQueryColumn
                // return true;
            },
            iceTableProps() {
                const props = {...this.$props}


                //快速设置快捷菜单
                const {buttons = []} = this.$props.toolbar || {}
                const buttonColumn = props.columns.find(column => column._type == "button") || {}
                const toolbarButtons = buttons || []
                const columnButtons = buttonColumn.buttons || []


                const showToolbarContextMenu = toolbarButtons.find(item => item.showContextMenu === true)

                const showRowButtonContextMenu = columnButtons.find(item => item.showContextMenu === true)
                if ((this.showContextMenu && !props.treeConfig) ||
                    showToolbarContextMenu ||//携带自带的快捷菜单
                    showRowButtonContextMenu//toolbar中的按钮在快捷菜单中显示
                ) {//行按钮在快捷菜单中显示

                    props.contextMenu = {
                        header: {
                            options: [
                                (this.showContextMenu && !props.treeConfig) ? [
                                    {code: 'HIDDEN_COLUMN', name: '隐藏列'},
                                    {code: 'RESET_COLUMN', name: '取消隐藏'},
                                    {code: 'FIXED_LEFT_COLUMN', name: '固定到左侧'},
                                    {code: 'FIXED_RIGHT_COLUMN', name: '固定到右侧'},
                                    {code: 'CLEAR_FIXED_COLUMN', name: '取消固定'},
                                ] : []
                            ]
                        },
                        body: {
                            options: [
                                showToolbarContextMenu ? toolbarButtons.map(item => {
                                    return {
                                        ...item,
                                        prefixIcon: item.icon,
                                        visible: true,
                                        disabled: false,
                                        isToolBar: true
                                    }
                                }) : []
                                ,
                                showRowButtonContextMenu ? columnButtons.map(item => {
                                    return {
                                        ...item,
                                        prefixIcon: item.icon,
                                        visible: true,
                                        disabled: false
                                    }
                                }) : []
                            ]
                        },
                        footer: {
                            options: [
                                /* [
                                     {code: 'clearAll', name: '清空数据', visible: true, disabled: false}
                                 ]*/
                            ]
                        },
                        visibleMethod: ({type, options, columns, row, rowIndex, column, columnIndex}) => {
                            if (type == 'body') {
                                options.flatMap(item => {
                                    if (item instanceof Array) {
                                        return item
                                    } else {
                                        return [item]
                                    }
                                }).forEach(item => {
                                    const isToolBar = item.isToolBar
                                    item.visible = !this.execScriptExpress(item.hidden, false, isToolBar ? null : row)
                                    item.disabled = this.execScriptExpress(item.disabled, false, isToolBar ? null : row)
                                })
                            }
                            return true
                        }
                    }
                }


                /**
                 * 树形网格不再特殊处理
                 */
                if (props.treeConfig) {
                    props.stripe = null
                    /* props.treeConfig = {

                         ...props.treeConfig
                     }*/


                    const treeNodeClass = `ice-tree-node ${props.highlightCurrentRow ? "clickable" : ""}`

                    const treeNode = props.columns.find(column => column.treeNode);
                    if (treeNode) {
                        const isCheckbox = treeNode.type == 'checkbox'
                        const {labelField} = props.checkboxConfig || {}
                        const {children} = {children: 'children', ...props.treeConfig}
                        treeNode.slots = {
                            ...treeNode.slots ? treeNode.slots : {},
                            default: ({row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $table}, h) => {

                                const text = isCheckbox ? row[labelField] : UtilTools.getCellValue(row, column)
                                if (row[children] && row[children].length) {

                                    if ($table.isTreeExpandByRow(row)) {
                                        return [(<span class={treeNodeClass}><i class="el-icon-folder-opened"></i>
                                            {text}
                                     </span>)]
                                    } else {
                                        return [(<span class={treeNodeClass}><i class="el-icon-folder"></i>
                                            {text}
                                     </span>)]
                                    }


                                } else {
                                    return [(<span class={treeNodeClass}><i class="el-icon-document"></i>
                                        {text}
                                     </span>)]
                                }
                            }
                        }
                    }

                    return props
                }

                props.columns.forEach(column => {
                    if (column.type === 'seq') {
                        column.headerClassName = "ice-index-header"
                        column.className = "ice-index-header"
                        column.width = 36
                    } else if (column.type === 'checkbox') {
                        column.headerClassName = "ice-checkbox-header"
                        column.className = "ice-checkbox-header"
                        column.width = 30
                    } else if (column.type === 'radio') {
                        column.slots = {
                            header: ({$table}, h) => {
                                return [<el-button type="text" {...{
                                    on: {
                                        click: _ => {
                                            $table.clearRadioRow();
                                        }
                                    }
                                }
                                } disabled={!$table.getRadioRecord()}>取消</el-button>]
                            }
                        }
                    }


                    if (this.editModel === 'visible' && column.editRender) {
                        let editRender = column.editRender
                        if (!editRender.type) {
                            editRender.type = this.editModel
                        }
                        column.editRender = editRender
                    }
                    if (column.field == 'oid') {
                        // console.log({...column})
                    }
                })

                props.showFooter = props.showFooter || this.showFooterComputer

                props.footerMethod = props.footerMethod || (this.showFooterComputer ? this.footerMethodInner : null)

                return props
            },
            showFooterComputer() {
                return !!this.columns.find(item => item.showFooter)
            },
            tableListeners() {
                if (this.$listeners && this.$listeners["context-menu-click"]) {
                    return {
                        ...this.$listeners,
                        "context-menu-click": (...params) => {
                            this.contextMenuClickEvent(...params)
                            this.$listeners.contextMenuClick(...params)
                        }
                    }
                } else {
                    return {
                        ...this.$listeners,
                        "context-menu-click": (...params) => {
                            this.contextMenuClickEvent(...params)
                        }
                    }
                }
                return this.$listeners
            }
        }
        ,
        components: {
            IcePagination
        },
    }


</script>
<style lang="less">
    .vxe-grid.ice-tree {
        .ice-tree-node.clickable {
            cursor: pointer;
        }
    }
</style>
