import getters from './getters'
import actions from './actions'
import * as types from '../types'

const state = {
  list: []
}

const mutations = {
  [types.LOAD_CATEGORIES_SUCCESS] (state, data) {
    state.list = data.categories
  },
  [types.LOAD_CATEGORIES_ERROR] (state) {
    state.list = []
  }
}

export default { state, mutations, getters, actions, namespaced: true }
