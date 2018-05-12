import axios from "axios";
import * as types from "../types";
import JWTDecode from "jwt-decode";
import { extend } from "lodash";

const LOGIN_URL = "authenticate";

const login = ({ state, commit }, credentials) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        LOGIN_URL,
        { email: credentials.email, password: credentials.password },
        { headers: { Authorization: null } }
      )
      .then(response => {
        const accessToken = response.data.auth_token;
        let payload = JWTDecode(accessToken);
        let user = extend(
          {},
          {
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
          },
          payload
        );

        localStorage.setItem("@token_id", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        commit(types.LOGIN_SUCCESS, { user, accessToken });
        resolve(user);
      })
      .catch(error => {
        commit(types.LOGIN_ERROR);
        reject(error);
      });
  });
};

async function logout({ state, commit }) {
  return new Promise((resolve, reject) => {
    localStorage.removeItem("@token_id");
    localStorage.removeItem("user");
    commit(types.LOGOUT_SUCCESS);
    resolve();
  });
}

export default {
  login,
  logout
};
