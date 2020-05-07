import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increase(state) {
            state.count++;
        },
        subtract(state) {
            state.count--;
        }
    },
    actions: {
        actionIncrease({commit}) {
            commit('increase');
        },
        actionSubtract({commit}) {
            commit('subtract');
        }
    },
    modules: {}
})
