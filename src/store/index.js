import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    LOADING: false,
    user: {
      loggedIn: false, // 是否登录
      isSubscribed: false // 是否订阅
    }
  },
  mutations: {
    showLoading (state) {
      state.LOADING = true
    },
    hideLoading (state) {
      state.LOADING = false
    }
  },
  actions: {
  },
  getters: {
    auth (state) {
      return state.user
    }
  },
  modules: {
  }
})
