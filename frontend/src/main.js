import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import {
  fileToDataUrl,
  hideAllPages,
  loadMainPage,
} from "./helpers.js";
import { register, signin } from "./auth.js";
import { removeAllChildren } from "./helpers.js";
import {
  createChannel,
  getSingleChannelInfo,
  editChannel,
  leaveChannel,
  joinChannel,
} from "./channels.js";
import {
  sendMessage,
  fillMsgToEditModal,
  editMessage,
  deleteMessage,
  setAttributeToDeleteModal,
  sendImage,
  loadBigImage,
} from "./message.js";
import { fetchMessages } from "./messagesApi.js";
import { changePasswordShowState, editProfile, fillInfoToEditProfile, getAllUsers, loadProfile, resetPassword } from "./users.js";
import { fetchInviteUsers } from "./usersApi.js";

console.log("Let's go!");

const selectedOptionNames = [];
const selectedOptionIds = [];

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

// // Create channel modal behaviours
// const createChannelModal = new bootstrap.Modal(document.getElementById("create-channel-modal"));
// document.getElementById("btn-create-channel").addEventListener('click', () => {
// 	// const modal = new bootstrap.Modal(document.getElementById("create-channel-modal"));
//   createChannelModal.show();
// })

document
  .getElementById("create-channel-submit")
  .addEventListener("click", () => {
    createChannel();
  });

document
  .getElementById("public-channels-list")
  .addEventListener("click", (event) => {
    getSingleChannelInfo(event);
    selectedOptionNames.length = 0;
    selectedOptionIds.length = 0;
  });

document
  .getElementById("private-channels-list")
  .addEventListener("click", (event) => {
    getSingleChannelInfo(event);
    selectedOptionNames.length = 0;
    selectedOptionIds.length = 0;
  });

document
  .getElementById("channel-settings-submit")
  .addEventListener("click", () => {
    editChannel();
  });

document.getElementById("leave-modal-button").addEventListener("click", () => {
  leaveChannel();
});

document.getElementById("send-button-message").addEventListener("click", () => {
  sendMessage();
});

document
  .getElementById("join-btn-unjoined-card")
  .addEventListener("click", () => {
    joinChannel();
  });

document.getElementById("logo").addEventListener("click", () => {
  loadMainPage();
});

document.getElementById("all-messages").addEventListener("click", (event) => {
  if (event.target.closest(".edit-message")) {
    fillMsgToEditModal(event.target.dataset.id);
  } else if (event.target.closest(".delete-message")) {
    setAttributeToDeleteModal(event.target.dataset.id);
  } else if (event.target.closest(".user-name-message")) {
    const userId = event.target.dataset.senderid;
    loadProfile(userId);
    document.getElementById("change-password-btn").style.display = "none";
    document.getElementById("edit-profile-btn").style.display = "none";
  } else if (event.target.closest(".image-message")) {
    loadBigImage(event.target);
  }
});

document.getElementById("message-edit-submit").addEventListener("click", () => {
  editMessage();
});

document
  .getElementById("message-delete-submit")
  .addEventListener("click", () => {
    deleteMessage();
  });

// Use an event listener on scrolling the message to trigger infinite scrolling
document.getElementById("all-messages").addEventListener("scroll", (e) => {
  const requestFlag =
    document.getElementById("all-messages").dataset.requestflag;
  if (e.target.scrollTop < 25 && requestFlag === "false") {
    loadMessage();
  }
});

// Infinite scrolling
const loadMessage = () => {
  const loading = document.getElementById("loading-container").cloneNode(true);
  loading.style.display = "flex";
  const allMsgNode = document.getElementById("all-messages");
  allMsgNode.setAttribute("data-requestflag", "true");
  allMsgNode.insertBefore(loading, allMsgNode.firstChild);
  setTimeout(() => {
    allMsgNode.removeChild(loading);
    allMsgNode.setAttribute("data-requestflag", "false");
    if (allMsgNode.dataset.loadfinish === "true") {
      allMsgNode.setAttribute("data-requestflag", "true");
      return;
    }
    const nextPageNumber = Number(allMsgNode.dataset.number);
    const channelId = document.getElementById("channel").dataset.id;
    fetchMessages(channelId, nextPageNumber);
  }, 1000);
};

document.getElementById("invite-button").addEventListener("click", () => {
  getAllUsers();
});

// Multiple select dropdown
document.getElementById("multi-user-select").addEventListener("input", () => {
  const select = document.getElementById("multi-user-select");
  
  const hideOption = document.createElement("option");
  hideOption.hidden = true;
  select.appendChild(hideOption);

  let selectedOptionNode = select.options[select.selectedIndex];
  let index = selectedOptionIds.indexOf(selectedOptionNode.dataset.id);
  if (index > -1) {
    selectedOptionIds.splice(index, 1)
    selectedOptionNames.splice(index, 1);
  } else {
    selectedOptionIds.push(selectedOptionNode.dataset.id)
    selectedOptionNames.push(selectedOptionNode.value);
  }
  select.options[select.length - 1].text = selectedOptionNames.toString();
  selectedOptionNames.length > 0
    ? (select.options[select.length - 1].selected = true)
    : (select.options[0].selected = true);
  console.log(selectedOptionNode.dataset.id)
});

document.getElementById("invite-modal-button").addEventListener("click", () => {
  fetchInviteUsers(selectedOptionIds);
})

document.getElementById("profile-btn-navbar").addEventListener('click', () => {
  const userId = Number(localStorage.getItem("userId"));
  loadProfile(userId);
  document.getElementById("change-password-btn").style.display = "flex";
  document.getElementById("edit-profile-btn").style.display = "flex";
})

document.getElementById("password-show-state").addEventListener('click', (event) => {
  const node = event.target;
  changePasswordShowState(node);
})

document.getElementById("change-password-button").addEventListener('click', () => {
  resetPassword();
})

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  fillInfoToEditProfile();
})

document.getElementById("profile-edit-submit").addEventListener('click', () => {
  editProfile();
})

document.getElementById("image-send-message").addEventListener("change", (event) => {
  sendImage(event.target);
});
