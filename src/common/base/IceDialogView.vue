<template>
    <div ref="viewref" tag="1233213">
    </div>
</template>
<script>
    import Vue from 'vue'
    import pathUtil from '@/utils/pathUtil.js'

    export default {
        name: "IceDialogView",

        props: {
            //需要打开的文件路径
            fileUrl: String,
            pageProps: Object
        },
        data() {
            return {
                activeVue: null
            }
        },
        methods: {
            mountView(fileurl) {
                /*const vueFile = require("@/pages/" + pathUtil.replacePathRoot(fileurl))
                vueFile.default.router = this.$router;
                vueFile.default.store = this.$store;

                if (this.activeVue) {
                    this.activeVue = new Vue({...vueFile.default, propsData: this.pageProps})
                        .$mount(this.activeVue.$el)
                } else {
                    console.log(this.pageProps)
                    this.activeVue = new Vue({...vueFile.default, propsData: this.pageProps})
                        .$mount(this.$refs.viewref)
                }*/
            },
            getPageData() {
                if (this.activeVue) {
                    if (this.activeVue.$getPageData && typeof this.activeVue.$getPageData == 'function') {
                        return this.activeVue.$getPageData();
                    } else {
                        return this.activeVue
                    }
                }
                return null
            },
            updateProp(prop, value) {

                this.$nextTick(_ => {
                    if (this.activeVue) {
                        this.activeVue.$set(this.activeVue, prop, value)
                    }
                })


            }
        },
        computed: {},
        watch: {
            fileUrl(value) {
                this.mountView(value)
            },
            pageProps: {
                handler(newValue, oldValue) {

                    for (let key in newValue) {
                        if ((!oldValue || newValue[key] != oldValue[key]) &&
                            typeof newValue[key] !== 'function') {//属性是function不更新，只更新基本数据
                            this.updateProp(key, newValue[key]);
                        }
                    }
                },
                deep: true,
                immediate: true
            }
        },
        mounted() {
            if (this.fileUrl) {
                this.mountView(this.fileUrl)
            }
        },
        components: {}
    }

</script>


<style scoped>

</style>
