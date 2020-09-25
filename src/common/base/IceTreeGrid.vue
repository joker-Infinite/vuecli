<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <div class="ice-title" v-if="$attrs.title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>{{$attrs.title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- <div style="height: 900px">1</div>
         <div>2</div>-->
        <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
            <ice-tree v-bind="$attrs" ref="tree"
                      @node-click="handleNodeClick"
                      @node-check="nodeCheck">
                <slot name="prefix" slot="prefix"></slot>
            </ice-tree>
            <div class="editableArea">
                <ice-query-grid
                        ref="queryGrid"
                        :grid-auto-refresh="false"
                        v-bind="$attrs"
                        :lazy="false"
                        :before-bind-data="dataFilter"
                        v-on="$listeners">
                    <template slot="operation-bar-expand">
                        <slot name="operation-bar-expand"></slot>
                    </template>

                </ice-query-grid>
                <slot name="bottom"></slot>
            </div>
        </div>

    </div>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceQueryGrid from "./IceQueryGrid";
    import IceQueryGridTemplate from '@/components/common/base/IceQueryGridTemplate'
    import IceTreeTemplate from '@/components/common/base/IceTreeTemplate'

    export default {
        name: "IceTreeGrid",
        /*mixins: [IceQueryGridTemplate, IceTreeTemplate],*/
        props: {
            parentProp: {//父节点字段名，用于刷新网格数据
                type: String,
            },
            parentValueProp: {//用于右边网格刷新，表示网格选中值，如果则用树形的value值
                type: String,
            },
            isLoadParentData:{//是否传递父组件处理后的值进行渲染--用于before-bind-data
                type:Boolean,
                default:false,
            },
            loadParentData: Function,//配合isLoadParentData一起使用，返回值是一个数组
        },
        data() {
            return {
                selectValue: null
            }
        },
        methods: {
            refreshList() {
                this.$refs.queryGrid.refresh();
            },
            handleNodeClick(data, node, nodeComponent) {
                //let item = this.$attrs.query.find(item => item.type == 'static' && item.code == this.parentProp);
                if (this.parentValueProp) {
                    this.selectValue = node.data[this.parentValueProp];
                } else {
                    this.selectValue = data
                }
                this.$emit("node-click", data, node, nodeComponent);
                this.$nextTick(() => {
                    this.$refs.queryGrid.refreshAndPageReset();
                })

            }
            ,
            cleanColumnSelect() {
                this.$refs.queryGrid.cleanColumnSelect();
            },
            closeSelection(value) {
                this.$refs.queryGrid.closeSelection(value);
            },
            dataFilter(data) {
                if (data) {
                    data.forEach(item => {
                        delete item.children;
                    });
                    this.$emit('pagClick', data);
                    let arr = [];
                    if(this.isLoadParentData){
                        arr = this.loadParentData();
                        return arr;
                    }
                    return data;
                } else {
                    this.$emit('pagClick', data);
                    let arr = [];
                    if(this.isLoadParentData){
                        arr = this.loadParentData();
                        return arr;
                    }
                    return []
                }
            },
            addNode(data) {
                this.$refs.tree.addNode(data);
            },
            updateNode(data) {
                this.$refs.tree.updateNode(data);
            },
            deleteNode() {
                this.$refs.tree.deleteNode();
            },
            rmoveNode(key) {
                if (key) {
                    this.$refs.tree.remove(key);
                }
            },
            nodeCheck(changeNode, nodeStatus) {
                this.$emit('node-check', changeNode, nodeStatus)
            },
            setChecked(key_data, checked, deep) {
                this.$refs.tree.setChecked(key_data, checked, deep)
            },
            getCheckedNodes(leafOnly, includeHalfChecked) {
                return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
            },
            setCheckedNodes(nodes) {
                this.$refs.tree.setCheckedNodes(nodes)
            },
            setCheckedKeys(keys, leafOnly) {
                this.$refs.tree.setCheckedKeys(keys, leafOnly)
            },
            resetChecked() {
                this.$refs.tree.$refs.tree.setCheckedKeys([]);
            },
            reDoSelection() {
                this.$refs.queryGrid.reDoSelection()
            },
            /*通过 key 设置某个树节点的当前选中状态*/
            setTreeCurrentKey(key) {
                this.$refs.tree.setCurrentKey(key);
                this.selectValue = key;
                this.$nextTick(() => {
                    this.$refs.queryGrid.refreshAndPageReset();
                })
            },
            /*通过 node  设置某个树节点的当前选中状态*/
            setTreeCurrentNode(node) {
                this.$refs.tree.setCurrentNode(node);
                if (this.parentValueProp && node && node.data) {
                    this.selectValue = node.data[this.parentValueProp];
                } else {
                    this.selectValue = data
                }
                this.$nextTick(() => {
                    this.$refs.queryGrid.refreshAndPageReset();
                })
            },
            refreshAndPageReset() {
                this.$nextTick(() => {
                    this.$refs.queryGrid.refreshAndPageReset();
                })
            }

        },
        watch: {},
        computed: {},
        created() {

        },
        mounted() {
            if (this.parentProp) {
                this.$attrs.query.push({type: 'static', code: this.parentProp, value: () => this.selectValue});
            }

        },
        components: {
            IceQueryGrid,
            IceTree
        }
    }

</script>

<style lang="less" scoped>


    .editableArea {
        flex-grow: 1;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        padding: 5px;
        background: white;
        margin-left: 5px;

        .operation-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            flex-shrink: 0;
            padding: 5px 10px;
            background: #ffffff;
        }

        .grid-bar {
            flex-grow: 1;
            flex-shrink: 1;
            position: relative;
        }
    }
</style>
