<template>
    <div class="main">
        <el-button @click="goto('/Vuex')">Vuex</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {}
        },
        methods: {
            goto(path) {
                this.$router.push(path);
            }
        }
    }
</script>

<style lang="less">
    .main {
        width: 100%;
        height: 100%;
        position: fixed;
        background: #7d7d7d;
    }
</style>