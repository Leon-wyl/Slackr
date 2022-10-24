import {
  errorModalPop,
  hideAllPages,
  loadMainPage,
  removeAllChildren,
} from "./helpers.js";
import {
  fetchEditChannel,
  fetchJoinChannel,
  fetchLeaveChannel,
  fetchCreatorName,
  fetchChannelInfo,
  fetchChannelsInfo,
  fetchCreateChannel,
} from "./channelsApi.js";
import { fetchMessages } from "./messagesApi.js";

// The creating channel feature
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
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: channelName,
      description: channelDescription,
      private: isPrivate,
    }),
  };

  fetchCreateChannel(options);
};

// For each channel in the array of channel, create an element for it
export const loadChannels = (channels, listId) => {
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
      "d-flex w-100 align-items-center justify-content-center"
    );
    divElement.setAttribute("id", "name-channel-list");
    buttonElement.appendChild(divElement);
    // create a text node of channel name, append it to the previous div
    const textNode = document.createTextNode(channel.name);
    divElement.appendChild(textNode);
  });
};

// After click a particular channel in the channel list, load the channel screen
export const getSingleChannelInfo = (event) => {
  const listItem = event.target.closest("button");
  if (!listItem) return;
  const channelName =
    listItem.querySelector("#name-channel-list").firstChild.nodeValue;
  const channelId = listItem.dataset.id;
  fetchChannelInfo(channelId, channelName);
};

// After fetch channel info, create a new channel card on the screen
export const createChannelCard = (data, channelId) => {
  // Show navbar and channel card on the screen
  hideAllPages();
  document.getElementById("navbar").style.display = "flex";
  document.getElementById("channel").style.display = "flex";
  // remove old information in channel car, load the new info
  removeChannelOriginInfo();
  loadChannelInfo(data);
  // Load channel name and description of settings
  document.getElementById("channel-settings-name").value = data.name;
  document.getElementById("channel-settings-description").value =
    data.description;
  // set channel card to display
  document.getElementById("channel").setAttribute("data-id", channelId);
  // Get all messages
  fetchMessages(channelId, 0);
};

const removeChannelOriginInfo = () => {
  removeAllChildren("channel-name-info");
  removeAllChildren("channel-description-info");
  removeAllChildren("channel-status-modal-info");
  removeAllChildren("channel-creation-time-info");
  removeAllChildren("channel-creator-info");
  removeAllChildren("channel-name");
  removeAllChildren("channel-creator-info");
};

const loadChannelInfo = (data) => {
  // Create text node for info
  const name1 = document.createTextNode(data.name);
  const name2 = document.createTextNode(data.name);
  const description = document.createTextNode(data.description);
  const status = data.private
    ? document.createTextNode("Private")
    : document.createTextNode("Public");
  const dateObject = new Date(data.createdAt);
  const date = document.createTextNode(dateObject.toString());
  // Append new node to the modal and header
  document.getElementById("channel-name-info").appendChild(name1);
  document.getElementById("channel-description-info").appendChild(description);
  document.getElementById("channel-status-modal-info").appendChild(status);
  document.getElementById("channel-creation-time-info").appendChild(date);
  document.getElementById("channel-name").appendChild(name2);
  fetchCreatorName(data.creator);
};

// Edit the name and description of channel
export const editChannel = () => {
  // Get new name and description from the modal
  const name = document.getElementById("channel-settings-name").value;
  const description = document.getElementById(
    "channel-settings-description"
  ).value;
  // Check if the name valid
  if (!name) {
    errorModalPop("Channel name cannot be empty");
    return;
  }

  const channelId = document.getElementById("channel").dataset.id;
  const token = localStorage.getItem("token");
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  };
  fetchEditChannel(channelId, options);
  // After finish editing the channel, reload the channel list and channel card
  fetchChannelInfo(channelId);
  fetchChannelsInfo();
};

// Leave the channel feature
export const leaveChannel = () => {
  const channelElement = document.getElementById("channel");
  const channelId = channelElement.dataset.id;
  fetchLeaveChannel(channelId);
  // After leaving the channel, go back to the channel list page
  loadMainPage();
};

// when clicking a channel that is not joined yet, load the unjoined channel card
export const showUnjoinedChannel = (channelId, channelName) => {
  // show unjoined channel card
  hideAllPages();
  document.getElementById("navbar").style.display = "flex";
  document.getElementById("channel-unjoined").style.display = "flex";
  document.getElementById("channel-unjoined-card").style.display = "flex";
  // remove old info, load new info
  removeAllChildren("channel-unjoined-name");
  const channelNameElement = document.getElementById("channel-unjoined-name");
  const nameTextNode = document.createTextNode(channelName);
  channelNameElement.appendChild(nameTextNode);
  document
    .getElementById("channel-unjoined")
    .setAttribute("data-id", channelId);
};

// join a channel that is not yet join
export const joinChannel = () => {
  const token = localStorage.getItem("token");
  const channelId = document.getElementById("channel-unjoined").dataset.id;
  const channelName = document.getElementById("channel-unjoined-name")
    .firstChild.nodeValue;
  fetchJoinChannel(token, channelId, channelName);
};
