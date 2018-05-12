import getters from "./getters";
import actions from "./actions";
import * as types from "../types";
import _ from "lodash";

const state = {
  entries: []
};

const mutations = {
  [types.LOAD_TICKET_ENTRIES_SUCCESS](state, data) {
    state.entries = data.entries;
  },
  [types.LOAD_TICKET_ENTRIES_ERROR](state) {
    state.entries = [];
  },
  [types.ADD_TICKET_ENTRY_SUCCESS](state, data) {
    state.entries.push(data);
  },
  [types.UPDATE_TICKET_ENTRY_SUCCESS](state, data) {
    let en = state.entries.find(entry => {
      return entry.id === data.id;
    });
    let index = state.entries.indexOf(en);
    state.entries.splice(index, 1, data);
  }
};

export default { state, mutations, getters, actions, namespaced: true };
