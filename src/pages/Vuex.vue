<template>
    <div class="main">
        <el-button @click="addNumber">+</el-button>
        <el-input :value="count"></el-input>
        <el-button @click="lessNumber">-</el-button>
        <el-button @click="getStates">getters</el-button>
        <el-button @click="newBankName">commit</el-button>
        <br>
        {{todoes}}****
        {{doneTodosCounts()}}****
        {{doneTodos}}****
        {{doneTodosCount}}****
        {{bankName}}
    </div>
</template>

<script>

    import {mapGetters} from "vuex";

    export default {
        name: "Vuex",
        data() {
            return {}
        },
        computed: {
            count() {
                return this.$store.state.count;
            },
            todoes() {
                return this.$store.getters.doneTodos;
            },
            //直接获取store中的方法所返回的参数
            ...mapGetters([
                'doneTodos',
                'doneTodosCount',
                'bankName'
            ])
        },
        methods: {
            doneTodosCounts() {
                return this.$store.getters.doneTodosCount;
            },
            addNumber() {
                this.$store.dispatch('actionIncrease')
            },
            lessNumber() {
                this.$store.dispatch('actionSubtract')
            },
            getStates() {
                let getState = this.$store.state;
                let getters = this.$store.getters;
                console.log(getState);
                console.log(getters);
            },
            newBankName() {
                this.$store.commit('newBankName', '汇丰银行');
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