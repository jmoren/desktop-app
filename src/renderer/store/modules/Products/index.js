import getters from "./getters";
import actions from "./actions";
import * as types from "../types";

const state = {
  list: []
};

const mutations = {
  [types.LOAD_PRODUCTS_SUCCESS](state, data) {
    state.list = data.products;
  },
  [types.LOAD_PRODUCTS_ERROR](state) {
    state.list = [];
  }
};

export default { state, mutations, getters, actions, namespaced: true };
