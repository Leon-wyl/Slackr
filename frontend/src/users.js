import { EMAIL_REGEX } from "./config.js";
import {
  appendText,
  errorModalPop,
  fileToDataUrl,
  hideAllPages,
  removeAllChildren,
} from "./helpers.js";
import {
  fetchAllUsers,
  fetchAllUsersDetail,
  fetchSingleUserForProfile,
  fetchUpdateUser,
} from "./usersApi.js";

// get names of all users through nested promise for invite select
export const getAllUsers = () => {
  const userPromiseArrayInOne = [];
  const userIdArray = [];
  // Get all user ids
  fetchAllUsers(userPromiseArrayInOne);
  Promise.all(userPromiseArrayInOne)
    .then((res) => {
      // If success, use the ids to get all user's detail
      const userPromiseArray = [];
      res[0].users.forEach((user) => {
        userIdArray.push(user.id);
        fetchAllUsersDetail(user.id, userPromiseArray);
      });
      return Promise.all(userPromiseArray);
    })
    .then((data) => {
      // If success, combine corresponding ids and names into object, except for use him/herself
      const userIdNameArray = [];
      for (let i = 0; i < userIdArray.length; i++) {
        if (userIdArray[i] !== Number(localStorage.getItem("userId"))) {
          userIdNameArray.push({
            id: userIdArray[i],
            name: data[i].name,
          });
        }
      }
      userIdNameArray.sort(compareNames);
      pushUserToSelect(userIdNameArray);
    });
};

// push the fetched user names to invite select
const pushUserToSelect = (userIdNameArray) => {
  removeAllChildren("multi-user-select");
  const selectNode = document.getElementById("multi-user-select");
  // Create a hidden option for user select, in order to do multiple select
  const hideOption = document.createElement("option");
  hideOption.hidden = true;
  selectNode.appendChild(hideOption);
  // loop through all ids/names, construction option elements to select element
  for (let i = 0; i < userIdNameArray.length; i++) {
    const optionNode = document.createElement("option");
    appendText(optionNode, userIdNameArray[i].name);
    optionNode.setAttribute("data-id", userIdNameArray[i].id);
    selectNode.appendChild(optionNode);
  }
};

// compare function for sorting
const compareNames = (a, b) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

// load profile page
export const loadProfile = (userId) => {
  hideAllPages();
  document.getElementById("navbar").style.display = "flex";
  document.getElementById("profile").style.display = "flex";
  fetchSingleUserForProfile(userId);
};

export const fillInfoToProfile = (data) => {
  // Remove last profile info
  removeAllChildren("name-profile");
  removeAllChildren("bio-profile");
  removeAllChildren("email-profile");
  removeAllChildren("avatar-container-profile");
  // Get all info nodes
  const nameNode = document.getElementById("name-profile");
  const bioNode = document.getElementById("bio-profile");
  const emailNode = document.getElementById("email-profile");
  const imageContainer = document.getElementById("avatar-container-profile");
  // fill info into info nodes
  appendText(nameNode, data.name);
  if (data.bio) appendText(bioNode, data.bio);
  appendText(emailNode, data.email);
  // Load image
  const newImageNode = document.createElement("img");
  data.image // If no info image, set the default image
    ? newImageNode.setAttribute("src", data.image)
    : newImageNode.setAttribute("src", "./Assets/avatar.png");
  newImageNode.setAttribute("class", "mt-3 mb-4");
  newImageNode.setAttribute("width", "128");
  newImageNode.setAttribute("height", "128");
  newImageNode.setAttribute("id", "image-profile");
  imageContainer.appendChild(newImageNode);
};

export const changePasswordShowState = (switchNode) => {
  const state = switchNode.dataset.state;
  const newPasswordInputNode = document.getElementById("new-password");
  if (state === "hidden") {
    // If in hidden state, show the password, change the text of toggle
    newPasswordInputNode.setAttribute("type", "text");
    switchNode.setAttribute("data-state", "show");
    removeAllChildren("password-show-state");
    appendText(switchNode, "Hide Password");
  } else {
    // If in show state, hide the password, change the text of toggle
    newPasswordInputNode.setAttribute("type", "password");
    switchNode.setAttribute("data-state", "hidden");
    removeAllChildren("password-show-state");
    appendText(switchNode, "Show Password");
  }
};

export const resetPassword = () => {
  const password = document.getElementById("new-password").value;
  if (password.length < 6) {
    errorModalPop("Length of password must be greater than six.");
    return;
  }
  fetchUpdateUser({ password: password });
};

export const fillInfoToEditProfile = () => {
  const nameText = document.getElementById("name-profile").firstChild.nodeValue;
  const emailText =
    document.getElementById("email-profile").firstChild.nodeValue;
  const bioText = document.getElementById("bio-profile").firstChild?.nodeValue;
  document.getElementById("name-profile-edit").value = nameText;
  document.getElementById("email-profile-edit").value = emailText;
  if (bioText) document.getElementById("bio-profile-edit").value = bioText;
};

export const editProfile = () => {
  const newName = document.getElementById("name-profile-edit").value;
  const newEmail = document.getElementById("email-profile-edit").value;
  const newBio = document.getElementById("bio-profile-edit").value;
  const oldEmail =
    document.getElementById("email-profile").firstChild.nodeValue;
  const file = document.getElementById("image-input-profile").files[0];
  // Check if new name and new email valid
  if (!newName) {
    errorModalPop("New name cannot be empty");
    return;
  }
  if (!newEmail.match(EMAIL_REGEX)) {
    errorModalPop("Invalid email");
    return;
  }
  // Construct options
  const options = { name: newName };
  if (oldEmail !== newEmail) options.email = newEmail;
  if (newBio) options.bio = newBio;
  if (file) {
    fileToDataUrl(file)
      .then((res) => {
        options.image = res;
        fetchUpdateUser(options);
        const userId = localStorage.getItem("userId");
        loadProfile(userId);
      })
      .catch(() => {
        errorModalPop("invalid image uploaded");
      });
  } else {
    fetchUpdateUser(options);
    const userId = localStorage.getItem("userId");
    loadProfile(userId);
  }
};
