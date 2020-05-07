import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import './plugins/element.js'
import store from "../src/store";

Vue.config.productionTip = false;

/*Vue.use(vuex);

const store = new Vuex.Store({
    state: {},//基本数据
    getters: {},//从基本数据派生出来的数据（对基本数据进行操作后的数据）
    actions: {},//像一个装饰器，包裹mutations，使之可以异步
    mutations: {},//提交更改数据的方法，同步
    // modules//模块化vuex
});*/

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
