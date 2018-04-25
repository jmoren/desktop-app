import axios from 'axios'

const fetchTicket = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`tickets/${id}`)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const fetchTickets = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('tickets')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  fetchTicket,
  fetchTickets
}
