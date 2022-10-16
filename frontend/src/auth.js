import { BACKEND_PORT } from "./config.js";
import { errorModalPop, loadMainPage } from "./helpers.js";

export const signin = () => {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/auth/login`, options).then((res) => {
    console.log(res);
    if (res.ok) {
      res.json().then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        loadMainPage();
      });
    } else {
      res.json().then((data) => {
        errorModalPop(data.error);
      });
    }
  }).catch((err) => {
		errorModalPop(err);
	});
};

export const register = () => {
  const email = document.getElementById("registerEmail").value;
  const name = document.getElementById("registerName").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById(
    "registerConfirmPassword"
  ).value;

  if (password !== confirmPassword) {
    errorModalPop("Please make sure your passwords match.");
    return;
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      name: name,
      password: password,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/auth/register`, options).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        localStorage.setItem("token", data.token);
				localStorage.setItem("userId", data.userId);
      
        loadMainPage();
      });
    } else {
      res.json().then((data) => {
        errorModalPop(data.error);
      });
    }
  }).catch((err) => {
		errorModalPop(err)
	});
};
