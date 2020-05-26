<template>
    <div class="main">
        <el-button @click="addNumber">+</el-button>
        <el-input :value="count"></el-input>
        <el-button @click="lessNumber">-</el-button>
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
/*
*$store和store的区别
*$store是挂载在Vue的实例上的（即Vue.prototype），而组件也是一个Vue实例，在组件中可使用this访问原型上的属性，template拥有组件实例的上下文，
* 可直接通过{{$store.state.userName}}访问（等价于this.$store.state.userName）,
* store 使用{{store.state.userName}},需要先声明store才能使用
* */

/**
 * mixins:[] 混入
 * 将import导入的某个组件中的方法插入到当前组件，供当前组件使用
 * */
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
            //直接获取store中getters方法所返回的参数
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