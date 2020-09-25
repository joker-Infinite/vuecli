export default {
    props:
        {
            hasQueryEvent: {
                type: Boolean, default: false
            },
            highlightShow: {
                type: Boolean, default: false
            },//多选时，选中行是否高亮
            title: String,//网格显示标题
            exportTitle: String,//网格导出时标题
            exportColumns: {
                type: String, default: ""
            },//网格导出列
            exportUrl: {
                type: String, default: ""
            },//导出url
            query: {//查询输入控件清单
                type: Array,
                default: function () {
                    return []
                }
            },
            queryType: {//查询筛选方式 local:本地筛选， remote：后台筛选
                type: String,
                default: function () {
                    return 'remote'
                }
            },
            columns: {//网格列清单
                type: Array,
                default: function () {
                    return []
                }
            },
            operations: {//网格行按钮清单
                type: Array,
                default: function () {
                    return []
                }
            },
            operationsWidth: {
                type: Number,
                default: 120
            },
            rowClickFireCheck: {//点击数据行触发选中事件
                type: Boolean,
                default: true
            },
            tableCurrentChange: {
                //列表选中项变化触发回调
                type: Function,
                default: null
            },
            buttons: {//网格上方按钮清单
                type: Array,
                default: function () {
                    return []
                }
            },
            dataUrl: String,//数据请求url

            gridData: {//数据源
                type: Array,
                default: function () {
                    return []
                }
            },

            beforeBindData: {//绑定数据前对数据处理
                type: Function,
                default: data => data
            },

            afterBindData: {//绑定数据后回调函数
                type: Function
            },


            /*  name: String,*/
            columnsNumber: {//查询控件显示列数
                type: Number,
                default: 4
            },

            queryModel: {//查询框显示模式【'quick', 'normal'】
                type: String,
                default: 'quick',
                validator: function (value) {
                    return ['quick', 'normal'].indexOf(value) !== -1
                }
            },

            chooseItem: {//网格是否可选择【'none', 'single',  'multiple'】
                type: String,
                default: 'none',
                validator: function (value) {
                    return ['none', 'single', 'multiple'/*, 'multipleForManage'*/].indexOf(value) !== -1
                }
            },
            pagination: {//是否启用分页功能
                type: Boolean,
                default: true
            },
            pageLayout: {//翻页控件布局
                type: String,
                default: "total, sizes, prev, pager, next, jumper"
            },
            gridAutoRefresh: {//是否加载组件后自动刷新数据
                type: Boolean,
                default: true
            },
            gridIndex: {//是否显示序号列
                type: Boolean,
                default: true
            },
            minHeight: {//高度
                type: [Number, String],
                default: 400
            },
            textProp: String,//文本解析属性
            codeProp: String,//选择值解析属性
            selectedCodes: {//选中值
                type: Array,
                default: () => {
                    return []
                }
            },
            initQuickQueryValue: String,//快速搜索初始值

            spanMethod: Function,//单元格合并策略
            selectedProp: String,//默认选中字段名

            tableRowClassName: {
                //为列表某一行添加样式
                type: Function,
                default: null
            },
            tableCellClassName: {
                //为列表某一单元格添加样式
                type: Function,
                default: null
            },
            quickQueryWidth: {//查询框的宽度
                type: String,
                default: ''
            },
            selectableLabel: {
                //isSelectable为true时并且chooseItem为multiple生效，给某一行的checkBox设为禁用状态，对应该行的某一个字段
                type: String,
                default: ''
            },
            selectableCodeTrue: {
                //与selectableLabel同时使用才生效，selectableLabel的值为selectableCodeTrue时禁用
                type: [String, Number],
                default: ''
            },
            isSelectable: {
                type: Boolean,
                default: false
            },

            defaultSort: [Object, String],//defaultSort是一个对象，需填两个参数，sort和prop，sort为排序规则，prop为列表字段
            //自动跟随某个属性的变化去调整大小
            syncResize: [Boolean, String, Number],

        }
}
