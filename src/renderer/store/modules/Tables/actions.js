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

const saveTable = ({ state, commit }, table) => {
  return new Promise((resolve, reject) => {
    axios
      .post('tables', { table: table })
      .then(response => {
        commit(types.ADD_TABLE_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const openTable = ({ state, commit }, tableId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`tables/${tableId}/open`)
      .then(response => {
        commit(types.OPEN_TABLE_SUCCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export default {
  fetchTables,
  saveTable,
  openTable
}
