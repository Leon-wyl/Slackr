import { BACKEND_PORT } from "./config.js";
import { appendText, errorModalPop, removeAllChildren } from "./helpers.js";

export const getSingleUserInfo = (id) => {
	const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
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
}

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
        errorModalPop("You are not authorized to see the channel creator. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
}