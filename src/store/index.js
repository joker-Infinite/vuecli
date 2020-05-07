import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0,
        todos: [
            {id: 1, text: '水果类', done: true},
            {id: 2, text: '苹果', done: true},
            {id: 3, text: '荔枝', done: false}
        ],
        bankName: '中国银行'
    },
    mutations: {
        increase(state) {
            state.count++;
        },
        subtract(state) {
            state.count--;
        },
        newBankName: (state, msg) => {
            state.bankName = msg;
        }
    },
    actions: {
        /*
        * commit:同步操作，写法：this.$store.commit('mutations方法名',值)，数据提交至mutations，可用于登陆成功后读取用户信息，写到缓存里
        * dispatch:异步操作（向后台提交数据），写法： this.$store.dispatch('mutations方法名',值),数据提交至actions，可用于向后台提交数据
        * */
        actionIncrease({commit}) {
            commit('increase');
        },
        actionSubtract({commit}) {
            commit('subtract');
        }
    },
    getters: {
        doneTodos: state => {//通过方法访问
            return state.todos.filter(todo => todo.done);
        },
        doneTodosCount: ((state, getters) => {//通过属性访问
            return getters.doneTodos.length;
        }),
        bankName: state => {
            return state.bankName;
        }
    },
    modules: {}
})
