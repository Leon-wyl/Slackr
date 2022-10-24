import { BACKEND_PORT } from "./config.js";
import { errorModalPop, successModalPop } from "./helpers.js";
import {
  createChannelCard,
  showUnjoinedChannel,
  loadChannels,
} from "./channels.js";
import { removeAllChildren } from "./helpers.js";

const URL = `http://localhost:${BACKEND_PORT}`;

// Api for /channel/{channelId}/join
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
        // after success, load the joined channel info
        fetchChannelInfo(channelId, channelName);
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to join the channel. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// Api for /channel/{channelId}/leave
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
        errorModalPop(
          "You are not authorized to leave the channel. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// Api for put method of /channel/{channelId}, which is editing the channel info
export const fetchEditChannel = (channelId, options) => {
  fetch(`http://localhost:${BACKEND_PORT}/channel/${channelId}`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then(() => {
          // remove old info in channel card
          removeAllChildren("channel-name-info");
          removeAllChildren("channel-description-info");
          // Copy the text in setting to info if success
          const edittedName = document.getElementById(
            "channel-settings-name"
          ).value;
          const edittedDes = document.getElementById(
            "channel-settings-description"
          ).value;
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
        errorModalPop(
          "You are not authorized to edit the channel info. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// fetch the name creator of the channel for channel info modal
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

// Api for getting info of a single channel
export const fetchChannelInfo = (channelId, channelName) => {
  const token = localStorage.getItem("token");
  console.log(token);
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

// fetching the info for all channels, this is for creating a channel list
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
            // Create list of public channels and private channels
            const userId = Number(localStorage.getItem("userId"));
            const publicChannels = data.channels.filter(
              (channel) => !channel.private
            );
            const privateChannels = data.channels
              .filter((channel) => channel.private)
              .filter((channel) => channel.members.includes(userId));
            // Then load it into the two channel list in the main page
            loadChannels(publicChannels, "public-channels-list");
            loadChannels(privateChannels, "private-channels-list");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see the channels lists. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// Api for create a new channel
export const fetchCreateChannel = (options) => {
  fetch(`http://localhost:${BACKEND_PORT}/channel`, options)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then(() => {
          // after creating a new channel, reload the two channel list
          fetchChannelsInfo();
        });
      } else if (res.status === 400) {
        errorModalPop(
          "Input Channel Name or Channel description is not valid."
        );
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to create the channel. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
