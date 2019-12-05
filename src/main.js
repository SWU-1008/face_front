import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import * as api from './http/api'

Vue.config.productionTip = false
// 全局注册api，这样页面中就可以直接使用 this.$api.login() 调用方法了，不然的话就要 import {login} from '/path/to/api.js'
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
