<template>
    <ice-dialog :visible.sync="visible" title="打印预览" width="900px" height="400px">
        <iframe ref="container" :style="`width: 100%;height: ${height}px`" class="container" @load="reinitIframe">

        </iframe>
        <div slot="footer" class="ice-center-button-bar">
            <el-button type="primary" :disabled="!html" @click="confirmPrint">打印</el-button>
            <el-button type="info" @click="visible=false">取消</el-button>
        </div>
    </ice-dialog>

</template>

<script>
    import printUtil from '@/utils/printUtil'
    //表单打印预览页面
    export default {
        name: "IceFlowPrintView",
        data() {
            return {
                html: '',
                visible: false,
                height: 300
            }
        },
        methods: {
            print(html) {
                this.html = html
                if (!this.html) {
                    this.$message.error("未检测到可以打印的信息，请联系管理员！")
                    return
                }
                this.visible = true

                this.$nextTick(_ => {
                    if (window.Blob) {
                        let blob = new Blob([html], {type: `text/html`})
                        var iframeDom = this.$refs.container;
                        iframeDom.src = URL.createObjectURL(blob);
                    } else {
                        this.$confirm('当前浏览器不支持打印预览，是否直接打印?', '提示', {
                            confirmButtonText: '打印',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.confirmPrint()
                        }).catch(() => {
                            this.visible = false
                        });
                    }
                })


            },
            reinitIframe() {
                var iframe = this.$refs.container;
                try {
                    var bHeight = iframe.contentWindow.document.body.scrollHeight;
                    var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
                    var height = Math.min(bHeight, dHeight);
                    this.height = height;
                    // console.log(iframe.height);
                } catch (ex) {
                }
            },
            confirmPrint() {
                this.visible = false
                this.$nextTick(_ => {
                    printUtil.printHtml(this.html)
                })
            }
        },
        computed: {},

        components: {}
    }

</script>


<style scoped>
    .container {
        border: none;
        padding: 0;
        margin: 0;
    }
</style>
