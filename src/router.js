import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import Login from '@/components/login'
import AllBar from '@/components/allBar'
import Register from '@/components/register'
import Error from '@/components/error404'
import DeviceList from '@/components/deviceList'
import Index from '@/components/index'
import UserInfo from '@/components/userInfo'

Vue.use(VueRouter);

const routers = [
  {
		path: '*',
		component: Error
	},
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
    },
  {
    path: '/',
    name: 'allBar',
    component: AllBar,
    redirect: '/',
    children:[
      {
        path: '/',
        name: 'index',
        component: Index
      },
      {
        path: '/deviceList',
        name: 'deviceList',
        component: DeviceList
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: UserInfo
       }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routers
});

export default router
