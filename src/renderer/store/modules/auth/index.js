import getters from './getters'
import actions from './actions'
import * as types from '../types'

const state = {
  user: {}
}

const mutations = {
  [types.LOGIN_SUCCESS] (state, data) {
    state.user = data.user
  },
  [types.LOGIN_ERROR] (state) {
    state.user = {}
  },
  [types.LOGOUT_SUCCESS] (state) {
    state.user = {}
  }
}

export default { state, mutations, getters, actions, namespaced: true }
