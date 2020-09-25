<script>
    export default {
        name: "JsxVue",
        data() {
            return {}
        },
        methods: {},
        created() {

        },
        render(h) {
           // console.log(this.$slots.default.render, this.$scopedSlots.default)
            /*console.log(h, this.$scopedSlots.default())*/
            /*return (<div a="1">
                {this.$slots.default ? h("div", this.$slots.default) : <div>123</div>}
            </div>)*/
            return (<div a="1">
                {(() => {
                    if (this.$scopedSlots.default) {
                        return this.$scopedSlots.default(h)
                    } else {
                        return <div>123</div>
                    }
                })()}
            </div>)
        },
        mounted() {

        },
        components: {}
    }
</script>

<style lang="less" scoped>

</style>