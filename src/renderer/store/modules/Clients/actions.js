import * as types from '../types'
import axios from 'axios'

const fetchClients = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('/clients')
      .then(response => {
        commit(types.LOAD_CLIENTS_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_CLIENTS_ERROR)
        reject(error)
      })
  })
}

export default {
  fetchClients
}
