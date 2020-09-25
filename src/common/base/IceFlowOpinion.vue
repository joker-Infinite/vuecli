<template>
    <ice-dialog title="处理意见" :visible.sync="dialogVisible" width="750px" height="500px" ref="flowRole">
        <div style="width: 100%;margin-bottom: 2px">
            <el-button type="primary" icon="el-icon-plus" @click="addDetailItem">新增</el-button>
        </div>
        <div style="display: flex;flex-direction: column;width: 100%;flex-grow: 1;height:460px" >
            <ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable" height="410px">
                <el-table-column :width="50"
                                 label="序号">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <!-- <ice-editable-table-column prop="operateType"
                                            :width="150"
                                            label="操作类型"
                                            input-type="input">
                 </ice-editable-table-column>-->
                <ice-editable-table-column prop="content"
                                           label="处理意见"
                                           input-type="input"
                                           maxlength="30"
                                           :showWordLimit="true"
                                           :width="null">
                </ice-editable-table-column>
                <el-table-column label="操作" :width="90">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </ice-editable-table>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">确认</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </div>


    </ice-dialog>
</template>



<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IceEditableTable from "@/components/common/base/IceEditableTable.vue";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn.vue";


    export default {
        name: 'IceFlowOpinion',
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceQueryGrid,
            IceGridLayout
        },
        props:{
            callBack: {type:Function,required:true}
        },
        data() {
            return {
                detailGridData:[{operateType:'', context: ''}],
                userData:{},
                detailRules: {
                   // operateType: {required: true,whitespace: true, message: '请输入类型', repeatable: false,trigger: 'blur'},
                    content: {required: true,whitespace: true, message: '请输入内容'},
                },
                dialogVisible:false,
                tittle:''
            }
        },
        methods: {
            /**新增下拉需要的值*/
            addDetailItem() {
                this.detailGridData.push({operateType:'', context: ''})
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                let row=this.detailGridData[index];
                //debugger
                if(row.oid){
                    this.$axios.delete("/bpm/UserOpinion/del", {params: {"id":row.oid}});
                }
                this.detailGridData.splice(index, 1);
            },
            /**关闭新增弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            },
            showDialog(row) {
                this.detailGridData=[{operateType:'', context: ''}];
                this.dialogVisible = true;
                if(row){
                    this.userData=row;
                }
            },
            setGridData(data){
                this.detailGridData=data;
            },
            /**保存*/
            save() {
                this.$refs.detailtable.validateAll((valid) => {
                    if(valid){
                        if(this.callBack){
                            this.callBack(this.userData,this.detailGridData);
                        }
                        this.dialogVisible = false;
                    }
                });
            }
        },
        watch:{

        }
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;

        .button-area {
            display: flex;
            justify-content: flex-end;
        }

    }
</style>
