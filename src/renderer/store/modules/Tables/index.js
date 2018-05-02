import getters from './getters'
import actions from './actions'
import * as types from '../types'
import _ from 'lodash'

const state = {
  list: []
}

const mutations = {
  [types.LOAD_TABLES_SUCCESS] (state, data) {
    state.list = data.tables
  },
  [types.ADD_TABLE_SUCCESS] (state, data) {
    state.list.push(data)
  },
  [types.OPEN_TABLE_SUCCESS] (state, data) {
    let table = state.list.find((table) => {
      return table.id === data.id
    })
    _.extend(table, data)
  },
  [types.LOAD_TABLES_ERROR] (state) {
    state.list = []
  }
}

export default { state, mutations, getters, actions, namespaced: true }
