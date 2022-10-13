import { BACKEND_PORT } from "./config.js";
import { errorModalPop } from "./helpers.js";

const URL = `http://localhost:${BACKEND_PORT}`;
const token = localStorage.getItem("token");

export const getFetch = (path, params) => {
  return fetch(URL + path + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return err;
          });
      }
    })
    .catch((err) => {
      return err;
    });
};
