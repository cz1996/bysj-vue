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
import AddEqu from '@/components/addEqu'
import DeviceInfo from '@/components/deviceInfo'
import EditEquInfo from '@/components/editEquInfo'
import ChangeEqu from '@/components/changeEqu'

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
        path: '/addEqu',
        name: 'addEqu',
        component: AddEqu
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: UserInfo
      },
      {
        path: '/deviceInfo',
        name: 'deviceInfo',
        component: DeviceInfo
      },
      {
        path: '/editEquInfo',
        name: 'editEquInfo',
        component: EditEquInfo
      },
     {
       path: '/changeEqu',
       name: 'changeEqu',
       component: ChangeEqu
     }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routers
});

export default router
