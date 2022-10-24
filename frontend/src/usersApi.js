import { BACKEND_PORT } from "./config.js";
import {
  appendText,
  errorModalPop,
  removeAllChildren,
  successModalPop,
} from "./helpers.js";
import { fillInfoToProfile } from "./users.js";

// api for fetching user info into messages
export const fetchSingleUserInfoForMessage = (id, avatarNode, userNameNode) => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            appendText(userNameNode, data.name);
            if (data.image) {
              avatarNode.querySelector("#default-image").remove();
              const imgNode = document.createElement("img");
              imgNode.setAttribute("src", data.image);
              imgNode.setAttribute("width", "36");
              imgNode.setAttribute("height", "36");
              imgNode.setAttribute("class", "avatar-message");
              avatarNode.appendChild(imgNode);
            }
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel creator Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see the channel creator. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// api for fetching user info for profile
export const fetchSingleUserForProfile = (id) => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            console.log(data);
            fillInfoToProfile(data);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("User doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see user's info. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// api for fetching an list of all users' id, using a promise array
export const fetchAllUsers = (promiseArray) => {
  const token = localStorage.getItem("token");
  promiseArray.push(
    fetch(`http://localhost:${BACKEND_PORT}/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 403) {
          errorModalPop(
            "You are not authorized to see all users' information. Please logout and login again."
          );
        } else {
          errorModalPop("Something wrong happened.");
        }
      })
      .catch((err) => {
        errorModalPop(err);
      })
  );
};

// api for fetching all users' name, using a promise array
export const fetchAllUsersDetail = (id, promiseArray) => {
  const token = localStorage.getItem("token");
  promiseArray.push(
    fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 400) {
          errorModalPop("id Doesn't Exist.");
        } else if (res.status === 403) {
          errorModalPop(
            "You are not authorized to see the information of single id. Please logout and login again."
          );
        } else {
          errorModalPop("Something wrong happened.");
        }
      })
      .catch((err) => {
        errorModalPop(err);
      })
  );
};

// api for inviting user
export const fetchInviteUsers = (userIdArray) => {
  const token = localStorage.getItem("token");
  const channelId = document.getElementById("channel").dataset.id;
  userIdArray.forEach((userId) => {
    console.log(userId);
    fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          //
        } else if (res.status === 400) {
          errorModalPop(
            `This Id has already been in the channel or id Doesn't Exist: ${userId}.`
          );
        } else if (res.status === 403) {
          errorModalPop(
            `You are not authorized to invite this id: ${userId}. Please logout and login again.`
          );
        } else {
          errorModalPop("Something wrong happened.");
        }
      })
      .catch((err) => {
        errorModalPop(err);
      });
    successModalPop("You have invited these users!");
  });
};

//api for updating user's info
export const fetchUpdateUser = (options) => {
  const token = localStorage.getItem("token");
  console.log(options);
  fetch(`http://localhost:${BACKEND_PORT}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(options),
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            successModalPop("User profile edit successfully");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Invalid Input.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to change user's profile. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
