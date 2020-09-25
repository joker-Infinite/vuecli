/**
 * 获取表单页面根对象，一般指当前表单页面
 * @param $vm
 * @returns {*}
 */
function getFlowRootVm($vm) {
    let parent = $vm.$parent || $vm.$root;
    while (parent) {
        if (parent.$flowRoot) {
            return parent;
        }
        parent = parent.$parent;
    }
    return null;
}

import Vue from 'vue'
import store from '../../../store'

export default {
    data() {
        return {
            $axios: {},//被代理的$axios对象，发送请求默认添加流程信息
            $flowRoot: false,//标识本组件是否是表单页面
            $flowVm: null
        }
    },
    created() {
        this.$on("FlowContextBroadcastEvent", formVm => {
            this.$flowVm = formVm;
            this.$flowRoot = true;
        })

        /**
         * 针对流程页面的请求，自动附加流程实例相关信息
         * @param url 请求的URL
         * @param headers 请求附加的headers
         * @returns {{[p: string]: *}}
         */
        const getHeaders = (url, headers) => {

            if (!store.getters['permissionStore/isFormPager']) {
                return {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...headers
                }
            }


            if (!headers) {
                headers = {};
            }
            let $vm = this;
            if (!$vm.$flowRoot) {
                $vm = getFlowRootVm($vm)
                if (!$vm) {
                    $vm = this;
                }
            }

            let urlArr = url.split("?")
            let rootUrl = urlArr.length > 1 ? urlArr[0] : url

            if ($vm.$flowRoot) {

                let actInstId = $vm.$route.query['actInstId'];
                let dataId = $vm.$route.query['dataId'];
                let taskUserId = $vm.$route.query['taskUserId'];

                return {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'actInstId': actInstId || '',
                    'dataId': dataId || '',
                    'taskUserId': taskUserId || '',
                    'routeUrl': $vm.$route.fullPath || '',
                    'callActTransmitVar': $vm.$flowVm.callActTransmitVar ? JSON.stringify($vm.$flowVm.callActTransmitVar) : "",
                    'Sign-Headers': 'actInstId,dataId,taskUserId,routeUrl,callActTransmitVar',
                    ...headers
                }
            } else {
                return {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...headers
                }
            }

        }

        this.$axios = {
            get(url, config) {
                return Vue.prototype.$axios.get(url, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
            post(url, data, config) {
                return Vue.prototype.$axios.post(url, data, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
            put(url, data, config) {
                return Vue.prototype.$axios.put(url, data, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
            patch(url, data, config) {
                return Vue.prototype.$axios.patch(url, data, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
            request(config) {
                return Vue.prototype.$axios.request({
                    ...config,
                    headers: getHeaders(config.url, config ? config.headers : {})
                })
            },
            delete(url, config) {
                return Vue.prototype.$axios.delete(url, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
            head(url, config) {
                return Vue.prototype.$axios.head(url, {
                    ...config,
                    headers: getHeaders(url, config ? config.headers : {})
                })
            },
        }
    }
}