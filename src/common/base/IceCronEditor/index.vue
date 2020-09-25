<template>
    <div>
        <el-input :value="value" readonly>
            <el-button slot="append" icon="el-icon-time" @click="openDialog" unauth :priorDisabled="priorDisabled">编辑</el-button>
        </el-input>
        <ice-dialog :visible.sync="visible" title="定时任务规则编辑" width="1000px" height="500px">
            <crontab :expression="value" @fill="fill" @hide="visible=false" :priorDisabled="priorDisabled"></crontab>
        </ice-dialog>
    </div>
</template>
<script>
    import Crontab from './widget/Crontab.vue'
    import IceDialog from "../IceDialog";

    export default {
        name: "IceCronEditor",
        components: {IceDialog, Crontab},
        model: {
            prop: 'value',
            event: 'change'
        },
        inheritAttrs: false,
        props: {
            value: String,
            priorDisabled:{
                type:String,
                default:'false'
            }
        },
        data() {
            return {
                visible: false,
                expression: ''
            }
        },
        methods: {
            openDialog() {
                this.visible = true;
            },
            fill(value) {
                this.$emit('change', value)
            }
        },
        /* watch:{

         },
         created() {
             this.expression = this.value;
         }*/

    }
</script>
