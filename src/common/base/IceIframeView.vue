<template>
    <div class="iframe" v-loading="loading">
        <iframe class="iframe"
                v-if="iframeSrc"
                :src="iframeSrc"
        >
        </iframe>
    </div>

</template>

<script>

    import qs from "qs";

    export default {
        name: "IceIframeView",
        props: {
            src: String,//iframe路径
            addToken: {//是否携带token
                type: Boolean,
                default: true
            },
            tokenKey: {//是否携带token
                type: String,
                default: "token"
            },
            params: Object
        },
        data() {
            return {
                loading: false,
                iframeSrc: ""
            }
        },
        methods: {
            async loadPage() {

                const params = {}


                if (this.addToken) {
                    this.loading = true
                    try {

                        const {data: token} = await this.$axios.get("/token/refresh")
                        params[this.tokenKey] = token
                        this.iframeSrc = src
                    } catch (e) {
                        this.$message.error(e.msg ? e.msg : '页面加载失败')
                    }
                    this.loading = false
                }

                if (this.params) {
                    for (let key in this.params) {
                        if (!key.startsWith("#") && !key.startsWith("$")) {
                            params[key] = this.params[key]
                        }
                    }
                }

                const paramsStr = qs.stringify(params)

                let src = ''
                if (this.src.indexOf("?") == -1) {
                    src = this.src + `?${paramsStr}`;
                } else {
                    src = this.src + `&${paramsStr}`;
                }
                this.iframeSrc = src

            }
        },
        watch: {
            src: {
                handler(value) {
                    if (value) {
                        this.loadPage()
                    }
                },
                immediate: true
            }
        }

    }
</script>

<style scoped>
    .iframe {
        margin: 0;
        padding: 0;
        border: none;
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
        overflow-y: hidden;
    }
</style>