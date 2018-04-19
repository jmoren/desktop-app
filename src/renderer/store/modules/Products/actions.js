import * as types from '../types'
import axios from 'axios'

const fetchProducts = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('/products')
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
  fetchProducts
}
