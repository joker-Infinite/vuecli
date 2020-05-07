import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home";
import Vuex from "../pages/Vuex";

Vue.use(VueRouter);

/*
* 完整的导航解析流程
*1、导航被触发。
*2、在失活的组件里调用离开守卫。
*3、调用全局的 beforeEach 守卫。
*4、在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
*5、在路由配置里调用 beforeEnter。
*6、解析异步路由组件。
*7、在被激活的组件里调用 beforeRouteEnter。
*8、调用全局的 beforeResolve 守卫 (2.5+)。
*9、导航被确认。
*10、调用全局的 afterEach 钩子。
*11、触发 DOM 更新。
*12、用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
* */

const routes = [
    {
        path: '/Home',
        name: 'Home',
        component: Home,
        //路由独享的守卫
        //beforeRouteEnter是唯一支持给next传递回调的守卫，对于beforeRouteUpdate，beforeRouteLeave来说，this已经可用了，所以不支持传递回调，没有必要
        beforeRouteEnter: (to, from, next) => {
            /*
            * 在渲染该组件的对应路由被confirm前调用
            * 不能获取组件实例 'this'
            * 守卫执行前，实例还没有被创建
            * */
            console.log('beforeRouteEnter', to);
            next();
            /*
            * 可以通过传一个回调给next来访问组件实例，在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数
            * */
            //通过vm访问组件实例

            /*next(vm => {
            });*/
        },
        beforeRouteUpdate: (to, from, next) => {
            /*
            * 在当前路由改变，但是该组件被复用时调用
            * 例：对于一个带有动态参数的路径/Home/:id,在/Home/1和/Home/2之间跳转的时候
            * 因为会渲染同样的Home组件，组件实例会被复用，这个钩子会在此时被调用
            * 可以访问组件实例 'this'
            * */
            console.log('beforeRouteUpdate', to);
            next();
        },
        //beforeRouteLeave通常用来禁止用户在还未保存修改前突然离开，该导航守卫可以通过 next(false)来取消
        beforeRouteLeave: (to, from, next) => {
            /*
            * 导航离开该组件的对应路由时调用
            * 可以访问组件实例 'this'
            * */
            console.log('beforeRouteLeave', to);
            next();
        }
    },
    {
        path: '/Vuex',
        name: 'Vuex',
        component: Vuex
    },
    //通过路径进行重定向(当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b)
    /*{
        path: '/',
        redirect: '/Home'//路由重定向，当路由为'/'(未知路由)时，将页面的路由修改为首页
    },*/
    //通过name进行重定向
    /* {
         path: '/',
         redirect: {name: 'Home'}
     },*/
    /*   {
           path: '/',
           name: '/',
           redirect: to => {
               console.log(to);
               const {hash, params, query, path} = to;
               if (path === '/') {
                   return {path: '/Home', query: null}
               }
               console.log(hash, params, query);
           }
       },*/
    //别名('/Home'的别名是'/'，当用户访问'/'时，URL会保持为'/'，但是路由匹配则为'/Home',页面显示的为'/Home'的内容，就像是在访问'/Home')
    /* {
         path: '/Home', component: Home, alias: '/'
     }*/
];

const router = new VueRouter({
    routes
});
/*
*全局前置守卫
* 当一个导航触发时，全局前置守卫按照创建顺序调用，守卫是异步解析执行，此时导航在所有守卫resolve完之前一直处于等待中
* */
router.beforeEach((to, from, next) => {
    /*
    * to:即将要进入的目标路由对象
    * from:当前导航正要离开的路由
    *next():一定要调用该方法来resolve这个钩子，执行效果取决于next的参数
    * 1、next() 进行下一个钩子，如果钩子全部执行完了，则导航的状态就是confirmed(确认的)
    * 2、next(false) 中断当前的导航，如果浏览器的URL改变了（可能是用户手动或者浏览器后退按钮），那么URL地址会重置到from路由对应的地址
    * 3、next('/')或者next({path:'/'}) 跳转到一个不同的地址，当前的导航被中断，然后进行一个新的导航，可以向next传递任意位置对象，
    * 且允许设置诸如replace:true、name:'Home'之类的选项以及任何用在router-link的to prop或router.push中的选项
    * 4、next(error) 如果传入next的参数是一个error实例，则导航会被终止且该错误会被传递给router。onError()注册过的回调
    *
    * 确保要调用next方法，否则钩子就不会被resolved
    * */

    if (to.path == '/') {
        next({path: '/Home'})
    } else {
        next();
    }
});
/*
* 全局解析守卫
*
* 导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
* */
router.beforeResolve((to, from, next) => {
    console.log('beforeResolve', to);
    next();
});
/*
* 全局后置钩子
*
* 和守卫不同，这些钩子不会接受next函数也不会改变导航本身(进入某个路由后触发)
* */
router.afterEach((to, from) => {
    window.scrollTo(0, 0);
});
export default router
