import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './auth'
import channels from './channels'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  getters: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    auth,
    channels,
  },
  plugins: [
    createPersistedState(),
  ],
})
