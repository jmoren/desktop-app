import * as types from "../types";
import axios from "axios";

const fetchTicket = ({ state, commit }, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${id}`)
      .then(response => {
        commit(types.LOAD_TICKET_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        commit(types.LOAD_TICKET_ERROR);
        reject(error);
      });
  });
};

const createDelivery = ({ state, commit }, params) => {
  return new Promise((resolve, reject) => {
    axios
      .post("tickets", { ticket: params })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const searchTicket = ({ commit }, criteria) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/search?criteria=${criteria}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const fetchTicketPayments = ({ state, commit }, ticketId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${ticketId}/payments`)
      .then(response => {
        commit(types.LOAD_TICKET_PAYMENTS_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        commit(types.LOAD_TICKET_PAYMENTS_ERROR);
        reject(error);
      });
  });
};

const fetchTickets = ({ state, commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get("tickets")
      .then(response => {
        commit(types.LOAD_TICKETS_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        commit(types.LOAD_TICKETS_ERROR);
        reject(error);
      });
  });
};

const addPayment = ({ state, commit }, payment) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`tickets/${payment.ticket_id}/payments`, { payment: payment })
      .then(response => {
        commit(types.ADD_TICKET_PAYMENT_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
const cleanStore = ({ state, commit }) => {
  commit(types.LOAD_TICKET_ERROR);
};

export default {
  fetchTicket,
  fetchTickets,
  fetchTicketPayments,
  addPayment,
  cleanStore,
  searchTicket,
  createDelivery
};
