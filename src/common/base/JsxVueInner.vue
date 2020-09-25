<script>
    export default {
        name: "JsxVueInner",
        data() {
            return {}
        },
        methods: {},
        created() {

        },
        props: {
            a: String
        },
        render(h, data) {
            // console.log(h)
            /*return (<div a="1">
                {this.$slots.default ? h("div", this.$slots.default) : <div>123</div>}
            </div>)*/
            // debugger
            return (<div id="JsxVueInner">JsxVueInner{this.a}</div>)
        },
        mounted() {

        },
        components: {}
    }
</script>

<style lang="less" scoped>

</style>