import * as types from '../types'
import axios from 'axios'

const fetchClient = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`clients/${id}`).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

const searchClient = ({ commit }, criteria) => {
  console.log(criteria)
  return new Promise((resolve, reject) => {
    axios.get(`clients/search?criteria=${criteria}`).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

const fetchClients = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('clients')
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
  fetchClients,
  fetchClient,
  searchClient
}
