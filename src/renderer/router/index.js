import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout'
import Tables from '@/components/Table/Tables'
import Clients from '@/components/Client/Clients'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Tables',
        component: Tables
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Clients
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

const router = new Router({ routes, mode: 'history' })

export default router
