<template>
    <div class="flow-pic">
        <div style="width: 600px;height: 600px;display: flex;justify-content: center">
            <ice-flow-image :json="flowContext.bpmDefJson" v-if="flowContext.bpmDefJson"></ice-flow-image>
        </div>
        <div class="remark">
            <div class="title">{{flowContext.actDefName}}</div>
            <div style="margin: 10px 0">流程说明：</div>
            <div v-html="flowContext.bpmDescribe" class="flow_description">
            </div>
        </div>
    </div>
</template>

<script>
    import IceFlowImage from "./IceFlowImage";

    export default {
        name: "IceFlowPreview",
        props: {
            bpmDefKey: String
        },
        data() {
            return {
                flowContext: {
                    actDefName: "",
                    bpmDescribe: '',
                    bpmDefJson: ''
                }
            }
        },
        methods: {
            async loadBpmDef(defKey) {
                const {data} = await this.$axios.get(`/bpm/definition/getByDefKey?defKey=${defKey}`)
                this.flowContext = data
            }
        },
        computed: {},
        watch: {
            bpmDefKey: {
                handler(value) {
                    this.flowContext = {}
                    this.loadBpmDef(value)
                },
                immediate: true
            }
        },
        mounted() {

        },
        components: {IceFlowImage}
    }

</script>


<style scoped lang="less">
    .flow-pic {
        height: 600px;
        display: flex;

        img {
            max-width: 600px;
            max-height: 700px;
        }

        .remark {
            box-sizing: border-box;
            padding: 5px;
            width: 300px;
            color: #a94442;

            .title {
                font-size: 20px;
            }

            span {
                display: block;
            }
        }
    }
</style>
