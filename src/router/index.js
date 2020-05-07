import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home";
import Vuex from "../pages/Vuex";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Vuex',
        name: 'Vuex',
        component: Vuex
    }
]

const router = new VueRouter({
    routes
})

export default router
