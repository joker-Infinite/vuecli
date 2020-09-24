<template>
    <div class="main">
        <el-button @click="goto('/Vuex')">Vuex</el-button>
        <el-button @click="changeComponent">切换组件</el-button>
        <component :is="component"></component>
    </div>
</template>

<script>
    import common from './common'

    export default {
        name: "Home",
        components: {...common},
        data() {
            return {
                component: 'vueFirst'
            }
        },
        methods: {
            goto(path) {
                this.$router.push(path);
            },
            changeComponent() {
                if (this.component === 'vueFirst') {
                    this.component = 'vueSecond'
                } else {
                    this.component = 'vueFirst'
                }
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