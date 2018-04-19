import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginUserName: '',
    pageName: ["系统首页"]
  },
  getters: {

  },
  mutations: {
    setLoginUserName(state,name){
      state.loginUserName = name
    },
    setPageName(state,name){
      state.pageName = name
    }
  },
  actions: {
    setUser(context,name){
      context.commit("setLoginUserName",name)
    },
    setPage(context,name){
      context.commit("setPageName",name)
    }
  }
})
