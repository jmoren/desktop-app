import getters from './getters'
import actions from './actions'
import * as types from '../types'

const state = {
  list: [],
  current: {}
}

const mutations = {
  [types.LOAD_TABLES_SUCCESS] (state, data) {
    state.list = data.tables
  },
  [types.LOAD_TABLES_ERROR] (state) {
    state.list = []
  }
}

export default { state, mutations, getters, actions, namespaced: true }
