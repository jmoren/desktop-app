import * as types from '../types'
import axios from 'axios'

const fetchProducts = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('products')
      .then(response => {
        commit(types.LOAD_PRODUCTS_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_PRODUCTS_ERROR)
        reject(error)
      })
  })
}

export default {
  fetchProducts
}
