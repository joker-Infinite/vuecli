<template>
    <div class="main">
        <el-button @click="goto('/Vuex')">Vuex</el-button>
        <component is="vueFirst"></component>
    </div>
</template>

<script>
    import common from './common/index'

    export default {
        name: "Home",
        components: {...common},
        data() {
            return {}
        },
        methods: {
            goto(path) {
                this.$router.push(path);
            }
        },
        mounted() {
            console.log(this.common)
        }
    }
</script>

<style scoped lang="less">
    .main {
        width: 100%;
        height: 100%;
        position: fixed;
        background: #7d7d7d;
    }
</style>