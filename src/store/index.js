import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    number: 0
  },
  mutations: {
    showLoading(state) {
      state.loading = true
    },
    hideLoading(state) {
      state.loading = false
    },
    NUMBER_PLUS(state) {
      state.number++
    },
    NUMBER_MINUS(state) {
      state.number--
    }
  },
  actions: {
    NUMBER_PLUS_ASYNC({
      commit
    }) {
      commit('NUMBER_PLUS')
    },
    NUMBER_MINUS_ASYNC({
      commit
    }) {
      commit('NUMBER_MINUS')
    }
  },
  getters: {
    PLUS_COUNT: (state) => {
      return state.number * 2
    },
    MINUS_COUNT: (state) => {
      return state.number / 2
    }
  },
  modules: {}
})
