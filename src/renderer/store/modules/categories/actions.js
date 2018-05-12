import * as types from "../types";
import axios from "axios";

const fetchCategories = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get("categories")
      .then(response => {
        commit(types.LOAD_CATEGORIES_SUCCESS, response.data);
        resolve(response.data);
      })
      .catch(error => {
        commit(types.LOAD_CATEGORIES_ERROR);
        reject(error);
      });
  });
};

export default {
  fetchCategories
};
