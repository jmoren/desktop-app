import * as types from '../types'
import axios from 'axios'

const fetchTicket = ({ state, commit }, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${id}`)
      .then(response => {
        commit(types.LOAD_TICKET_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_TICKET_ERROR)
        reject(error)
      })
  })
}

const fetchTicketEntries = ({ state, commit }, ticketId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${ticketId}/entries`)
      .then(response => {
        commit(types.LOAD_TICKET_ENTRIES_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_TICKET_ENTRIES_ERROR)
        reject(error)
      })
  })
}

const fetchTicketPayments = ({ state, commit }, ticketId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${ticketId}/payments`)
      .then(response => {
        commit(types.LOAD_TICKET_PAYMENTS_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_TICKET_PAYMENTS_ERROR)
        reject(error)
      })
  })
}

const fetchTickets = ({ state, commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('tickets')
      .then(response => {
        commit(types.LOAD_TICKETS_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_TICKETS_ERROR)
        reject(error)
      })
  })
}

const cleanStore = ({ state, commit }) => {
  commit(types.LOAD_TICKET_ERROR)
}

export default {
  fetchTicket,
  fetchTickets,
  fetchTicketEntries,
  fetchTicketPayments,
  cleanStore
}
