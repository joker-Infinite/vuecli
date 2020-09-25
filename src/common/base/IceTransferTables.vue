<template>
    <div style="display: flex;width: 1200px;background: #f6f6f6">
        <ice-tree load-url="/permission/frame_org/load_table_tree?loadDisabled=false"
                  label-prop="deptShortName"
                  value-prop="deptCode"
                  @node-click="handleNodeClick"
                  :lazy="false">
        </ice-tree>
        <div style="display: flex;flex-grow: 1;flex-direction: column;margin-left: 5px">
            <div style="height: 40px;display: flex;align-items: center;justify-content: flex-end">
                <el-input placeholder="请输入用户编码或者姓名" v-model="inputValue" :clearable="true" style="width: 600px;"
                          @keyup.enter.native="search(true)">
                    <i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"
                       @click="search(true)"></i>
                </el-input>
            </div>
            <div style="display: flex;flex-grow: 1;flex-direction: row">
                <ice-query-grid
                        ref="queryGrid1"
                        style="width: 450px"
                        choose-item="multiple"
                        data-url="/permission/user/users_by_condition?cascade=true"
                        :columns="columns"
                        :query="query"
                        :hidden-qucik-query="true"
                        :grid-index="false"
                        :grid-auto-refresh="false"
                        page-layout="total, sizes, prev, next, jumper">
                    <template slot="quick-query" slot-scope="scope">
                        <div>待选用户列表(0/{{scope.total}})</div>
                    </template>
                </ice-query-grid>
                <div style="width: 100px;display: flex;flex-direction: column;justify-content: center">
                    <div style="width: 100px;height: 180px;display: flex;flex-direction: column;justify-content: space-around;align-items: center">
                        <el-button class="select-button">全部选择</el-button>
                        <el-button class="select-button">全部取消</el-button>
                        <el-button class="select-button">选择</el-button>
                        <el-button class="select-button">取消</el-button>
                    </div>
                </div>
                <ice-query-grid
                        ref="queryGrid2"
                        style="width: 450px"
                        choose-item="multiple"
                        data-url="/permission/user/users_by_condition?cascade=true"
                        :columns="columns"
                        :query="query"
                        :hidden-qucik-query="true"
                        :grid-index="false"
                        :grid-auto-refresh="false"
                        page-layout="total, sizes, prev, next, jumper">
                    <template slot="quick-query" slot-scope="scope">
                        <div>已选用户列表(0/{{scope.total}})</div>
                    </template>
                </ice-query-grid>
            </div>

        </div>

    </div>
</template>

<script>
    import IceTree from "./IceTree";
    import IceQueryGrid from "./IceQueryGrid";

    export default {
        name: "IceTransferTables",
        data() {
            return {
                columns: [{code: 'oid', hidden: true},
                    {label: '姓名', code: 'name', width: 120},
                    {label: '编码', code: 'code', width: 150},
                    /*{label: '联系电话', code: 'phone', width: 100},*/
                    {label: '部门', code: 'deptShortName', width: 100},],
                inputValue: '',
                selectValue: '',
                selectName: '',
                query: [{type: 'static', code: 'deptCode', value: () => this.selectValue},
                    {type: 'input', label: '姓名', code: 'name', value: () => this.inputValue, exp: 'like'},
                    {type: 'input', label: '编码', code: 'code', value: () => this.inputValue, exp: 'like'}
                ]
            }
        },
        methods: {
            handleNodeClick(data, node, nodeComponent) {
                //let item = this.$attrs.query.find(item => item.type == 'static' && item.code == this.parentProp);
                this.selectValue = node.data["deptCode"];
                this.selectName = node.data["deptName"];
                this.$nextTick(() => {
                    this.search(true)
                })
            },
            search(isQuick) {
                this.$refs.queryGrid1.search(isQuick);
                this.$refs.queryGrid2.search(isQuick);
            }
        },
        created() {

        },
        mounted() {

        },
        components: {IceQueryGrid, IceTree}
    }
</script>

<style lang="less" scoped>
    .select-button {
        margin: 0;
        border-radius: 10px;
        width: 80px;
    }
</style>