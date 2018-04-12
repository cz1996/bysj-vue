import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import page01 from '@/components/page01'
import page02 from '@/components/page02'
import page01A from '@/components/page01/page01-A'
import page01B from '@/components/page01/page01-b'
import pageEnd from '@/components/page01/B/end'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/page01',
      name: 'page01',
      component: page01,
      children: [
        {
          path: 'page01-a',
          name: 'page01A',
          component: page01A
        },
        {
          path: 'page01-b',
          name: 'page01B',
          component: page01B,
          children: [
            {
              path: 'end',
              name: 'pageEnd',
              component: pageEnd
            }
          ]
        }
      ]
    },
    {
      path: '/page02',
      name: 'page02',
      component: page02
    }
  ]
})

