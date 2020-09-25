<template>
    <el-form :model="iceModel" v-bind="$attrs" label-position="right" ref="refName">
        <slot></slot>
    </el-form>
</template>

<script>
    export default {
        name: "IceForm",
        props: {
            iceModel: Object,
            refName: String
        },
        data() {
            return {}
        },
        methods: {
            validate(...params) {
                return this.$refs.refName.validate(...params)
            },
            validateField(...params) {
                return this.$refs.refName.validateField(...params)
            },
            resetFields(...params) {
                return this.$refs.refName.resetFields(...params)
            },
            clearValidate(...params) {
                return this.$refs.refName.clearValidate(...params)
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {}
    }

</script>


<style scoped>

</style>
