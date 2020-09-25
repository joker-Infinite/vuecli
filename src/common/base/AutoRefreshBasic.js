import Vue from "vue";

export default {
    beforeRouteEnter(to, from, next) {
        let dom = document.getElementById('$base-content');
        if(dom && dom.parentNode.childNodes.length>1){
            for (let i = dom.parentNode.childNodes.length-1; i >=0 ; i--) {
                if(dom.parentNode.childNodes[i].classList.contains('el-loading-mask')){
                    dom.parentNode.removeChild(dom.parentNode.childNodes[i]);
                }
            }
        }
        next();
        Vue.prototype.$pageUrl = to.fullPath;
        if (to &&
            to.matched.length > 0) {
            const vueInst = to.matched[to.matched.length - 1].instances.default;
            if (vueInst && vueInst.$refresh) {
                vueInst.$refresh();
            }
        }
        // console.log("beforeRouteEnter")
    }
}
