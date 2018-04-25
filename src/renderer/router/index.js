import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout'
import Tables from '@/components/Table/Tables'
import Clients from '@/components/Client/Clients'
import Client from '@/components/Client/Client'
import Ticket from '@/components/Ticket/Ticket'
import Tickets from '@/components/Ticket/Tickets'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'tables',
        component: Tables
      },
      {
        path: 'clients',
        name: 'clients',
        component: Clients
      },
      {
        path: 'clients/:id',
        name: 'client',
        component: Client
      },
      {
        path: 'tickets/:id',
        name: 'ticket',
        component: Ticket
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: Tickets
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
  }
]

const router = new Router({ routes, mode: 'history' })

export default router
