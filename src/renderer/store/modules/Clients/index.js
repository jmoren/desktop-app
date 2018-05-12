import getters from "./getters";
import actions from "./actions";
import * as types from "../types";

const state = {
  list: []
};

const mutations = {
  [types.LOAD_CLIENTS_SUCCESS](state, data) {
    state.list = data.clients;
  },
  [types.ADD_CLIENT_SUCCESS](state, data) {
    state.list.push(data);
  },
  [types.LOAD_CLIENTS_ERROR](state) {
    state.list = [];
  }
};

export default { state, mutations, getters, actions, namespaced: true };
