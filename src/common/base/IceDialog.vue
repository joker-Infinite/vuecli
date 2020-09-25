<template>
    <el-dialog v-dialogDrag :center="true" :append-to-body="appendToBody" v-bind="{...$attrs}" v-on="$listeners"
               :width="width" :title="title"
               :close-on-click-modal="closeOnClickModal"
               :visible.sync="visibleInner" :show-close="loading?false:showClose">
        <p slot="title">{{title}}<span v-if="doSecret">(<span style="color: red">非涉密表单请勿填写涉密信息</span>)</span></p>
        <div style="width:100%;height: auto" ref="wrapper" v-loading="loading" :element-loading-text="loadingText">
            <ice-dialog-wrapper :height="height"
                                :autoScroll="autoScroll"
                                :page-id="pageId"
                                :file-url="fileUrl"
                                :page-props="pageProps"
                                :parent="parent"
                                :params="params"

                                v-if="remounted?visibleInner:true"
                                ref="pageWrapper">
                <slot></slot>
            </ice-dialog-wrapper>
        </div>

        <div class="ice-button-bar" slot="footer" v-if="(buttons&&buttons.length>0)||$scopedSlots.footer" v-loading="loading" element-loading-spinner="123">
            <slot name="footer">
                <el-button :type="item.iscannel?'info':'primary'"
                           v-for="item in buttons"
                           unauth
                           :key="item.name"
                           :disabled="disabled(item)"
                           @click="item.iscannel?close(item):confirm(item)">
                    {{item.name}}
                </el-button>
                <!--                <el-button type="primary">按鈕2</el-button>
                                <el-button type="primary">按鈕3</el-button>-->
            </slot>
        </div>

    </el-dialog>
</template>

<script>
    import IceDialogWrapper from "./IceDialogWrapper";

    export default {
        name: "IceDialog",
        props: {
            title: {
                type: String,
                default: '标题'
            },
            visible: {
                type: Boolean,
                default: false
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            appendToBody: {
                type: Boolean,
                default: true
            },
            width: {
                type: String,
                required: true
            },
            height: String,
            autoScroll: {
                type: Boolean,
                default: true
            },
            buttons: Array,
            //弹出层重新打开时候是否重新挂载内容
            remounted: Boolean,
            //表单设计器设计页面id
            pageId: String,
            //需要打开的文件路径
            fileUrl: String,
            pageProps: Object,
            //弹出层父级元素
            parent: Object,

            //弹出层附加参数
            params: Object,
            doSecret: {//是否涉密,用于标题是否提示
                type: Boolean,
                default: false
            },

            loading:Boolean,//是否遮罩
            loadingText:String,//遮罩描述,

            showClose:{//是否显示关闭按钮，兼顾之前的使用
                type:Boolean,
                default:true,
            }
        },
        data() {
            return {
                visibleInner: false
            }
        },
        computed: {
            reverseButtons() {
                // debugger
                if (this.buttons) {
                    return this.buttons.reverse();
                } else {
                    return []
                }
            },

        },
        methods: {
            async close(button) {

                if (button) {
                    if (button.click) {

                        try {

                            const result = await button.click(button, this.$refs.pageWrapper.getPageData())
                            if (result !== false) {
                                this.visibleInner = false;
                            }
                        } catch (e) {
                            console.error(e)
                            this.$message.error(e)
                        }

                    } else {
                        this.visibleInner = false;
                    }
                }

            },
            async confirm(button) {
                if (button) {
                    if (button.click) {
                        try {

                            const result = await button.click(button, this.$refs.pageWrapper.getPageData())
                            if (result !== false) {
                                this.visibleInner = false;
                            }
                        } catch (e) {
                            console.error(e)
                            if (e.msg) {
                                this.$message.error(e.msg);
                            } else {
                                this.$message.warning(e);
                            }
                        }

                    } else {
                        this.visibleInner = false;
                    }
                }

            },
            disabled(item) {
                //  debugger
                if (this.$refs.pageWrapper) {
                    return typeof (item.disabled) === 'undefined' ? false :
                        ((typeof item.disabled == 'function') ? item.disabled(this.$refs.pageWrapper.getPageData()) : item.disabled)
                } else {
                    return typeof (item.disabled) === 'undefined' ? false :
                        ((typeof item.disabled == 'function') ? item.disabled() : item.disabled)
                }

            },
            /* closeDialog() {
                 //console.log("closeDialog", this)
                 this.visibleInner = false;
             }*/
        },
        created() {

        },
        watch: {
            visibleInner(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit("update:visible", this.visibleInner);
                }

                if (newValue) {
                    this.$nextTick(_ => {
                        const wrapper = this.$refs.wrapper;
                        const pageWrapper = this.$refs.pageWrapper.$el;
                        wrapper.style.height = pageWrapper.offsetHeight + "px";
                    })
                }

            },
            visible() {
                this.visibleInner = this.visible;
            }
        },
        mounted() {

        },
        components: {IceDialogWrapper}
    }
</script>

<style lang="less" scoped>
    .ice-button-bar {
        padding: 0px 16px 5px 10px;
    }
    /deep/ .el-dialog{
        border-radius: 10px!important;
    }
    /deep/ .el-dialog__header{
        border-radius: 10px!important;
    }
    /deep/ .el-dialog__body{
        border-radius: 10px!important;
    }
</style>
