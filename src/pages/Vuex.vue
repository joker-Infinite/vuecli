<template>
    <div class="main">
        <el-button @click="addNumber">+</el-button>
        <el-input :value="count"></el-input>
        <el-button @click="lessNumber">-</el-button>
        <el-button @click="getStates"></el-button>
    </div>
</template>

<script>

    export default {
        name: "Vuex",
        data() {
            return {}
        },
        computed: {
            count() {
                return this.$store.state.count;
            }
        },
        methods: {
            addNumber() {
                this.$store.dispatch('actionIncrease')
            },
            lessNumber() {
                this.$store.dispatch('actionSubtract')
            },
            getStates() {
                console.log(this.$store)
                let getState = this.$store.state;
                let getters = this.$store.getters;
                console.log(getState);
                console.log(getters);
            }
        }
    }
</script>

<style scoped lang="less">
    .main {
        text-align: center;

        .el-input {
            width: 100px;
        }
    }
</style>