<template>
    <el-table ref="treeTable" :data="formatData" :row-style="showRow" v-bind="$attrs" @row-click="rowClickHandler"
              :highlight-current-row="true">
        <el-table-column v-if="showCheck"
                         type="selection"
                         width="40">
        </el-table-column>
        <el-table-column width="250" align="left">
            <template slot-scope="scope">
                <div :style="calWidth(scope.row._level)" @click="toggleExpanded(scope.$index)">
                    <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
                    <span v-if="iconShow(0,scope.row)" class="tree-ctrl">
                      <i v-if="!scope.row._expanded" class="el-tree-node__expand-icon el-icon-caret-right "/>
                      <i v-else class="expanded el-tree-node__expand-icon el-icon-caret-right"/>
                    </span>
                    {{ scope.row[showProp] }}
                </div>
            </template>
        </el-table-column>
        <slot/>
    </el-table>
</template>

<script>

    import treeToArray from '@/utils/evalTree.js'

    export default {
        name: "IceTreeTable",
        props: {
            showCheck: {
                type: Boolean,
                default: false
            },
            rowClickHandler: {
                type: Function,
                default: function () {
                }
            },
            showProp: {
                type: String,
                default: "event"
            },
            beforeExpanded: {
                //懒加载需要更新data时使用
                type: Function,
                default: function () {
                    return new Promise((resolve, reject) => {
                        //参数用来控制是否执行formatData
                        resolve();
                    });
                }
            },
            data: {
                type: [Array, Object],
                required: true
            },
            expandAll: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                treeTableData: []
            };
        },
        mounted() {
            // debugger;
            // this.treeTableData = this.formatData();
            // debugger;
        },
        computed: {
            // 格式化数据源
            formatData() {
                let tmp;
                if (!Array.isArray(this.data)) {
                    tmp = [this.data]
                } else {
                    tmp = this.data
                }
                const func = treeToArray;
                const args = [tmp, this.expandAll];
                return func.apply(null, args);
            }
        },
        methods: {
            calWidth: function (level) {
                return "text-align: left;cursor: pointer;padding-left:" + 15 * (level - 1) + "px";
            },
            showRow: function (row) {
                const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true);
                row.row._show = show;
                return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;';
            },
            // 切换下级是否展开
            toggleExpanded: function (trIndex) {
                let _this = this;
                const record = _this.formatData[trIndex];
                this.beforeExpanded(record).then(() => {
                    // const record = _this.formatData[trIndex];
                    record._expanded = !record._expanded
                })

            },
            expand: function (trIndex) {
                const record = this.formatData[trIndex];
                if (!record._expanded) {
                    this.toggleExpanded(trIndex)
                }
            },
            // 图标显示
            iconShow(index, record) {
                return true;
                // return (index === 0 && record.children && record.children.length > 0);
            }
        }
    }

</script>


<style rel="stylesheet/css">
    @keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @-webkit-keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
<!--

<style lang="scss" rel="stylesheet/scss" scoped>
    $color-blue: #2196F3;
    $space-width: 26px;
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: $space-width;
        height: 14px;

        &::before {
            content: ""
        }
    }

    .processContainer {
        width: 100%;
        height: 100%;
    }

    table td {
        line-height: 26px;
    }

    .tree-ctrl {
        display: inline-block;
        position: relative;
        cursor: pointer;
        color: $color-blue;
        padding-left: 10px;
        margin-left: -$space-width;
        margin-right: 4px;
    }
</style>-->
