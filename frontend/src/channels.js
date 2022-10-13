import { BACKEND_PORT } from "./config.js";
import { errorModalPop, insertAfter, removeAllChildren } from "./helpers.js";
import { getFetch } from "./api.js";

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

const loadChannels = (channels, listId) => {
  removeAllChildren(listId);
  channels.map((channel) => {
    // Create a button element of channel, append it to the channel list
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("data-id", channel.id);
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

export const getSingleChannelInfo = (event) => {
  const listItem = event.target.closest("button");
  if (!listItem) return;
  const channelId = listItem.dataset.id;
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}`, {
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
            createChannelCard(data, channelId);
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

const createChannelCard = (data, channelId) => {
  // Create text node for info
  const name1 = document.createTextNode(data.name);
  const name2 = document.createTextNode(data.name);
  const description = document.createTextNode(data.description);
  const status = data.private
    ? document.createTextNode("Private")
    : document.createTextNode("Public");
  const dateObject = new Date(data.createdAt);
  const date = document.createTextNode(dateObject.toString());
  const id = document.createTextNode(channelId);
  // Info modal and channel header remove children
  removeAllChildren("channel-name-info");
  removeAllChildren("channel-description-info");
  removeAllChildren("channel-status-modal-info");
  removeAllChildren("channel-creation-time-info");
  removeAllChildren("channel-creator-info");
  removeAllChildren("channel-name");
  removeAllChildren("channel-creator-info");
  removeAllChildren("channel-id-info");
  // Append new node to the modal and header
  document.getElementById("channel-name-info").appendChild(name1);
  document.getElementById("channel-description-info").appendChild(description);
  document.getElementById("channel-status-modal-info").appendChild(status);
  document.getElementById("channel-creation-time-info").appendChild(date);
  document.getElementById("channel-creation-time-info").appendChild(date);
  document.getElementById("channel-id-info").appendChild(id);
  document.getElementById("channel-name").appendChild(name2);
  getCreatorName(data.creator);
  // Load channel name and description of settings
  document.getElementById("channel-settings-name").value = data.name;
  document.getElementById("channel-settings-description").value =
    data.description;
  // set channel card to display
  document.getElementById("channel").style.display = "flex";
  document.getElementById("channel-card").style.display = "flex";
};

const getCreatorName = (id) => {
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
            console.log(data.name);
            const creator = document.createTextNode(data.name);
            document
              .getElementById("channel-creator-info")
              .appendChild(creator);
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

export const editChannel = () => {
  const name = document.getElementById("channel-settings-name").value;
  const description = document.getElementById(
    "channel-settings-description"
  ).value;
  
  if (!name) {
    errorModalPop("Channel name cannot be empty");
    return;
  }

  const channelId = document.getElementById('channel-id-info').firstChild.nodeValue
  const token = localStorage.getItem("token");
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  };

  fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}`, options)
  .then((res) => {
    console.log(res);
    if (res.ok) {
      res.json().then(() => {
        // Copy the text in setting to info if success
        const edittedName = document.getElementById("channel-settings-name").value;
        const edittedDes = document.getElementById("channel-settings-description").value;
        removeAllChildren("channel-name-info");
        removeAllChildren("channel-description-info");
        const edittedNameNode = document.createTextNode(edittedName);
        const edittedDesNode = document.createTextNode(edittedDes);
        document.getElementById("channel-name-info").appendChild(edittedNameNode);
        document.getElementById("channel-description-info").appendChild(edittedDesNode);
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
