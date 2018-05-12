import axios from "axios";
import router from "../router";

export default function setup() {
  axios.interceptors.request.use(
    function(config) {
      const token = localStorage.getItem("@token_id");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      config.headers["Accept"] = "application/json";
      config.headers["Content-Type"] = "application/json";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Headers"] =
        "Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin";
      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    response => {
      return Promise.resolve(response);
    },
    error => {
      if (error.response.status === 401) {
        console.log(`Redirec to login: ${error.response.status}`);
        router.push("/login");
      }
      return Promise.reject(error.response);
    }
  );
}
