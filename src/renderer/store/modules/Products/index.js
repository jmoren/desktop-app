import getters from './getters'
import actions from './actions'
import * as types from '../types'

const state = {
  list: [],
  categories: []
}

const mutations = {
  [types.LOAD_PRODUCTS_SUCCESS] (state, data) {
    state.list = data.products
    state.categories = data.categories
  },
  [types.LOAD_PRODUCTS_ERROR] (state) {
    state.list = []
    state.categories = []
  }
}

export default { state, mutations, getters, actions, namespaced: true }
