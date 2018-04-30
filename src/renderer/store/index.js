import Vue from 'vue'
import Vuex from 'vuex'

import clients from './modules/clients'
import tables from './modules/tables'
import tickets from './modules/tickets'
import products from './modules/products'
import categories from './modules/categories'
import shared from './modules/shared'
import ui from './modules/ui'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    clients,
    tickets,
    tables,
    products,
    categories,
    shared,
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
})
