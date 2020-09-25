<template>
    <ice-pop-selector text-prop="bpmDefName"
                      code-prop="actDefKey"
                      mode="hidden"
                      :selections="selections"
                      :query="flowQuery"
                      :columns="flowColumns"
                      data-url="/bpm/definition/list"
                      ref="selectFlow"
                      v-on="$listeners"
                      v-bind="$attrs">
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "./IcePopSelector";
    export default {
        name: "IceFlowSelector",
        components: {IcePopSelector},
        data(){
            return{
                selections:[],
                flowQuery: [
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: '', exp: 'like'},
                    {type: 'input', label: '流程KEY', code: 'actDefKey', value: '', exp: 'like'}
                ],
                flowColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {label: '流程名称', code: 'bpmDefName', width: 300,align:'left'},
                    {label: '流程KEY', code: 'actDefKey', width: 200, sortable: true,align:'left'},
                    {label: '流程版本', code: 'versionNo', width: 100}
                ],
            }
        },
        methods:{
            openDialog(){
                //每次打开弹窗，清空选择的数据，若要回显，请加方法
                this.selections = [];
                this.$refs.selectFlow.openDialog();
            }
        }
    }
</script>

<style scoped>

</style>
