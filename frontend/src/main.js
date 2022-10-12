import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";
import { register, signin } from "./auth.js";
import { removeAllChildren } from "./helpers.js";
import { createChannel } from "./channels.js";

console.log("Let's go!");

// Event listeners
document.getElementById("btn-signin").addEventListener("click", () => {
  signin();
});

document.getElementById("btn-register").addEventListener("click", () => {
  register();
});

document.getElementById("btn-to-register").addEventListener("click", () => {
  const registerPage = document.getElementById("page-register");
  const signinPage = document.getElementById("page-signin");
  signinPage.style.display = "none";
  registerPage.style.display = "flex";
});

document.getElementById("btn-to-signin").addEventListener("click", () => {
  const registerPage = document.getElementById("page-register");
  const signinPage = document.getElementById("page-signin");
  signinPage.style.display = "flex";
  registerPage.style.display = "none";
});

document.getElementById("error-modal").addEventListener("hide.bs.modal", () => {
  removeAllChildren("modal-body");
});

document.getElementById("btn-create-channel").addEventListener('click', () => {
	const modal = new bootstrap.Modal(document.getElementById("create-channel-modal"));
  modal.show();
})

document.getElementById("create-channel-submit").addEventListener('click', () => {
	createChannel();
});
