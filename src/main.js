// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iView from 'iview'
import store from './store/store'
import router from './router';
import 'iview/dist/styles/iview.css'
import axios from './axios'


Vue.config.productionTip = false;
Vue.prototype.axios = axios;

Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

