import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout'
import Tables from '@/components/Table/Tables'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Tables',
          component: Tables
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: require('@/components/Login').default
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: require('@/components/NotFound').default
    },
    {
      path: '*',
      redirect: '/not-found'
    }
  ]
})
