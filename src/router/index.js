import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import store from '../store'
import layout from '../views/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: layout,
    redirect: '/home',
    children: [
      // vue路由设置，path后面加/和不加有什么区别？
      // 去到child的时候，路径是#/child而不是#/fa/child，因为/xx就是根路径。
      // 而不以斜杠开头的，都会被当成普通的字符串拼到后面。
      { path: 'home', name: 'home', component: Home },
      { path: 'component', name: 'component', component: () => import(/* webpackChunkName: "about" */ '../views/Home/component.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login/register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const whiteList = ['/login', '/register'] // 不需要登陆的页面
// 全局前置守卫,验证是否登录
router.beforeEach(function (to, from, next) {
  console.log(store.state.isLogin)
  // 登录
  if (store.state.isLogin) {
    next()
  } else {
    // 未登录，但是在白名单
    if (whiteList.indexOf((to.path)) !== -1) {
      next()
    } else {
      // 没有登录，访问的地址不在白名单，那就让他登录再访问
      next({ path: '/login' })
    }
  }
})

export default router
