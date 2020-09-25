<template>
    <div class="ice-dialog-wrapper" :style="{height:height}">
        <div class="ice-full-absolute" v-if="height&&autoScroll"
             style="overflow-y: auto;overflow-x: hidden;background: white;display: flex;flex-direction: column">
            <vue-scroll :ops="{bar:{background:'#000',opacity:0.4,keepShow:true,size:'8px',onlyShowBarOnScroll:true},scrollPanel:{scrollingX:false}}">
                <slot>
                    <!--<ice-dynamic-page style="padding-right: 10px;box-sizing: border-box" v-if="pageId" :page-id="pageId"
                                      :page-props="pageProps" :parent="parent" :params="params" ref="page">

                    </ice-dynamic-page>-->
                    <page-wrapper style="padding-right: 10px;box-sizing: border-box" v-if="pageId" :page-id="pageId"
                                  :page-props="pageProps" :parent="parent" :params="params" ref="page">

                    </page-wrapper>

                    <ice-dialog-view style="padding-right: 10px;box-sizing: border-box" :file-url="fileUrl"
                                     :page-props="pageProps" v-if="fileUrl" ref="page">

                    </ice-dialog-view>

                </slot>
            </vue-scroll>
        </div>
        <div v-else :style="{'background': 'white',height:height?height:'auto'}">
            <slot>
                <page-wrapper v-if="pageId" :page-id="pageId" :page-props="pageProps" :parent="parent"
                              :params="params" ref="page">

                </page-wrapper>
                <ice-dialog-view :file-url="fileUrl" :page-props="pageProps" v-if="fileUrl" ref="page">

                </ice-dialog-view>
            </slot>
        </div>
    </div>
</template>

<script>
    import VueScroll from 'vuescroll'
    import IceDialogView from "./IceDialogView";

    export default {
        name: "IceDialogWrapper",
        props: {
            height: String,
            autoScroll: {
                type: Boolean,
                default: true
            },
            pageId: String,
            //需要打开的文件路径
            fileUrl: String,
            pageProps: Object,
            //弹出层父级元素
            parent: Object,
            //弹出层附加参数
            params: Object
        },
        data() {
            return {}
        },
        methods: {
            getPageData() {
                if (this.$refs.page) {
                    if (this.fileUrl) {
                        if (this.$refs.page.getPageData) {
                            return this.$refs.page.getPageData();
                        } else {
                            return this.$refs.page
                        }
                    }

                    if (this.pageId) {
                        return this.$refs.page.getScriptContext();
                    }

                }
                return null
            }
        },
        created() {

        },
        components: {
            IceDialogView,
            VueScroll
        }
    }
</script>
<style scoped lang="less">
    .ice-dialog-wrapper {
        position: relative;
        width: 100%;
    }
</style>
