import { BACKEND_PORT } from "./config.js";
import { errorModalPop, successModalPop } from "./helpers.js";
import {
  createChannelCard,
  showUnjoinedChannel,
  loadChannels,
} from "./channels.js";
import { removeAllChildren } from "./helpers.js";

const URL = `http://localhost:${BACKEND_PORT}`;

export const fetchJoinChannel = (token, channelId, channelName) => {
  fetch(`${URL}/channel/${channelId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        successModalPop("Successfully Join the channel!");
        fetchChannelInfo(channelId, channelName);
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to join the channel. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchLeaveChannel = (channelId) => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        successModalPop("Successfully Leave the channel!");
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to leave the channel. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchEditChannel = (channelId, options) => {
  fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then(() => {
          // Copy the text in setting to info if success
          const edittedName = document.getElementById(
            "channel-settings-name"
          ).value;
          const edittedDes = document.getElementById(
            "channel-settings-description"
          ).value;
          removeAllChildren("channel-name-info");
          removeAllChildren("channel-description-info");
          const edittedNameNode = document.createTextNode(edittedName);
          const edittedDesNode = document.createTextNode(edittedDes);
          document
            .getElementById("channel-name-info")
            .appendChild(edittedNameNode);
          document
            .getElementById("channel-description-info")
            .appendChild(edittedDesNode);
          // Update channel info and channels list
          fetchChannelInfo(channelId);
          fetchChannelsInfo();
        });
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to edit the channel info. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchCreatorName = (id) => {
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
            console.log(data.name);
            const creator = document.createTextNode(data.name);
            document
              .getElementById("channel-creator-info")
              .appendChild(creator);
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
};

export const fetchChannelInfo = (channelId, channelName) => {
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
      } else if (res.status === 403) {
        showUnjoinedChannel(channelId, channelName);
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchChannelsInfo = () => {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/channel`, {
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
            const userId = Number(localStorage.getItem("userId"));
            const publicChannels = data.channels.filter(
              (channel) => !channel.private
            );
            console.log(userId);
            const privateChannels = data.channels
              .filter((channel) => channel.private)
              .filter((channel) => channel.members.includes(userId));
            loadChannels(publicChannels, "public-channels-list");
            loadChannels(privateChannels, "private-channels-list");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to see the channels lists. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchCreateChannel = (options) => {
  fetch(`http://localhost:${BACKEND_PORT}/channel`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then(() => {
          fetchChannelsInfo();
        });
      } else if (res.status === 400) {
        errorModalPop(
          "Input Channel Name or Channel description is not valid."
        );
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to create the channel. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
