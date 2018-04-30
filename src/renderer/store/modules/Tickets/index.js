import getters from './getters'
import actions from './actions'
import * as types from '../types'
import _ from 'lodash'

const state = {
  tickets: [],
  ticket: {},
  entries: [],
  payments: []
}

const mutations = {
  [types.LOAD_TICKET_SUCCESS] (state, data) {
    state.ticket = data
  },
  [types.LOAD_TICKET_ERROR] (state) {
    state.payments = []
    state.entries = []
    state.ticket = {}
  },
  [types.LOAD_TICKET_PAYMENTS_SUCCESS] (state, data) {
    state.payments = data.payments
  },
  [types.LOAD_TICKET_PAYMENTS_ERROR] (state) {
    state.payments = []
  },
  [types.LOAD_TICKET_ENTRIES_SUCCESS] (state, data) {
    state.entries = data.entries
  },
  [types.LOAD_TICKET_ENTRIES_ERROR] (state) {
    state.entries = []
  },
  [types.ADD_TICKET_ENTRY_SUCCESS] (state, data) {
    state.entries.push(data)
  },
  [types.ADD_TICKET_PAYMENT_SUCCESS] (state, data) {
    state.payments.push(data)
  },
  [types.REMOVE_TICKET_PAYMENT_SUCCESS] (state, data) {
    let payment = state.payments.find((p) => {
      return data.id === p.id
    })
    if (payment) {
      let index = state.payments.indexOf(payment)
      state.payments.splice(index, 1)
    }
  },
  [types.REMOVE_TICKET_ENTRY_SUCCESS] (state, data) {
    let entry = state.entries.find((e) => {
      return data.id === e.id
    })
    if (entry) {
      let index = state.entries.indexOf(entry)
      state.entries.splice(index, 1)
    }
  },
  [types.UPDATE_ENTRY_SUCCESS] (state, data) {
    let en = state.entries.find((entry) => {
      return entry.id === data.id
    })
    _.extend(en, data)
  },
  [types.ADD_TICKET_PAYMENT_SUCCESS] (state, data) {
    state.payments.push(data)
  }
}

export default { state, mutations, getters, actions, namespaced: true }
