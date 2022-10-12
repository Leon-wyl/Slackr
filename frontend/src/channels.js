import { BACKEND_PORT } from "./config.js";
import { errorModalPop, removeAllChildren } from "./helpers.js";

export const getChannelsInfo = () => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/channel`, {
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
            loadChannel(publicChannels, "public-channels-list");
            loadChannel(privateChannels, "private-channels-list");
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

export const createChannel = () => {
  const channelName = document.getElementById("create-channel-name").value;
  const channelDescription = document.getElementById(
    "create-channel-description"
  ).value;
  const isPrivate = document.getElementById(
    "create-channel-radio-private"
  ).checked;

  if (!channelName) {
    errorModalPop("Channel name cannot be empty!");
  }

  const token = localStorage.getItem("token");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      name: channelName,
      description: channelDescription,
      private: isPrivate,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/channel`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then(() => {
          getChannelsInfo();
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

const loadChannel = (channels, listId) => {
  removeAllChildren(listId);
  channels.map((channel) => {
    // Create a button element of channel, append it to the channel list
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", "channel-" + channel.id);
    buttonElement.setAttribute(
      "class",
      "list-group-item list-group-item-action py-3 lh-tight"
    );
    const listElement = document.getElementById(listId);
    listElement.appendChild(buttonElement);
    // create a div with the formats, append it to the previous button
    const divElement = document.createElement("div");
    divElement.setAttribute(
      "class",
      " w-100 align-items-center justify-content-between"
    );
    buttonElement.appendChild(divElement);
    // create a text node of channel name, append it to the previous div
    const textNode = document.createTextNode(channel.name);
    divElement.appendChild(textNode);
  });
};
