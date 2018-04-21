import Vue from 'vue'
import Vuex from 'vuex'

import clients from './modules/clients'
import tables from './modules/tables'
import tickets from './modules/tickets'
import products from './modules/products'
import shared from './modules/shared'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    clients,
    tickets,
    tables,
    products,
    shared,
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
})
