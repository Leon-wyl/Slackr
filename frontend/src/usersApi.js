import { BACKEND_PORT } from "./config.js";
import {
  appendText,
  errorModalPop,
  removeAllChildren,
  successModalPop,
} from "./helpers.js";
import { fillInfoToProfile } from "./users.js";

export const getSingleUserInfo = (id) => {
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
            console.log(data.channels);
            const publicChannels = data.channels.filter(
              (channel) => !channel.private
            );
            const privateChannels = data.channels.filter(
              (channel) => channel.private
            );
            loadChannels(publicChannels, "public-channels-list");
            loadChannels(privateChannels, "private-channels-list");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

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
              removeAllChildren(avatarNode);
              const imgNode = document.createElement("img");
              imgNode.setAttribute("src", data.image);
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
}

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

// const fetchSingleUserForName = (id) => {
//   const token = localStorage.getItem("token");
//   fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   })
//     .then((res) => {
//       if (res.ok) {
//         res
//           .json()
//           .then((data) => {
//             pushUserToSelect(data.name, data.id);
//           })
//           .catch((err) => {
//             errorModalPop(err);
//           });
//       } else if (res.status === 400) {
//         errorModalPop("Channel creator Doesn't Exist.");
//       } else if (res.status === 403) {
//         errorModalPop(
//           "You are not authorized to see the channel creator. Please logout and login again."
//         );
//       } else {
//         errorModalPop("Something wrong happened.");
//       }
//     })
//     .catch((err) => {
//       errorModalPop(err);
//     });
// };

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
      })
    })
      .then((res) => {
        if (res.ok) {
          //
        } else if (res.status === 400) {
          errorModalPop(`This Id has already been in the channel or id Doesn't Exist: ${userId}.`);
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
      })
      successModalPop("You have invited these users!");
  })
}

export const fetchUpdateUser = (options) => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(options)
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            successModalPop("Change password successfully");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("User doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to change user's password. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
}