import { BACKEND_PORT } from "./config.js";
import {
  errorModalPop,
  hideAllPages,
  loadMainPage,
  successModalPop,
} from "./helpers.js";

// The logout api
export const fetchLogout = () => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        res.json().then((data) => {
          errorModalPop(data.error);
        });
      } else {
        successModalPop("Successfully Logout");
      }
      // After clicking logout, route to login page, no matter success or not
      hideAllPages();
      document.getElementById("page-signin").style.display = "flex";
    })
    .catch((err) => {
      errorModalPop(err);
      hideAllPages();
      document.getElementById("page-signin").style.display = "flex";
    });
};

// The sign in api
export const fetchSignin = (email, password) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/auth/login`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then((data) => {
          // After log in, set token and user id into local storage, then load the main page with channel lists
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          loadMainPage();
        });
      } else {
        res.json().then((data) => {
          errorModalPop(data.error);
        });
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// The register api
export const fetchRegister = (email, name, password) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      name: name,
      password: password,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/auth/register`, options)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          // After register, set token and user id into local storage, then load the main page with channel lists
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          loadMainPage();
        });
      } else {
        res.json().then((data) => {
          errorModalPop(data.error);
        });
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
