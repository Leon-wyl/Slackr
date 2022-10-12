import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, hideAllPages } from "./helpers.js";
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
	hideAllPages();
  const registerPage = document.getElementById("page-register");
  registerPage.style.display = "flex";
});

document.getElementById("btn-to-signin").addEventListener("click", () => {
  const registerPage = document.getElementById("page-register");
  const signinPage = document.getElementById("page-signin");
  signinPage.style.display = "flex";
  registerPage.style.display = "none";
});

// Create channel modal behaviours
const createChannelModal = new bootstrap.Modal(document.getElementById("create-channel-modal"));
document.getElementById("btn-create-channel").addEventListener('click', () => {
	// const modal = new bootstrap.Modal(document.getElementById("create-channel-modal"));
  createChannelModal.show();
})

document.getElementById("create-channel-submit").addEventListener('click', () => {
	createChannel();
	createChannelModal.hide();
});
