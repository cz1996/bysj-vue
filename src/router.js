import Login from '@/components/login'
import AllBar from '@/components/allBar'
import Error from '@/components/error404'

const router = [
  {
		path: '*',
		component: Error
	},
  {
    path: '/images',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'allBar',
    component: AllBar
  }
];

export default router
