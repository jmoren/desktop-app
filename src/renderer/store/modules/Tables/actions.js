import * as types from '../types'
import axios from 'axios'

const fetchTables = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get('tables')
      .then(response => {
        commit(types.LOAD_TABLES_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(types.LOAD_TABLES_ERROR)
        reject(error)
      })
  })
}

export default {
  fetchTables
}
