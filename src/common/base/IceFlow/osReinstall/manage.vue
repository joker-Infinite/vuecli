<template>
    <div class="content-filled">
        <ice-query-grid title="设备入网管理"
                        :data-url="ENTER_ENUMS.ACTIONS.GET_ENTER_LIST.URL()"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :operationsWidth=100
                        :minHeight="530"
                        :buttons="buttons">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import comm from "./js/comm"
    import devComm from "../../dev/js/comm/devComm"
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "repairManage",
        components: {IceQueryGrid},
        mixins: [bizComm, devComm, comm, renderer],
        data() {
            return {
                query: [],
                columns: [],
                operations: [],
                buttons: []
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                // this.initButtons();
                this.initQuery();
                this.initColumns();
                this.initOperations();
            },
            /**
             * 初始化表格按钮
             */
            initButtons() {
                this.buttons = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.add})]
            },
            /**
             * 初始化查询
             */
            initQuery() {
                let _this = this;
                this.query = [{type: 'input', label: '责任人', code: 'dutyName', value: ''},
                    {type: 'input', label: '责任部门', code: 'deptName', value: ''},
                    {type: 'input', label: '保密编号', code: 'secretSn', value: ''},
                    {type: 'input', label: '设备编号', code: 'devSn', value: ''},
                    {type: 'input', label: '出厂编号', code: 'birthSn', value: ''},
                    {type: 'input', label: '设备名称', code: 'name', value: ''},
                    {
                        type: 'select',
                        label: '联网类型',
                        code: 'netAreaAndType',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.NET_AREA_TYPE_DATA
                    },
                    {type: 'input', label: '放置地点', code: 'currentPlace', value: ''},
                    {
                        type: 'select',
                        label: '使用情况',
                        code: 'state',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.STATE_DATA.properties
                    },
                    {
                        type: 'select',
                        label: '密级',
                        code: 'secretLevel',
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                        value: ''
                    },
                    {type: 'input', label: '申请人', code: 'deptName', value: ''},
                    {type: 'date', label: '申请日期(起)', code: 'afDate', exp: ">"},
                    {type: 'date', label: '申请日期(止)', code: 'afDate', exp: "<"},];
            },
            /**
             * 初始化列
             */
            initColumns() {
                let _this = this;
                this.columns = [
                    {code: 'oid', hidden: true},
                    {label: '送修单位', code: 'externalRepairDeptName', width: 100},
                    {
                        label: '设备名称', width: 150, code: "devName"
                    },
                    {
                        label: '设备类型', code: 'category', width: 100, renderCell(h, data) {
                            return _this.onCategoryRenderer(data.row.category);
                        }
                    },
                    {
                        label: '设备子类', code: 'childType', width: 120, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childtype);
                        }
                    },
                    {
                        label: '密级', code: 'secretLevel', width: 80, renderCell(h, data) {
                            return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, data.row.secretlevel);
                        }
                    },
                    {
                        label: '维修模式', code: 'repairType', width: 80, renderCell(h, data) {
                            return _this.getNameByCode(_this.REPAIR_ENUMS.REPAIR_TYPE.properties, data.row.repairType);
                        }
                    },
                    {label: '送修时间', code: 'secretSn', width: 100}
                ];
            },
            /**
             * 初始化操作列
             */
            initOperations() {
                let _this = this;
                this.operations = [
                    Object.assign({}, this.COMM_ENUMS.OPERATION.VIEW, {callback: this.view}),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.DELETE, {callback: this.delete}, {
                        isShow(row) {
                            return _this.isOperationShow(row.afStatus);
                        }
                    })
                ];
            },
            /**
             * 操作列是否显示
             * @param value
             * @returns {boolean}
             */
            isOperationShow(value) {
                if (value == this.REPAIR_ENUMS.STATE.DRAFT) {//草稿状态
                    return true;
                }
                return false;
            },
            /**
             * 详情按钮响应事件
             * @param row
             */
            view(row) {
                this.$router.push(this.ENTER_ENUMS.ROUTER.ENTER_DEV_EDIT.URL());
            },
            /**
             * 删除按钮响应事件
             * @param row
             */
            delete(row) {

            }
        },
        mounted() {
            //初始化设备类别枚举--this.requestCategoryData()
            //初始化使用情况枚举--this.requestSystemStateData()
            //初始化联网类型--this.requestNetAreaTypeData()
            //预处理任务链
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestNetAreaTypeData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>