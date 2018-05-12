import * as types from "../types";
import axios from "axios";

const addTicketEntry = ({ state, commit }, { ticketId, entry }) => {
  console.log("Ticket id", ticketId);
  console.log("Entry", entry);
  return new Promise((resolve, reject) => {
    axios
      .post(`tickets/${ticketId}/entries`, { entry: entry })
      .then(response => {
        commit(types.ADD_TICKET_ENTRY_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateTicketEntry = ({ state, commit }, entry) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`tickets/${entry.ticket_id}/entries/${entry.id}`, { entry: entry })
      .then(response => {
        commit(types.UPDATE_TICKET_ENTRY_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const fetchTicketEntries = ({ state, commit }, ticketId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${ticketId}/entries`)
      .then(response => {
        commit(types.LOAD_TICKET_ENTRIES_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        commit(types.LOAD_TICKET_ENTRIES_ERROR);
        reject(error);
      });
  });
};

export default {
  addTicketEntry,
  fetchTicketEntries,
  updateTicketEntry
};
