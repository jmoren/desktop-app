import Vue from 'vue'
import Vuex from 'vuex'

import Clients from './modules/Clients'
import Tables from './modules/Tables'
import Tickets from './modules/Tickets'
import Shared from './modules/Shared'
import UI from './modules/UI'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Clients,
    Tickets,
    Tables,
    Shared,
    UI
  },
  strict: process.env.NODE_ENV !== 'production'
})
