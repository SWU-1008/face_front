import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: {},
    token: null
  },
  // mutations 必须同步执行
  mutations: {
    login (state, userInfo) {
      state.isLogin = true
      state.userInfo = userInfo
    },
    updateToken (state, token) {
      state.token = token
    }
  },
  // actions 使用 setTimeout 调用 mutation 可以实现异步操作
  actions: {
    login (context, userInfo) {
      context.commit('login', userInfo)
    },
    updateTokenAsync ({ commit }, token) {
      setTimeout(token => {
        commit('updateToken', token)
      }, 1000)
    }
  },
  modules: {},
  plugins: [persistedState()]

})
