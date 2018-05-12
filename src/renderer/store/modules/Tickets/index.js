import getters from "./getters";
import actions from "./actions";
import * as types from "../types";

const state = {
  tickets: [],
  ticket: {},
  entries: [],
  payments: []
};

const mutations = {
  [types.LOAD_TICKET_SUCCESS](state, data) {
    state.ticket = data;
  },
  [types.LOAD_TICKET_ERROR](state) {
    state.payments = [];
    state.entries = [];
    state.ticket = {};
  },
  [types.LOAD_TICKET_PAYMENTS_SUCCESS](state, data) {
    state.payments = data.payments;
  },
  [types.LOAD_TICKET_PAYMENTS_ERROR](state) {
    state.payments = [];
  },
  [types.ADD_TICKET_PAYMENT_SUCCESS](state, data) {
    state.payments.push(data);
  },
  [types.REMOVE_TICKET_PAYMENT_SUCCESS](state, data) {
    let payment = state.payments.find(p => {
      return data.id === p.id;
    });
    if (payment) {
      let index = state.payments.indexOf(payment);
      state.payments.splice(index, 1);
    }
  }
};

export default { state, mutations, getters, actions, namespaced: true };
