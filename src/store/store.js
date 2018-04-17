import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginUserName: ''
  },
  getters: {

  },
  mutations: {
    setLoginUserName(state,name){
      state.loginUserName = name
    }
  },
  actions: {
    setUser(context,name){
      context.commit("setLoginUserName",name)
    }
  }
})
