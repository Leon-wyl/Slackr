import { fetchRegister, fetchSignin } from "./authApi.js";
import { EMAIL_REGEX } from "./config.js";
import { errorModalPop } from "./helpers.js";

// The sign feature
export const signin = () => {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;
  fetchSignin(email, password);
};

// The register feature
export const register = () => {
  const email = document.getElementById("registerEmail").value;
  const name = document.getElementById("registerName").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById(
    "registerConfirmPassword"
  ).value;
  // check whether the email, name, password and confirm password valid
  if (!email.match(EMAIL_REGEX)) {
    errorModalPop("Invalid email");
    return;
  }
  if (password !== confirmPassword) {
    errorModalPop("Please make sure your passwords match.");
    return;
  }
  if (password.length < 6) {
    errorModalPop("Length of password must be greater than six.");
    return;
  }
  if (!name) {
    errorModalPop("Name cannot be empty.");
    return;
  }
  fetchRegister(email, name, password);
};
